const random = Math.random;
const floor = Math.floor;

class Cell {
    #x;
    #y;
    #tile;
    #mergeTile

    constructor(x=0, y=0) {
        this.#x = x;
        this.#y = y;
        this.#tile = null;

        this.element = this.#createElement();
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get tile() {
        return this.#tile;
    }
    
    set tile(tile) {
        this.#tile = tile;
        if (!tile) return;

        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
    }

    get mergeTile() {
        return this.#mergeTile
    }

    set mergeTile(tile) { 
        this.#mergeTile = tile;

        if (this.#mergeTile == null) return
        
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }

    canAccept = (tile) => {
        return (this.tile == null || (this.mergeTile == null && this.tile.value === tile.value));
    }

    #createElement = () => {
        const cell = document.createElement('div');

        cell.classList.add("cell");

        return cell;
    }

    mergeTiles = () => {
        if (this.tile == null || this.mergeTile == null) return;

        this.tile.value = this.tile.value + this.mergeTile.value;
        this.mergeTile.remove();
        this.mergeTile = null;
    }
}

export default class Grid {
    static size = 4;
    static margin = 20;
    static cellSize = (100 - Grid.margin) / Grid.size;
    static cellGap = 2;

    #cells; #element;
    
    constructor(parent = document.body) {
        this.element = this.#createElement();
        
        this.#cells = [];
        this.#addCells();
        
        parent.appendChild(this.element);
    }

    #createElement = () => {
        const element = document.createElement('div');
        
        element.id = "game-board";
        element.style.setProperty("--grid-size", `${Grid.size}`);
        element.style.setProperty("--cell-size", `${Grid.cellSize}vmin`);
        element.style.setProperty("--cell-gap", `${Grid.cellGap}vmin`);

        return element;
    }

    #addCells = () => {
        for (let i = 0; i < Grid.size; i++) {
            for (let j = 0; j < Grid.size; j++) {
                const cell = new Cell(i, j);

                this.element.appendChild(cell.element);
                this.#cells.push(cell);
            }
        }
    }

    get cells() {
        return this.#cells;
    }

    get #emptyCells() {
        return this.#cells.filter(cell => cell.tile == null);
    }

    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || [];
            cellGrid[cell.x][cell.y] = cell;
            return cellGrid;
        }, [])
    }

    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell;
            return cellGrid;
        }, [])
    }

    randomEmptyCell = () => {
        return this.#emptyCells[floor(this.#emptyCells.length*random())];
    }
}