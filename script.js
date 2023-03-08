const gameContainer = document.getElementById("game");
const startButton = document.querySelector("#start");
const playAgainButton = document.querySelector("#playAgain");
const scoreSpan = document.querySelector("#score");
const lowScoreSpan = document.querySelector("#lowScore");
const value = document.querySelector("#value");
const input = document.querySelector("#numColors");

let maxColors = input.getAttribute("max");
const emptyScoreArray = Array(maxColors - 1).fill("");

let colors;
let deck;
let numClicks = 0;
let numMatches = 0;
let numColors = input.value - 1; 
let score = 0;
let lowScoreArray = JSON.parse(localStorage.getItem("lowScoreArray")) || emptyScoreArray;
let cardOne;
let shuffledColors;
let random;
let numToRemove;
let length;
let cards;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function buildDeck() {
  colors = [
    "rgb(250,157,191)",
    "rgb(255,0,0)",
    "rgb(255,153,127)",
    "rgb(255,127,0)",
    "rgb(255,255,0)",
    "rgb(200,255,0)",
    "rgb(0,255,0)",
    "rgb(0,255,215)",
    "rgb(160,205,240)",
    "rgb(0,0,255)",
    "rgb(127,0,255)",
    "rgb(209,173,234)",
    "rgb(255,0,255)",
    "rgb(220,220,220)",
    "rgb(100,100,100)",
    "rgb(0,0,0)"
  ];
  numToRemove = colors.length - input.value;
  
  for (let i = 1; i <= numToRemove; i++) {
    random = Math.floor(Math.random() * (colors.length - 1));
    colors.splice(random, 1);
  }
  length = colors.length;
  for (let i = 0; i < length; i++) {
    colors.push(colors[i]);
  }
  shuffledColors = shuffle(colors);
  return shuffledColors;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  numClicks++;
  
  if (numClicks === 1){
    event.target.style.backgroundColor = event.target.className;
    cardOne = event.target;
  }
  else if (numClicks === 2){
    score++;
    scoreSpan.innerText = score;
    event.target.style.backgroundColor = event.target.className;
    // do work of checking for a match and flipping cards back if needed
    if (cardOne === event.target){
      numClicks = 1;
    }
    else if (cardOne.className !== event.target.className){
    setTimeout(function() {
        cardOne.removeAttribute("style");
        event.target.removeAttribute("style");
        numClicks = 0;
      }, 1000);
    }
    else {
      numClicks = 0;
      numMatches++;
      if (numMatches === parseInt(input.value,10)) {
        numMatches = 0;
        playAgainButton.style.visibility = "visible";
        if (lowScoreArray[numColors] !== "") {
          if (score < lowScoreArray[numColors]) {
            lowScoreArray[numColors] = score;
            localStorage.setItem('lowScoreArray', JSON.stringify(lowScoreArray));
            lowScoreSpan.innerText = score;
          }
        }
        else {
          lowScoreArray[numColors] = score;
          localStorage.setItem('lowScoreArray', JSON.stringify(lowScoreArray));
          lowScoreSpan.innerText = score;
        }
      }
    }
  }
}

startButton.addEventListener("click", function(event) {
  deck = buildDeck();
  createDivsForColors(deck);
  startButton.style.visibility = "hidden";
  numColors = input.value - 1;
});

playAgainButton.addEventListener("click", function(event) {
  cards = gameContainer.children;
  for (let i = cards.length - 1 ; i >= 0; i--) {
    cards[i].remove();
  }
  score = 0;
  numColors = input.value - 1;
  lowScoreSpan.innerText = lowScoreArray[numColors];
  deck = buildDeck();
  createDivsForColors(deck);
  playAgainButton.style.visibility = "hidden";
});

lowScoreSpan.innerText = lowScoreArray[numColors];

value.textContent = input.value
input.addEventListener("input", function(event) {
  value.textContent = event.target.value;
  numColors = input.value - 1;
  lowScoreSpan.innerText = lowScoreArray[numColors];
})