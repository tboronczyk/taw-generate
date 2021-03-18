const UP    = 0x1000;
const DOWN  = 0x0100;
const LEFT  = 0x0010;
const RIGHT = 0x0001;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class Maze {
    constructor(cellCount) {
        this.cellCount = cellCount;

        this.cells = [];
        for (let row = 0; row < cellCount; row++) {
            this.cells[row] = [];
            for (let col = 0; col < cellCount; col++) {
                this.cells[row][col] = {
                    visited: false,
                    walls: UP|DOWN|LEFT|RIGHT
                }
            }
        }

        // entrance and exit
        this.cells[0][0].walls ^= LEFT;
        this.cells[cellCount - 1][cellCount - 1].walls ^= RIGHT;
    }

    traverse(row, col) {
        this.cells[row][col].visited = true;

        const directions = [UP, DOWN, LEFT, RIGHT];
        shuffle(directions);

        directions.forEach(d => {
            switch (d) {
                case UP:
                    if (row > 0 && !this.cells[row - 1][col].visited) {
                        this.cells[row][col].walls ^= UP;
                        this.cells[row - 1][col].walls ^= DOWN;
                        this.traverse(row - 1, col);
                    }
                    break;

                case DOWN:
                    if (row < this.cellCount - 1 && !this.cells[row + 1][col].visited) {
                        this.cells[row][col].walls ^= DOWN;
                        this.cells[row + 1][col].walls ^= UP;
                        this.traverse(row + 1, col);
                    }
                    break;

                case LEFT:
                    if (col > 0 && !this.cells[row][col - 1].visited) {
                        this.cells[row][col].walls ^= LEFT;
                        this.cells[row][col - 1].walls ^= RIGHT;
                        this.traverse(row, col - 1);
                    }
                    break;

                case RIGHT:
                    if (col < this.cellCount - 1 && !this.cells[row][col + 1].visited) {
                        this.cells[row][col].walls ^= RIGHT;
                        this.cells[row][col + 1].walls ^= LEFT;
                        this.traverse(row, col + 1);
                    }
                    break;
            }
        });
    }

    render(ctx, cellSize) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';

        ctx.save();
        ctx.translate(1, 1);

        ctx.beginPath();
        for (let row = 0; row < this.cellCount; row++) {
            for (let col = 0; col < this.cellCount; col++) {
                if (this.cells[row][col].walls & UP) {
                    ctx.moveTo(col * cellSize, row * cellSize);
                    ctx.lineTo(col * cellSize + cellSize, row * cellSize);
                }
                if (this.cells[row][col].walls & DOWN) {
                    ctx.moveTo(col * cellSize, row * cellSize + cellSize);
                    ctx.lineTo(col * cellSize + cellSize, row * cellSize + cellSize);
                }
                if (this.cells[row][col].walls & LEFT) {
                    ctx.moveTo(col * cellSize, row * cellSize);
                    ctx.lineTo(col * cellSize, row * cellSize + cellSize);
                }
                if (this.cells[row][col].walls & RIGHT) {
                    ctx.moveTo(col * cellSize + cellSize, row * cellSize);
                    ctx.lineTo(col * cellSize + cellSize, row * cellSize + cellSize);
                }
            }
        }
        ctx.stroke();
        ctx.restore();
    }
}

const slider = document.getElementById('slider');
const sliderValue = document.getElementById('slider-value');
const button = document.getElementById('button');
const canvas = document.getElementById('canvas');

slider.addEventListener('input', (evt) => {
    sliderValue.innerText = slider.value;
});

button.addEventListener('click', (evt) => {
    const cellSize = 15;
    const cellCount = slider.value;
    
    canvas.width = cellCount * cellSize + 2;
    canvas.height = cellCount * cellSize + 2;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const maze = new Maze(cellCount);
    maze.traverse(0, 0);
    maze.render(ctx, cellSize);
});
button.click();
