// Get canvas and context
const canvas = document.getElementById("game_of_life");
const canvasContext = canvas.getContext("2d");

const MAIN_CELL_COLOR = "rgba(242, 233, 228, 1)";
const GHOST_CELL_COLOR = "rgba(242, 233, 228, 0.5)";
const CELL_GRID_NUM_ROWS = 100;
const CELL_GRID_NUM_COLUMNS = 100;

// Initialize grid with random state (80% dead, 20% alive)
class cellGrid {
  constructor(
    color = MAIN_CELL_COLOR,
    fillAmount = 0.25,
    numColumns = CELL_GRID_NUM_COLUMNS,
    numRows = CELL_GRID_NUM_ROWS
  ) {
    this.numColumns = numColumns;
    this.numRows = numRows;
    this.color = color;
    this.cellWidth = canvas.width / this.numColumns;
    this.cellHeight = canvas.height / this.numRows;
    this.cellSize = Math.min(this.cellWidth, this.cellHeight);
    this.grid = this.initGrid(fillAmount);
    this.drawGrid();
  }

  initGrid(fillAmount = 0) {
    return Array(this.numRows)
      .fill()
      .map(() =>
        Array(this.numColumns)
          .fill()
          .map(() => (Math.random() < fillAmount ? 1 : 0))
      );
  }

  drawGrid(shouldClear = true) {
    if (shouldClear) canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillStyle = this.color;
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numColumns; x++) {
        if (this.grid[y][x] === 1) {
          canvasContext.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize,
            this.cellSize
          );
        }
      }
    }
  }

  advanceGrid(shouldDrawAfter = true) {
    const newGrid = Array(this.numRows)
      .fill()
      .map(() => Array(this.numColumns).fill(0));
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numColumns; x++) {
        // Count live neighbors (Moore neighborhood)
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            const ny = y + dy;
            const nx = x + dx;
            if (
              ny >= 0 &&
              ny < this.numRows &&
              nx >= 0 &&
              nx < this.numColumns
            ) {
              neighbors += this.grid[ny][nx];
            }
          }
        }
        // Apply Game of Life rules
        if (this.grid[y][x] === 1 && (neighbors === 2 || neighbors === 3)) {
          newGrid[y][x] = 1;
        } else if (this.grid[y][x] === 0 && neighbors === 3) {
          newGrid[y][x] = 1;
        }
      }
    }
    this.grid = newGrid;
    if (shouldDrawAfter) this.drawGrid();
  }

  // User interaction functions:
  setCellValue(cellX, cellY, shouldClear = false, value = 1) {
    const clickedCell = this.grid[cellX][cellY];
    console.log(`Click Cell (X${cellX}, Y${cellY}: ${clickedCell})`);
    this.grid[cellX][cellY] = value;
    this.drawGrid(false);
  }

  insertIntoGrid(otherGrid, clearAfter = true) {
    otherGrid.splice(
      0,
      otherGrid.length,
      ...otherGrid.map((row, x) =>
        row.map((cell, y) => cell || this.grid[x][y])
      )
    );
    if (clearAfter) {
      console.log("Inserting");
      this.grid = this.initGrid(0);
      this.drawGrid(false);
    }
  }
}

const ghostPlaceGrid = new cellGrid(GHOST_CELL_COLOR, 0);
const mainCellGrid = new cellGrid();
function gameLoop() {
  // Compute next generation
  mainCellGrid.advanceGrid();
  ghostPlaceGrid.drawGrid(false);
  // Schedule next frame
  setTimeout(gameLoop, 100); // 100ms delay
}

// Listen for input
canvas.addEventListener("click", function (e) {
  const cellX = Math.floor(e.offsetY / mainCellGrid.cellHeight);
  const cellY = Math.floor(e.offsetX / mainCellGrid.cellWidth);
  ghostPlaceGrid.setCellValue(cellX, cellY);
});

document.addEventListener("keydown", function (e) {
  ghostPlaceGrid.insertIntoGrid(mainCellGrid.grid);
});

gameLoop();
