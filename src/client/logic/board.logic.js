/* Handles the conversion from grid to board */

import Cell from "../components/Cell";

const COLOR_BG = '#3565d0';
const COLOR_I = '#cc0f0f';
const COLOR_J = '#1cd211';
const COLOR_L = '#95e011';
const COLOR_O = '#f6c709';
const COLOR_S = '#5717e0';
const COLOR_T = '#e74208';
const COLOR_Z = '#a808e7';

export const gridToBoard = (grid, width, lenght) => {
	const board = [];
	for (let y = 0; y < width; y++) {
		for (let x = 0; x < lenght; x++) {
			const cellColor = grid[y][x] !== 'BG' ? COLOR_BG : getCellColor(grid[y][x]);
			row.push(<Cell key={`${x}-${y}`} cellColor={cellColor} />);
		}
		board.push(<div key={y} style={{display: 'flex'}}>{row}</div>);
	}
	return board;
}

export const getCellColor = (color) => {
	switch (color) {
		case ('I'):
			return COLOR_I;
		case ('J'):
			return COLOR_J;
		case ('L'):
			return COLOR_L;
		case ('O'):
			return COLOR_O;
		case ('S'):
			return COLOR_S;
		case ('T'):
			return COLOR_T;
		case ('Z'):
			return COLOR_Z;
		default:
			console.log('wrong color');
			return COLOR_BG;
	}
}
