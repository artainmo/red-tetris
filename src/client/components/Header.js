import React from "react";

const Header = () => {

	const headerStyle = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
		color: 'white',
		width: '100vw',
		height: '80px',
		margin: 0,
		padding: 0
	}
	
	return (
		<div className="header" style={headerStyle}>
			<h1>Red Tetris</h1>
		</div>
	);
};

export default Header;
