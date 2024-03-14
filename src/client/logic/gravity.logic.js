/* processGravity is triggered by the custom hook useGravity every 500ms */

import { deepCopyGrid } from "./grid.logic";

export const processGravity = (grid, pieceGrid, offsetX, offsetY) => {
	console.log('processGravity : first line');
	const newGrid = deepCopyGrid(grid);
	
	if (canPieceFall(newGrid, pieceGrid, offsetX, offsetY)) {
		newGrid = applyGravity(newGrid, pieceGrid, offsetX, offsetY);
	}

	return newGrid;
}

export const applyGravity = (newGrid, pieceGrid, offsetX, offsetY) => {
	return newGrid; // update this, placeholder
}

/* check whether or not the piece can move */
export const canPieceFall = (newgrid, pieceGrid, offsetX, offsetY) => {
	return false; // update this, placeholder
}
