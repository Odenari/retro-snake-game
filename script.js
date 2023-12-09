// Define HTML elements
const board = document.getElementById('gameBoard');
const scoreText = document.getElementById('currentScore');
const highScoreText = document.getElementById('highScore');
const instructionsText = document.getElementById('instructions');
const logo = document.getElementById('logo');

//pausing highScore animation
highScoreText.style.animationPlayState = 'paused';

//Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let highScore = 0;
let gameInterval;
let gameSpeedDelay = 200;
let isGameRunning = false;

// Object to keep score in memory
const STORE = {
  score: snake.length - 1,
  previousKey: '',
};

// Draw game, map, snake, food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
}

//Draw snake
function drawSnake() {
  snake.forEach(segment => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const HTMLelement = document.createElement(tag);
  HTMLelement.className = className;
  return HTMLelement;
}

// Set position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
  if (!isGameRunning) {
    return;
  }
  const foodElement = createGameElement('div', 'food');
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

// Generate food coordinates
function generateFood() {
  let x = Math.floor(Math.random() * gridSize) + 1;
  let y = Math.floor(Math.random() * gridSize) + 1;

  // Loop check if food el occupied same cluster with snake body
  // And would redraw food el if it is
  for (let i = 1; i < snake.length; i++) {
    if (
      (x === snake[i].x || x === snake[i].y) &&
      (y === snake[i].x || y === snake[i].y)
    ) {
      x = y = 0;
      generateFood();
    }
  }
  return { x, y };
}

// Moving the Snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
  }

  // Adding new part as first el of snake
  snake.unshift(head);

  // If snake hits food last segment wouldn't be deleted and snake would grow! =)
  if (head.x === food.x && head.y === food.y) {
    updateScore();
    food = generateFood();
    //deleting old interval and set new one to increase speed
    clearInterval(gameInterval);
    increaseSpeed();
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  // Keep tracking if game running
  isGameRunning = true;

  // Hiding elements from HTML
  instructionsText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Listener handler for starting the game
function handleKeyEvent(event) {
  event.preventDefault();

  // Those .key and .code conditions exists cuz of browser difference
  if (
    (!isGameRunning && event.code === 'Space') ||
    (!isGameRunning && event.key === 'Space')
  ) {
    startGame();
  } else {
    snake.length > 1
      ? setDirectionForLongerSnake(event.key)
      : setDirection(event.key);
  }
}

function setDirection(key) {
  switch (key) {
    case 'ArrowUp': {
      direction = 'up';
      STORE.previousKey = key;
      break;
    }
    case 'ArrowDown': {
      direction = 'down';
      STORE.previousKey = key;
      break;
    }
    case 'ArrowLeft': {
      direction = 'left';
      STORE.previousKey = key;
      break;
    }
    case 'ArrowRight': {
      direction = 'right';
      STORE.previousKey = key;
      break;
    }
  }
}

// This monstrosity will prevent gamer to send snake backward after snake longer than 1 segment
function setDirectionForLongerSnake(key) {
  switch (key) {
    case 'ArrowUp': {
      if (STORE.previousKey === 'ArrowDown') break;
      direction = 'up';
      STORE.previousKey = key;
      break;
    }
    case 'ArrowDown': {
      if (STORE.previousKey === 'ArrowUp') break;
      direction = 'down';
      STORE.previousKey = key;
      break;
    }
    case 'ArrowLeft': {
      if (STORE.previousKey === 'ArrowRight') break;
      direction = 'left';
      STORE.previousKey = key;
      break;
    }
    case 'ArrowRight': {
      if (STORE.previousKey === 'ArrowLeft') break;
      direction = 'right';
      STORE.previousKey = key;
      break;
    }
  }
}

document.addEventListener('keyup', handleKeyEvent);

function increaseSpeed() {
  if (gameSpeedDelay === 20) {
    return;
  }
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 7;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function updateScore() {
  if (gameSpeedDelay > 150) {
    STORE.score += 5;
  }
  if (gameSpeedDelay < 150) {
    STORE.score += 10;
  }
  if (gameSpeedDelay < 100) {
    STORE.score += 20;
  }
  if (gameSpeedDelay < 50) {
    STORE.score += 50;
  }

  scoreText.textContent = STORE.score.toString().padStart(3, '0');
}

function updateHighScore() {
  if (STORE.score > highScore) {
    highScore = STORE.score;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
    highScoreText.style.display = 'block';
    highScoreText.style.animationPlayState = 'running';
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  // updateScore();
  scoreText.textContent = '000';
}

function stopGame() {
  clearInterval(gameInterval);
  isGameRunning = false;
  instructionsText.style.display = 'block';
  logo.style.display = 'block';
}
