import Grid from "./lib/Grid.js";
import Tile from "./lib/Tile.js";

const grid = new Grid();

grid.randomEmptyCell().tile = new Tile(grid);
grid.randomEmptyCell().tile = new Tile(grid);

function canMove(cells) {
    return cells.some(group => {
      return group.some((cell, index) => {
        if (index === 0) return false
        if (cell.tile == null) return false
        const moveToCell = group[index - 1]
        return moveToCell.canAccept(cell.tile)
      })
    })
  }

const canMoveUp = () => canMove(grid.cellsByColumn)
const canMoveDown = () => canMove(grid.cellsByColumn.map(column => [...column].reverse()))
const canMoveLeft = () => canMove(grid.cellsByRow)
const canMoveRight = () => canMove(grid.cellsByRow.map(column => [...column].reverse()))

const handleInput = (event) => {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            if (!canMoveUp()) return setupInput()
            moveUp();
            break;
        case "ArrowDown":
        case "s":
            if (!canMoveDown()) return setupInput()
            moveDown();
            break;
        case "ArrowLeft":
        case "a":
            if (!canMoveLeft()) return setupInput()
            moveLeft();
            break;
        case "ArrowRight":
        case "d":
            if (!canMoveRight()) return setupInput()
            moveRight();
            break;
        default:
            setupInput();
            return
    }

    grid.cells.forEach(cell => cell.mergeTiles())

    const newTile = new Tile(grid)
    grid.randomEmptyCell().tile = newTile;

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        return newTile.waitForTransition(true).then(() => alert("You lose."))   
    }
    
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

