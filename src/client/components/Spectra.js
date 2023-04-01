import React from 'react';
import '../style/spectra.css';

const Spectra = ({ grid }) => {

	return (
		<div className="spectra-wrapper">
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
