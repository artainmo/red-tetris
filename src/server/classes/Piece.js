/*
	Piece is used to generate a random piece to the board game every time it is necessary

	Letters are used to indicate every type of tetromino that are used by the original tetris game.
	Check at this website : https://tetris.fandom.com/wiki/Tetromino#I for more detailled information

	Positions are used to indicate where the piece will be displayed on the grid (it is centered, 
	but it depends on the shape of the piece)
*/

import { TetroShape } from "./TetroShape";

class Piece {
	constructor(type) {
    	this._type = type;
      	this._offset = {
			x: 2,
			y: 9
		};
		this._tetroShape = new TetroShape(type);
	}

	/* send new piece state to check whether it is compatible */
	sendNewPieceState() {
		return this._tetroShape.getClockwiseRotatedShape();
	}

	/* apply when gravity */
	decrementOffsetY() {
		if (this._offset.y > 0) {
			this._offset.y--;
		}
	}

	/* apply when rotating */
	triggersClockwiseRotation() {
		this._tetroShape.rotateGridClockwise();
	}

	/* apply when moving piece to the left */
	triggersLeftShift() {
		this._offset.y--;
	}

	/* apply when moving piece to the right */
	triggersRightShift() {
		this._offset.y++;
	}
	
	getPieceType() {
		return this._type;
	}

	getPieceOffset() {
		return this._offset;
	}

	getPieceX() {
		return this._offset.x;
	}

	getPieceY() {
		return this._offset.y;
	}

	// useful ? 
	getShape() {
		return this._tetroShape.getShape();
	}

	/* debug purpose only */
	displayPiece() {
		console.log('new piece : ');
		console.log(`type = ${this._type}`);
		console.log(`offset index x - y = ${this._offset.x} - ${this._offset.y}`);
	}
}

module.exports.Piece = Piece;
