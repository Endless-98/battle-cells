import js
import asyncio
import numpy as np

# Get canvas and context
canvas = js.document.getElementById("game")
ctx = canvas.getContext("2d")

# Grid settings
width, height = 40, 40  # 40x40 grid
cell_size = 10
grid = np.random.choice([0, 1], size=(height, width), p=[0.8, 0.2])  # Random initial state

def draw_grid():
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#F2E9E4"
    for y in range(height):
        for x in range(width):
            if grid[y, x] == 1:
                ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size)

async def game_loop():
    while True:
        # Compute next generation
        new_grid = np.zeros((height, width), dtype=int)
        for y in range(height):
            for x in range(width):
                # Count live neighbors (Moore neighborhood)
                neighbors = np.sum(grid[max(0, y-1):min(height, y+2), max(0, x-1):min(width, x+2)]) - grid[y, x]
                if grid[y, x] == 1 and neighbors in (2, 3):
                    new_grid[y, x] = 1
                elif grid[y, x] == 0 and neighbors == 3:
                    new_grid[y, x] = 1
        grid[:] = new_grid
        
        # Draw the grid
        draw_grid()
        
        # Wait for next frame
        await asyncio.sleep(0.1)  # Adjust speed as needed

# Start the game loop
draw_grid()  # Initial draw
asyncio.ensure_future(game_loop())