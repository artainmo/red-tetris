/*
	Store the logic for the grid system underlying the tetris game gameplay
*/

export const createGrid = (width, lenght) => {
	const grid = new Array(width).fill(null).map(() => new Array(lenght).fill('BG'));

	return grid;
}

export const deepCopyGrid = (grid) => {
	if (!grid) {
		console.log('grid undefined');
	}
	
	const newGrid = grid.map(row => [...row]);

	return newGrid;
}

