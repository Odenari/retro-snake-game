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
let currentScore = 0;

// Draw game, map, snake, food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
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
  const el = document.createElement(tag);
  el.className = className;
  return el;
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
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
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
    food = generateFood();
    increaseSpeed();
    //deleting old interval and set new one to increase speed
    clearInterval(gameInterval);
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

  // event.key and .code conditions works for different browsers
  if (
    (!isGameRunning && event.code === 'Space') ||
    (!isGameRunning && event.key === 'Space')
  ) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp': {
        direction = 'up';
        break;
      }
      case 'ArrowDown': {
        direction = 'down';
        break;
      }
      case 'ArrowLeft': {
        direction = 'left';
        break;
      }
      case 'ArrowRight': {
        direction = 'right';
        break;
      }
    }
  }
}

document.addEventListener('keyup', handleKeyEvent);

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 7;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
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
    if (head.x === snake[i.x] && snake.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
  scoreText.textContent = '000';
}

function updateScore() {
  const currentScore = snake.length - 1;
  scoreText.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  isGameRunning = false;
  instructionsText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
    highScoreText.style.display = 'block';
    highScoreText.style.animationPlayState = 'running';
    console.log(highScoreText.style.animation);
  }
}
