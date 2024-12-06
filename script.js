const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameMessage = document.getElementById("game-message");


canvas.width = 600;
canvas.height = 600;
let gameRunning = true;

const randomChoice = Math.random();
const gridSize = 20;
const tileSize = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
let direction = { x: 1, y: 0 };
let snakeScore = 0;
const snakeSpeed = 135;
let lastSnakeUpdateTime = 0;

// Snake colors
const snakeColors = ["#6EE7B7", "#34D399", "#10B981"];

function drawFood() {
  ctx.fillStyle = "gold";
  ctx.beginPath();
  ctx.arc(
    food.x * tileSize + tileSize / 2,
    food.y * tileSize + tileSize / 2,
    tileSize / 1.3,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.strokeStyle = "orange";
  ctx.stroke();
}

function drawSnake() {
  snake.forEach(({ x, y }, index) => {
    ctx.fillStyle = snakeColors[index % snakeColors.length];
    ctx.beginPath();
    ctx.arc(
      x * tileSize + tileSize / 2,
      y * tileSize + tileSize / 2,
      tileSize / 1.3,
      0,
      2 * Math.PI
    );
    ctx.fill();
    if (index === 0) {

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(x * tileSize + tileSize / 4, y * tileSize + tileSize / 3, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x * tileSize + (3 * tileSize) / 4, y * tileSize + tileSize / 3, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

function moveSnake() {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  // If the snake goes out of bounds, it wraps around to the other side
  if (newHead.x < 0) newHead.x = gridSize - 1; // Left side -> reappears on the right
  if (newHead.x >= gridSize) newHead.x = 0;   // Right side -> reappears on the left
  if (newHead.y < 0) newHead.y = gridSize - 1; // Top side -> reappears at the bottom
  if (newHead.y >= gridSize) newHead.y = 0;   // Bottom side -> reappears at the top

  // Check if the snake collides with itself
  if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
    gameOver("💀 Oh non ! Vous avez perdu.");
    return;
  }

  // Add the new head to the snake
  snake.unshift(newHead);

  // Check if the snake eats the food
  if (newHead.x === food.x && newHead.y === food.y) {
    snakeScore++;
    scoreDisplay.textContent = `Score : ${snakeScore}`;
    if (snakeScore === 5) {
      gameWin("🎉 Bravo ! CAPTCHA validé.");
    } else {
      // Generate a new food position
      food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    }
  } else {
    // If no food is eaten, remove the tail of the snake
    snake.pop();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
});

function gameLoopSnake(timestamp) {
  if (!gameRunning) return;

  if (timestamp - lastSnakeUpdateTime > snakeSpeed) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
    lastSnakeUpdateTime = timestamp;
  }

  requestAnimationFrame(gameLoopSnake);
}

let basket = { x: canvas.width / 2 - 40, y: canvas.height - 50, width: 80, height: 20 };
let fruit = { x: Math.random() * canvas.width, y: 0, size: 20, speed: 2 };
let caughtFruits = 0;

function drawBasket() {
  ctx.fillStyle = "#34D399";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawFruit() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(fruit.x, fruit.y, fruit.size, 0, 2 * Math.PI);
  ctx.fill();
}

function moveFruit() {
  fruit.y += fruit.speed;
  if (fruit.y > canvas.height) {
    fruit = { x: Math.random() * canvas.width, y: 0, size: 20, speed: 2 };
  }
}

function checkCatch() {
  if (
    fruit.y + fruit.size > basket.y &&
    fruit.x > basket.x &&
    fruit.x < basket.x + basket.width
  ) {
    caughtFruits++;
    scoreDisplay.textContent = `Score: ${caughtFruits}`;
    fruit = { x: Math.random() * canvas.width, y: 0, size: 20, speed: 2 };

    if (caughtFruits === 5) {
      gameWin("🎉 Bravo ! CAPTCHA validé.");
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && basket.x > 0) basket.x -= 20;
  if (e.key === "ArrowRight" && basket.x < canvas.width - basket.width) basket.x += 20;
});

function gameLoopFruit() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveFruit();
  drawFruit();
  drawBasket();
  checkCatch();

  requestAnimationFrame(gameLoopFruit);
}


function gameOver(message) {
  gameRunning = false;
  gameMessage.querySelector("h2").textContent = message;
  gameMessage.classList.remove("hidden");
}

function gameWin(message) {
  gameRunning = false;
  gameMessage.querySelector("h2").textContent = message;
  gameMessage.classList.remove("hidden");
}

function startSnakeGame() {
  gameRunning = true;
  requestAnimationFrame(gameLoopSnake);
}

function startCatchFruitGame() {
  gameRunning = true;
  requestAnimationFrame(gameLoopFruit);
}

if (randomChoice < 0.5) {
   startSnakeGame();
} else {
   startCatchFruitGame();
}