import React from "react";

const PlayersArray = () => {

	const mainContainerStyle = {
		width: '100%',
		height: '50%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}

	const arrayDivStyle = {
		backgroundColor: 'white',
		color: 'black',
		width: '80%',
		height: '80%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: '16px'
	}

	const titleStyle = {
		fontSize: '24px'
	}

	const delimiterStyle = {
		height: '2px',
		backgroundColor: 'black',
		width: '100%',
		marginBottom: '10px',
	}

	const playersDisplayDivStyle = {

	}

	const titleDivStyle = {
		
	}
	
	return (
		<div style={mainContainerStyle}>
			<div style={arrayDivStyle}>
				<div style={titleDivStyle}>
					<h2 style={titleStyle}>Players Available</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div style={playersDisplayDivStyle}>
					players there
				</div>	
			</div>
		</div>
	)
}

export default PlayersArray;
