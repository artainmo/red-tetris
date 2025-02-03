import React from "react";
import { CELL_COLORS } from "../../utils/cellColors";

const Cell = ({colorCode}) => {
	
	const cellStyle = {
		width: '100%',
		height: '100%',
		backgroundColor: CELL_COLORS[colorCode],
		boxSizing: 'border-box',
		//border: '1px solid white'
	}

	return <div style={cellStyle}></div>;
}

export default Cell;
