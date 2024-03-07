/*
	Piece is used to generate a random piece to the board game every time it is necessary

	Letters are used to indicate every type of tetromino that are used by the original tetris game.
	Check at this website : https://tetris.fandom.com/wiki/Tetromino#I for more detailled information
*/

class Piece {
	constructor(type) {
    	this._type = type;

			// Directions and positions are handled by the front as they are always the same
			// this._directions = ["left", "up", "down", "right"];
		 	// this._positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			// this._direction = this._directions[Math.floor(Math.random() * 4)];
      // this._position = this._positions[Math.floor(Math.random() * 10)];
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
