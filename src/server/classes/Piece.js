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
      	this._offset = null;
		this._tetroShape = null;
		this.generatePiece(type);
	}

	/* generate a new piece */
	generatePiece(type) {
		this._offset = this.determineOffset();
		this._tetroShape = new TetroShape(type);
	}

	determineOffset() {
		if (this._type === 'O') {
			this._offset = 3;
		} else {
			this._offset = 2;
		}
	}

	getPieceType() {
		return this._type;
	}

	getPieceOffset() {
		return this._offset;
	}

	// useful ? 
	getPieceTetroshape() {
		return this._tetroShape;
	}

	// useful ?
	getPiece() {
		return {
		  	type: this._type,
		  	offset: this._offset,
			tetroShape: this._tetroShape
		};
  	}

	/* debug purpose only */
	displayPiece() {
		console.log('new piece : ');
		console.log(`type = ${this._type}`);
		console.log(`offset index = ${this._offset}`);
	}
}

module.exports.Piece = Piece;
