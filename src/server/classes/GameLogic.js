import { Piece } from "./Piece";
import { PieceBasket } from "./PieceBasket"
import { GravityController } from "./GravityController";
import { LockDelayController } from "./LockDelayController";
import { Grid } from "./Grid";

const LOCK_DELAY = 500;
const GRAVITY_DELAY = 500;

class GameLogic {
	
	constructor() {
		this._grid = new Grid();
		this._pieceBasket = new PieceBasket();
		this._gravityController = new GravityController(this.processGravity.bind(this), GRAVITY_DELAY);
		this._lockDelayController = new LockDelayController(this.processLockDelay.bind(this), LOCK_DELAY);
	};

	startGame() {
		this.gravityController.start();
		this.addNewPieceToGrid();
	}

	endGame() {
		this._gravityController.reset();
	}

	pauseGame() {
		this._gravityController.stop();
	}

	resumeGame() {
		this._gravityController.resume();
	}

	/*  handles gravity at a pace decided by the backend */
	processGravity() {
		
	}

	/* handles when a player pressed a WASD key */
	processPlayerInput(direction) {

	}

	/* should fetch a piece from basket and put the new piece into the board when relevant */
	addNewPieceToGrid() { // to test
		const newPiece =  this._pieceBasket.pickPieceInPieceBasket();


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

	/* check whether the piece must put to the stack */
	shouldPieceBePutToPile() {
		
		
		
		this.addNewPieceToGrid();
	}

	/* simple getter to obtain the current grid */
	getGrid() {
		return this.grid.getGrid();
	}
}

module.exports.GameLogic = GameLogic;
