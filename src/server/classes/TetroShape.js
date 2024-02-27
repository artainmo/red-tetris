/* this class is used to represent the shape of tetrominoes and the space
they occupy in the board. It contains also matrix rotation utilities to
allow rotations by the player */

class TetroShape {

	constructor (tetroType) {
		this._shape = this.initShape(tetroType);
	}

	initShape (tetroType) {
		switch (tetroType) {
			case ('I'):
				return ([
					[1, 1, 1, 1]
				])
			case ('O'):
				return ([
					[1, 1],
					[1, 1]
				])
			case ('T'):
				return ([
					[0, 1, 0],
					[1, 1, 1]
				])
			case ('S'):
				return ([
					[0, 1, 1],
					[1, 1, 0]
				])
			case ('Z'):
				return ([
					[1, 1, 0],
					[0, 1, 1]
				])
			case ('J'):
				return ([
					[1, 0, 0],
					[1, 1, 1]
				])
			case ('L'):
				return ([
					[0, 0, 1],
					[1, 1, 1]
				])
			default:
				console.log('problem there');
				return [];
		}
	}
	
	rotateGridClockwise () {
		this._shape = this.rotateMatrixClockwise(this._shape);
	}

	rotateGridAntiClockwise () {
		this._shape = this.rotateMatrixAntiClockwise(this._shape);
	}
	
	getShape () {
		return this._shape;
	}

	getClockwiseRotatedShape () {
		return this.rotateMatrixClockwise(this._shape);
	}

	getAntiClockwiseRotatedShape () {
		return this.rotateMatrixCounterClockwise(this._shape);
	}

	/* matrix calculation tools */
	rotateMatrixClockwise(matrix) {
        const transposed = matrix[0].map((_, i) => matrix.map(row => row[i]));
        const rotated = transposed.map(row => row.reverse());

        return rotated;
    }

	rotateMatrixCounterClockwise(matrix) {
        const transposed = matrix[0].map((_, i) => matrix.map(row => row[i]));
        const rotated = transposed.reverse();

        return rotated;
    }
}

module.exports.TetroShape = TetroShape;
