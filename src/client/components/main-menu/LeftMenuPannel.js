import React, { useEffect, useState } from "react";
import PlayersArray from "./PlayersArray";
import { mainMenuPannelStyle } from "../../style/menuStyle";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSoloGameThunk } from "../../redux/slices/currentGameSlice";
import { socketConnectThunk } from "../../redux/slices/socketSlice";

const LeftMenuPannel = () => {
	
	const [isSoloHovered, setIsSoloHovered] = useState(false);
	const [isMultiHovered, setIsMultiHovered] = useState(false);
	const [gameCreated, setgameCreated] = useState(false);

	const username = useSelector((state) => state.auth.user);
	const gameId = useSelector((state) => state.currentGame.id);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	/* create a solo game and store it to the currentGame slice, then connect to socket to exhange data with server */
	const handleSoloGameCreation = () => {
		dispatch(createSoloGameThunk(username));
		dispatch(socketConnectThunk());
		setgameCreated(true);
	}

	/* redirect to game when game has been created */
	useEffect(() => {
		if (gameCreated && gameId && username) {
			navigate(`/game/${gameId}`);
			setgameCreated(false);
		}	
	}, [navigate, gameCreated, gameId, username]);

	const handleMatchmakingForMultiplayer = () => {
		console.log('starting matchmaking process for multiplayer');
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
						onClick={handleSoloGameCreation} 
						style={{...menuButtonStyle, ...soloButtonStyle}}
						onMouseEnter={() => setIsSoloHovered(true)}
						onMouseLeave={() => setIsSoloHovered(false)}>Solo</button>
					<button 
						onClick={handleMatchmakingForMultiplayer} 
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
