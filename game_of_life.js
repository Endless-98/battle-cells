// Get canvas and context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Grid settings
const width = 40;
const height = 40;
const cellSize = 10;

// Initialize grid with random state (80% dead, 20% alive)
let grid = Array(height)
  .fill()
  .map(() =>
    Array(width)
      .fill()
      .map(() => (Math.random() < 0.2 ? 1 : 0))
  );

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#F2E9E4";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 1) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function gameLoop() {
  // Compute next generation
  const newGrid = Array(height)
    .fill()
    .map(() => Array(width).fill(0));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Count live neighbors (Moore neighborhood)
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            neighbors += grid[ny][nx];
          }
        }
      }
      // Apply Game of Life rules
      if (grid[y][x] === 1 && (neighbors === 2 || neighbors === 3)) {
        newGrid[y][x] = 1;
      } else if (grid[y][x] === 0 && neighbors === 3) {
        newGrid[y][x] = 1;
      }
    }
  }
  grid = newGrid;

  // Draw the grid
  drawGrid();

  // Schedule next frame
  setTimeout(gameLoop, 100); // 100ms delay
}

// Start the game
drawGrid(); // Initial draw
gameLoop();
