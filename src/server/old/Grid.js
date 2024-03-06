/**/

import { Piece } from "./Piece";

const GRID_LENGTH = 20;
const GRID_WIDTH = 10;

class Grid {
	constructor () {
		this._rows = GRID_WIDTH;
    	this._cols = GRID_LENGTH;
    	this._grid = this.createEmptyGrid();
	}

	createEmptyGrid() { // to test
		const grid = new Array(this._rows);
		for (let row = 0; row < this._rows; row++) {
			grid[row] = new Array(this._cols).fill('BG');
		}
		return grid;
	}

	/* after a piece is set in the pile, check wether a line is full and need to be cleared */
	shouldClearLine() { // to test
		for (let row = 0; row < this._rows; row++) {
			let isFull = 0;
			for (let col = 0; col < this._cols; col++) {
				if (this._grid[row][col] !== 'BG') {
					isFull++;
				}
			}
			if (isFull === this._rows) {
				this.clearLine(row);
			}
		}
	}

	/* when the full line is full, then it will remove the line and apply gravity to the upper */
	clearLine(lineNum) { // to test
		for (let row = lineNum; row > 0; row--) {
			for (let col = 0; col < this._cols; col++) {
				this._grid[row][col] = this._grid[row - 1][col];
			}
		}

		for (let col = 0; col < this._cols; col++) {
			this._grid[0][col] = 'BG';
		}
	}

	/* getters and setters */
	getGrid() {
		return this._grid;
	}

	/* DEBUG ONLY */
	
	/* used to display the grid to debug purposes */
	displayGrid() { // to test
		for (let row = 0; row < this._rows; row++) {
			for (let col = 0; col < this._cols; col++) {
				console.log(`|${this._grid[row][col]}|`);
			}
		}
	}
}

module.exports.Grid = Grid;
