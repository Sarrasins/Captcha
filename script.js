const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const container = document.getElementById("captcha-container");

canvas.width = 500;
canvas.height = 500;

// Configuration du jeu
const gridSize = 20;
const tileSize = canvas.width / gridSize;
let snake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
let food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
let direction = { x: 1, y: 0 };
let score = 0;
const snakeSpeed = 150; // Temps entre chaque déplacement en millisecondes
let lastMoveTime = 0;
let gameRunning = true;

// Dessine la pomme
function drawFood() {
  const appleImage = new Image();
  appleImage.src = "pomme.jpg"; // Assurez-vous que cette image est dans le même dossier
  appleImage.onload = () => {
    ctx.drawImage(
      appleImage,
      food.x * tileSize + 2,
      food.y * tileSize + 2,
      tileSize - 4,
      tileSize - 4
    );
  };
}

// Dessine le serpent
function drawSnake() {
  snake.forEach(({ x, y }, index) => {
    if (index === 0) {
      // Tête avec des yeux
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(x * tileSize + tileSize / 4, y * tileSize + tileSize / 4, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x * tileSize + (3 * tileSize) / 4, y * tileSize + tileSize / 4, 4, 0, 2 * Math.PI);
      ctx.fill();
    } else if (index === snake.length - 1) {
      // Queue arrondie
      ctx.fillStyle = "#4CAF50";
      ctx.beginPath();
      ctx.arc(
        x * tileSize + tileSize / 2,
        y * tileSize + tileSize / 2,
        tileSize / 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    } else {
      // Corps carré
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  });
}

// Met à jour la position du serpent
function moveSnake() {
  const newHead = {
    x: (snake[0].x + direction.x + gridSize) % gridSize,
    y: (snake[0].y + direction.y + gridSize) % gridSize,
  };

  if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
    gameRunning = false;
    gameOver();
    return;
  }

  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    if (score >= 5) {
      gameWin();
    } else {
      food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    }
  } else {
    snake.pop();
  }
}

// Gère la détection des touches
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
});

// Boucle du jeu
function gameLoop(timestamp) {
  if (!gameRunning) return;

  if (timestamp - lastMoveTime > snakeSpeed) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
    lastMoveTime = timestamp;
  }

  requestAnimationFrame(gameLoop);
}

// Fin du jeu
function gameOver() {
  alert("Game Over !");
  location.reload();
}

// Jeu terminé avec succès
function gameWin() {
  container.innerHTML = `
    <h1 class="text-2xl font-bold text-green-600">CAPTCHA Validé !</h1>
    <p class="text-gray-700 mt-2">Merci de votre coopération.</p>
  `;
}

// Démarre le jeu
requestAnimationFrame(gameLoop);
