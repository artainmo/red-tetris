import React, { useState } from "react";
import PlayersArray from "./PlayersArray";
import { mainMenuPannelStyle } from "../style/menuStyle";

const LeftMenuPannel = () => {
	
	const [isSoloHovered, setIsSoloHovered] = useState(false);
	const [isMultiHovered, setIsMultiHovered] = useState(false);
	
	const handleSoloClick = () => {
		console.log('try to join solo game');
	}

	const handleMultiClick = () => {
		console.log('try to join multiplayer game');
	}

	const menuButtonStyle = {
		fontSize: '36px',
		border: 'none',
		borderRadius: '10px',
		padding: '20px 40px',
		cursor: 'pointer',
		transition: 'all 0.3s',
		marginTop: '12px',
		marginBottom: '12px',
		marginRight: '60px',
		width: '280px'
	}

	const soloButtonStyle = {
		backgroundColor: isSoloHovered? 'black' : 'white',
		color: isSoloHovered? 'white' : 'black',
	}

	const multiButtonStyle = {
		backgroundColor: isMultiHovered? 'black' : 'white',
		color: isMultiHovered? 'white' : 'black',
	}

	const buttonDivStyle = {
		width: '100%',
		height: '50%',
		display: 'flex'
	}

	const buttonsStyle = {
		width: '50%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	}

	const emptyDivStyle = {
		width: '50%',
		height: '100%',
	}

	return (
		<div style={mainMenuPannelStyle}>
			<div style={buttonDivStyle}>
				<div style={emptyDivStyle}></div>
				<div style={buttonsStyle}>
					<button 
						onClick={handleSoloClick} 
						style={{...menuButtonStyle, ...soloButtonStyle}}
						onMouseEnter={() => setIsSoloHovered(true)}
						onMouseLeave={() => setIsSoloHovered(false)}>Solo</button>
					<button 
						onClick={handleMultiClick} 
						style={{...menuButtonStyle, ...multiButtonStyle}}
						onMouseEnter={() => setIsMultiHovered(true)}
						onMouseLeave={() => setIsMultiHovered(false)}>Multiplayer</button>
				</div>
			</div>
			<PlayersArray />
		</div>
	);
};

export default LeftMenuPannel;
