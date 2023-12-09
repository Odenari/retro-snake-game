// Define HTML elements
const board = document.getElementById('game-board');

//Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let isGameRunning = false;

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

  // If snake hits food last segment wouldn't be deleted
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    clearInterval();
    gameInterval = setInterval(() => {
      move();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  // Keep tracking if game running
  isGameRunning = true;
}

// Testing;
// draw();

setInterval(() => {
  draw();
  move('right');
}, 1000);
