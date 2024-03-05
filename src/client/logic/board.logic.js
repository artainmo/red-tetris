/*
	Store the logic for the 
*/

import Cell from "../pages/Cell";

const GRID_LENGTH = 20;
const GRID_WIDTH = 10;
const COLOR_BG = '#3565d0';

export const createGrid = () => {
	const grid = new Array(GRID_WIDTH).fill(null).map(() => new Array(GRID_LENGTH).fill('BG'));

	return grid;
}

export const gridToBoard = (grid) => {
	const board = [];
	for (let y = 0; y < GRID_WIDTH; y++) {

		for (let x = 0; x < GRID_LENGTH; x++) {
			const cellColor = grid[y][x] !== 'BG' ? COLOR_BG : getCellColor(grid[y][x]);
			row.push(<Cell key={`${x}-${y}`} cellColor={cellColor} />);
		}
		board.push(<div key={y} style={{display: 'flex'}}>{row}</div>);
	}
	return board;
}

export const deepCopyGrid = (grid) => {
	const newGrid = grid.map(row => [...row]);

	return newGrid;
}

export const getCellColor = (color) => {
	switch (color) {
		case (''):
			break;
		default:
			console.log('wrong color');
			return COLOR_BG;
	}
}

export const canPieceMove = () => {

}
