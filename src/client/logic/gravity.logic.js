/* processGravity is triggered by the custom hook useGravity every 500ms */

import { deepCopyGrid } from "./board.logic";

export const processGravity = (grid, direction) => {
	const newGrid = deepCopyGrid(grid);

	// add logic to modify the grid

	return newGrid;
}
