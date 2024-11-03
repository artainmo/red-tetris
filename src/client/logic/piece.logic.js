/*
	Handles pieces logic in a grid form
*/

export const tetroLetterToGrid = (letter) => {
	switch (letter) {
		case ('I'):
			return ([
				[0, 0, 0, 0],
				[1, 1, 1, 1],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			])
		case ('O'):
			return ([
				[0, 1, 1],
				[0, 1, 1],
				[0, 0, 0]
			])
		case ('T'):
			return ([
				[0, 1, 0],
				[1, 1, 1],
				[0, 0, 0]
			])
		case ('S'):
			return ([
				[0, 1, 1],
				[1, 1, 0],
				[0, 0, 0]
			])
		case ('Z'):
			return ([
				[1, 1, 0],
				[0, 1, 1],
				[0, 0, 0]
			])
		case ('J'):
			return ([
				[1, 0, 0],
				[1, 1, 1],
				[0, 0, 0]
			])
		case ('L'):
			return ([
				[0, 0, 1],
				[1, 1, 1],
				[0, 0, 0]
			])
		default:
			console.log('problem there');
			return ([]);
	}
}

export const rotatePieceClockwise = (grid) => {
	return rotateMatrixClockwise(grid);
}

const rotateMatrixClockwise = (matrix) => {
	const transposed = matrix[0].map((_, i) => matrix.map(row => row[i]));
	const rotated = transposed.map(row => row.reverse());

	return rotated;
}
