import React, { useState, useEffect } from "react";
import RoomsArray from "./RoomsArray";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSoloGameThunk } from "../../redux/slices/currentGameSlice";
import { socketConnectThunk } from "../../redux/slices/socketSlice";
import RedButton from "../shared/RedButton";
import YellowButton from "../shared/YellowButton";
import { fullWhiteMenuPanelStyle, middlePanelStyle, middleArrayContainerStyle } from "../../style/panelStyle";

const CenterMenuPanel = () => {
	
		
	const [isSoloHovered, setIsSoloHovered] = useState(false);
	const [isMultiHovered, setIsMultiHovered] = useState(false);
	const [gameCreated, setgameCreated] = useState(false);
	const [multiplayerGameCreated, setMultiplayerGameCreated] = useState(false);

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

		{/* This logic is added in order to code the multi game css layout */}
		if (multiplayerGameCreated && gameId && username) {             
			navigate(`/multiplayer/${gameId}`);
			setMultiplayerGameCreated(false);
		}	
		
	}, [navigate, multiplayerGameCreated, gameCreated, gameId, username]);

	const handleMatchmakingForMultiplayer = () => {
		console.log('starting matchmaking process for multiplayer');
		dispatch(createSoloGameThunk(username)); {/* This logic is added in order to code the multi game css layout */}
		dispatch(socketConnectThunk());		
		setMultiplayerGameCreated(true);
	}

	const buttonColStyle = {
		height: 'fit-content',
		display: 'flex-column',
		justifyContent: 'space-around',
		margin: 'auto',
		padding: 'auto'
	}

	const buttonDivStyle = {
		margin: '2rem',
		padding: 'auto'
	}

	return (
		<div style={middlePanelStyle}>
			<div style={middleArrayContainerStyle}>
				<div style={buttonColStyle}>
					<div style={buttonDivStyle}>
						<RedButton
							textContent='Solo'
							onClick={handleSoloGameCreation} 
							onMouseEnter={() => setIsSoloHovered(true)}
							onMouseLeave={() => setIsSoloHovered(false)}/>
					</div>
					<div style={buttonDivStyle}>
						<YellowButton 
							textContent='Join Multi'
							onClick={handleMatchmakingForMultiplayer} 
							onMouseEnter={() => setIsMultiHovered(true)}
							onMouseLeave={() => setIsMultiHovered(false)}/>
					</div>
				</div>
				<div style={fullWhiteMenuPanelStyle}>
					<RoomsArray />
				</div>
			</div>
		</div>
	);

}

export default CenterMenuPanel;
