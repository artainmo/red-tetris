import { Piece } from "./Piece";
import { PieceBasket } from "./PieceBasket"

class GameLogic {
	
	constructor(rows = 20, cols = 10) {
		this._rows = rows;
    	this._cols = cols;
    	this._grid = this.createEmptyGrid();
		this._pieceBasket = new PieceBasket();
	};

	createEmptyGrid() {
		const grid = new Array(this._rows);
		for (let row = 0; row < this._rows; row++) {
			grid[row] = new Array(this._cols).fill('BG');
		}
		return grid;
	}

	/* take an input from the player (wasd key) and decide if 
	rotation is possible on the matrix representing the board */
	canPieceRotate(direction) {
		



		return true;
	}

	/* when the lower line is full (no cell is empty), then it will remove the line */
	clearLine() { // to test and account for destroyed in the middle of the board
		let previousLine = new Array(this._rows);
		let currentLine = new Array(this._rows);

		for (let row = 0; row < this._rows.lenght; row++) {
			for (let col = 0; col < this._cols.lenght; col++) {
				currentLine[col] = this._grid[row][col];
				if (row !== 0) {
					this._grid[row][col] = previousLine[col];
				}
			}
			previousLine = currentLine;
		}

		for (let i = 0; i < this._cols.lenght; i++) {
			this._grid[0][i] = 'BG';
		}
	}

	/* should fetch a piece from basket and put the new piece into the board when relevant */
	addNewPieceToGrid() { // to test
		// fetching new piece
		const newPiece =  this._pieceBasket.pickPieceInPieceBasket();
		// then, check if there is place to add the piece, otherwise triggers game over
		if (!this.checkIfPlaceForNewPiece(newPiece.getPiecePosition(), newPiece.getPieceShape())) {
			// should trigger game over and game interruption
			console.log('game over !!!');
		}
	}

	/* check if there is some place to put the new piece on the board*/
	checkIfPlaceForNewPiece(position, shape) { // to test
		const offset = position;

		for (let row = 0; row < shape.lenght; row++) {
			for (let col = offset; col < (offset + shape[0].lenght); col++) {
				if (shape[row][col] === 1 && this._grid[row][col] !== 'BG') {
					return false;
				}
			}
		}
		return true;
	}

	/* handles when a player pressed a WASD key, or gravity of tetrominoes */
	processPlayerInput(direction) {

	}

	/* simple getter to obtain the current grid */
	getGrid() {
		return this.grid;
	}

	/* DEBUG ONLY */
	
	/* used to display the grid to debug purposes */
	displayGrid() { // to test
		for (let row = 0; row < this.rows.lenght; row++) {
			for (let col = 0; col < this.cols.lenght; col++) {
				console.log(`|${grid[row][col]}|`);
			}
		}
	}
}

module.exports.GameLogic = GameLogic;
