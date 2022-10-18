import Grid from "./lib/Grid.js";
import Tile from "./lib/Tile.js";

const grid = new Grid();

grid.randomEmptyCell().tile = new Tile(grid);
grid.randomEmptyCell().tile = new Tile(grid);

const handleInput = (event) => {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            moveUp();
            break;
        case "ArrowDown":
        case "s":
            moveDown();
            break;
        case "ArrowLeft":
        case "a":
            moveLeft();
            break;
        case "ArrowRight":
        case "d":
            moveRight();
            break;
        default:
            setupInput();
            return
    }

    grid.cells.forEach(cell => cell.mergeTiles())

    grid.randomEmptyCell().tile = new Tile(grid);

    setupInput();
}

function slideTiles(cells) {
    return Promise.all(
      cells.flatMap(group => {
        const promises = []
        for (let i = 1; i < group.length; i++) {
          const cell = group[i]
          if (cell.tile == null) continue
          let lastValidCell
          for (let j = i - 1; j >= 0; j--) {
            const moveToCell = group[j]
            if (!moveToCell.canAccept(cell.tile)) break
            lastValidCell = moveToCell
          }
  
          if (lastValidCell != null) {
            promises.push(cell.tile.waitForTransition())
            if (lastValidCell.tile != null) {
              lastValidCell.mergeTile = cell.tile
            } else {
              lastValidCell.tile = cell.tile
            }
            cell.tile = null
          }
        }
        return promises
      })
    )
  }

const moveUp = () => slideTiles(grid.cellsByColumn);
const moveDown = () => slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
const moveLeft = () => slideTiles(grid.cellsByRow);
const moveRight = () => slideTiles(grid.cellsByRow.map(row => [...row].reverse()));

const setupInput = () => {
    window.addEventListener('keydown', handleInput, { once: true })
}

setupInput()

