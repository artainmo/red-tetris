import React, { useState, useEffect } from "react";
import RoomsArray from "./RoomsArray";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSoloGameThunk, searchOrCreateMultiGameThunk, setGame } from "../../redux/slices/currentGameSlice";
import { socketConnectThunk } from "../../redux/slices/socketSlice";
import RedButton from "../shared/RedButton";
import YellowButton from "../shared/YellowButton";
import { fullWhiteMenuPanelStyle, middlePanelStyle, middleArrayContainerStyle } from "../../style/panelStyle";

const CenterMenuPanel = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [gameCreated, setgameCreated] = useState(false);
	const [multiplayerGameCreated, setMultiplayerGameCreated] = useState(false);

	const username = useSelector((state) => state.auth.user);
	const gameId = useSelector((state) => state.currentGame.id);

	/* create a solo game and store it to the currentGame slice, then connect to socket to exhange data with server */
	const handleSoloGameCreation = async() => {
		dispatch(createSoloGameThunk(username));
		dispatch(socketConnectThunk());
		setgameCreated(true);
	}

	const handleMatchmakingForMultiplayer = () => {
		console.log('starting matchmaking process for multiplayer');
		dispatch(searchOrCreateMultiGameThunk(username));
		dispatch(socketConnectThunk());		
		setMultiplayerGameCreated(true);
	}

	/* redirect to game when game has been created */
	useEffect(() => {
		if (gameCreated && gameId && username) {
			navigate(`/game/${gameId}`);
			setgameCreated(false);
		}	

		if (multiplayerGameCreated && gameId && username) {             
			navigate(`/multiplayer/${gameId}`);
			setMultiplayerGameCreated(false);
		}	
		
	}, [navigate, multiplayerGameCreated, gameCreated, gameId, username]);


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
						/>
					</div>
					<div style={buttonDivStyle}>
						<YellowButton 
							textContent='Join Multi'
							onClick={handleMatchmakingForMultiplayer} 
						/>
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
