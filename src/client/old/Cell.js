import React from "react";

const Cell = ({cellColor}) => {

	const cellStyle = {
		width: '20px',
    	height: '20px',
    	border: 'solid red',
    	backgroundColor: cellColor ? cellColor : 'transparent',
	}
	
	return (
		<div style={cellStyle}></div>
	)
}

export default Cell;
