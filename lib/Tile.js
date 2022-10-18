const log2 = Math.log2;
const random = Math.random;

export default class Tile {
    #value;
    #x;
    #y;

    constructor(grid, value = random() > 0.5 ? 2 : 4) {
        this.grid = grid;
        
        this.element = this.#createElement();
        this.element.textContent = this.#value;
        this.grid.element.appendChild(this.element);

        this.value = value;
    }

    #createElement = () => {
        const tile = document.createElement('div');

        tile.classList.add("tile");

        return tile;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
        this.element.textContent = this.#value;

        const power = log2(this.#value);
        const bgLightness = 100 - power * 9;
        this.element.style.setProperty("--background-lightness", `${bgLightness}%`);
        this.element.style.setProperty("--text-lightness", `${bgLightness <= 50 ? 90 : 10}%`);
    }

    set x(x) {
        this.#x = x;
        this.element.style.setProperty('--x', this.#x);
    }
    
    set y(y) {
        this.#y = y;
        this.element.style.setProperty('--y', this.#y);
    }

    waitForTransition = () => {
        return new Promise(resolve => {
            this.element.addEventListener("transitionend", resolve, {once: true})
        })
    }

    remove = () => {
        this.element.remove();
    }
}