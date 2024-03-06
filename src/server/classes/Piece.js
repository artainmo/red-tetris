/*
	Piece is used to generate a random piece to the board game every time it is necessary

	Letters are used to indicate every type of tetromino that are used by the original tetris game.
	Check at this website : https://tetris.fandom.com/wiki/Tetromino#I for more detailled information
*/

class Piece {
	constructor(type) {
    	this._type = type;
	}
	
	getPieceType() {
		return this._type;
	}

	/* debug purpose only */
	displayPiece() {
		console.log('new piece : ');
		console.log(`type = ${this._type}`);
	}
}

module.exports.Piece = Piece;
