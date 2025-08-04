// Get canvas and context
const canvas = document.getElementById("game_of_life");
const canvasContext = canvas.getContext("2d");

// Grid settings
const numColumns = 100;
const numRows = 100;
const cellWidth = canvas.width / numColumns;
const cellHeight = canvas.height / numRows;
const cellSize = Math.min(cellWidth, cellHeight);

// Initialize grid with random state (80% dead, 20% alive)
let grid = Array(numRows)
  .fill()
  .map(() =>
    Array(numColumns)
      .fill()
      .map(() => (Math.random() < 0.2 ? 1 : 0))
  );

function drawGrid() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = "#F2E9E4";
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numColumns; x++) {
      if (grid[y][x] === 1) {
        canvasContext.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function gameLoop() {
  // Compute next generation
  const newGrid = Array(numRows)
    .fill()
    .map(() => Array(numColumns).fill(0));
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numColumns; x++) {
      // Count live neighbors (Moore neighborhood)
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < numRows && nx >= 0 && nx < numColumns) {
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

// Listen for input
canvas.addEventListener("click", function (e) {
  const cellX = Math.floor(e.offsetY / cellHeight);
  const cellY = Math.floor(e.offsetX / cellWidth);
  clickedCell = grid[cellX][cellY];
  console.log(`Click Cell (X${cellX}, Y${cellY}: ${clickedCell})`);
  grid[cellX][cellY] = 1;
  drawGrid();
});

// Start the game
drawGrid(); // Initial draw
gameLoop();
