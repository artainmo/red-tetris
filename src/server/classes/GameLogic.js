import { Piece } from "./Piece";
import { PieceBasket } from "./PieceBasket"
import { GravityController } from "./GravityController";

const LOCK_DELAY = 500;
const GRID_LENGTH = 20;
const GRID_WIDTH = 10;

class GameLogic {
	
	constructor() {
		this._rows = GRID_WIDTH;
    	this._cols = GRID_LENGTH;
    	this._grid = this.createEmptyGrid();
		this._pieceBasket = new PieceBasket();
		this._putToPile = false;
		this._lockDelay = LOCK_DELAY;
		this._currentLockedDelay = this._lockDelay;
		this._gravityController = new GravityController(this.processGravity.bind(this), 500);
	};

	createEmptyGrid() {
		const grid = new Array(this._rows);
		for (let row = 0; row < this._rows; row++) {
			grid[row] = new Array(this._cols).fill('BG');
		}
		return grid;
	}

	startGame() {
		this.gravityController.start();
		this.addNewPieceToGrid();
	}

	stopGame() {
		this._gravityController.stop();
	}

	pauseGame() {

	}

	resumeGame() {
		
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

	/* handles when a player pressed a WASD key */
	processPlayerInput(direction) {

	}

	/*  handles gravity at a pace decided by the frontend */
	processGravity() {

	}

	/* check whether the piece must put to the stack */
	shouldPieceBePutToPile() {
		
		
		
		this.addNewPieceToGrid();
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
