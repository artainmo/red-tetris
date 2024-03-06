/* this part of the logic is applied when a new piece joins the pile. Checks 
whether one or several lines are completely full and suppress them */

/* after a piece is set in the pile, check wether a line is full and need to be cleared */
export const shouldClearLine = (grid, rows, cols) => { // to test
	let newGrid = [...grid];
	
	for (let row = 0; row < rows; row++) {
		let isFull = true;
		for (let col = 0; col < cols; col++) {
		  	if (newGrid[row][col] === 'BG') {
				isFull = false;
				break;
		  	}
		}
		if (isFull) {
		  	newGrid = clearLine(newGrid, row, cols);
		}
	}
	return newGrid;
}

/* when the full line is full, then it will remove the line and apply gravity to the upper */
export const clearLine = (grid, lineNum, cols) => { // to test
	let newGrid = [...grid];

	for (let row = lineNum; row > 0; row--) {
		for (let col = 0; col < cols; col++) {
		  	newGrid[row][col] = newGrid[row - 1][col];
		}
	}

	for (let col = 0; col < cols; col++) {
		newGrid[0][col] = 'BG';
	}
	return newGrid;
}
