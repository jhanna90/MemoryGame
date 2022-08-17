const gameContainer = document.getElementById("game");
const start = document.getElementById('start');
const restart = document.getElementById('restart');
const matches = document.getElementById('matches');
const score = document.getElementById('score');
const scoreRecord = document.getElementById('score-record');
const gameStyle = document.getElementById('game-style');
const count = document.getElementById('count');

const cardColors = [
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

let currentMatches = 0;
let currentScore = 0;
let timeCountInterval = null;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array, count) {
  let newArray = [];
  for (let i = 0; i < count; i++) {
    newArray.push(array[i]);
    newArray.push(array[i]);
  }
  let counter = newArray.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = newArray[counter];
    newArray[counter] = newArray[index];
    newArray[index] = temp;
  }

  return newArray;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors() {
  let colors = [];
  let colorCount = parseInt(count.value);
  if (gameStyle.value === '0') {
    colors = cardColors;
  } else if (gameStyle.value === '1') {

    for (let i = 0; i < colorCount; i++) {
      let r = Math.round(Math.random() * 255);
      let g = Math.round(Math.random() * 255);
      let b = Math.round(Math.random() * 255);

      colors.push(`rgb(${r} , ${g} , ${b})`);
    }
  }

  let colorArray = shuffle(colors, colorCount);

  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.setAttribute('data-color', color);
    newDiv.setAttribute('data-face-up', 'false');

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

let firstDiv = null;
let secondDiv = null;

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  const clickDiv = event.target;

  if (firstDiv !== null && secondDiv !== null) {
    return false;
  }
  if (clickDiv.getAttribute("data-face-up") === 'true') {
    return false;
  }

  if (firstDiv === null || secondDiv === null) {
    if (gameStyle.value === '2') {
    } else {
      clickDiv.style.backgroundColor = clickDiv.getAttribute('data-color');
    }
    clickDiv.setAttribute('data-face-up', 'true');

    if (firstDiv === null) {
      firstDiv = clickDiv;
      secondDiv = null;
    } else {
      secondDiv = clickDiv;

      if (firstDiv.getAttribute('data-color') === secondDiv.getAttribute('data-color')) {

        firstDiv = null;
        secondDiv = null;

        currentMatches++;
        matches.innerText = currentMatches;

        if (currentMatches === parseInt(count.value)) {
          restart.disabled = false;
          count.disabled = false;
          gameStyle.disabled = false;
          clearInterval(timeCountInterval);
          let record = 10000;
          if (localStorage.getItem('score-record')) {
            record = parseInt(localStorage.getItem('score-record'));
          }

          if (record > currentScore) {
            alert('New High Score!!!');
            localStorage.setItem('score-record', currentScore);
            scoreRecord.innerText = currentScore;
          }
        }
      } else {
        setTimeout(flipBack, 1000);
      }
    }
  }
}

function flipBack() {
  firstDiv.style.backgroundColor = '#FFFFFF';
  secondDiv.style.backgroundColor = '#FFFFFF';
  firstDiv.style.backgroundImage = '';
  secondDiv.style.backgroundImage = '';
  firstDiv.setAttribute('data-face-up', 'false');
  secondDiv.setAttribute('data-face-up', 'false');
  firstDiv = null;
  secondDiv = null;
}

function gameStart() {
  game.innerHTML = '';
  currentMatches = 0;
  currentScore = 0;
  score.innerText = currentScore;
  matches.innerText = currentMatches;
  createDivsForColors();

  start.disabled = true;
  restart.disabled = true;
  count.disabled = true;
  gameStyle.disabled = true;

  timeCountInterval = setInterval(function () {
    currentScore++;
    score.innerText = currentScore;
  }, 1000);
}

function gameRestart() {
  gameStart();
}

scoreRecord.innerText = localStorage.getItem('score-record') ? localStorage.getItem('score-record') : '10000';

start.addEventListener('click', gameStart);
restart.addEventListener('click', gameRestart);