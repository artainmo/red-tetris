import React, {useState} from 'react'
import '../style/spectra.css';
const GRID_LENGTH = 20;
const GRID_WIDTH = 10;
const COLOR_BG = '#3565d0';

const Spectra = ( ) => {
	const initGrid = () => {
		const rows = [];

		for (let row = 0; row < GRID_LENGTH; row++) {
			const cells = [];
			for (let col = 0; col < GRID_WIDTH; col++) {
				cells.push({
					color: COLOR_BG,
					fixed: false,
				});
			}
			rows.push(cells);
		}
		return rows;
	};
	const [grid, setGrid] = useState(initGrid());

	return (
		<div className="spectra-wrapper">
			<div>Player </div>
			<div className="spectra">
				{grid.map((row, rowIndex) => {
					return (
						<div key={rowIndex} className="rowSpectra">
							{row.map((cell, cellIndex) => (
								<div key={`${rowIndex}${cellIndex}`} className="cellSpectra" style={{ backgroundColor: cell.color }} />
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Spectra;
