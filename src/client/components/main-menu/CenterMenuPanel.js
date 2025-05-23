import React, { useState, useEffect } from "react";
import RoomsArray from "./RoomsArray";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSoloGameThunk, createMultiGameThunk, setWaitingForPlayersToJoin, joinMultiGameThunk } from "../../redux/slices/currentGameSlice";
import { socketConnectThunk, joinRoomThunk } from "../../redux/slices/socketSlice";
import RedButton from "../shared/RedButton";
import YellowButton from "../shared/YellowButton";
import { fullWhiteMenuPanelStyle, middlePanelStyle, middleArrayContainerStyle } from "../../style/panelStyle";

const CenterMenuPanel = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [gameCreated, setGameCreated] = useState(false);
	const [multiplayerGameCreated, setMultiplayerGameCreated] = useState(false);

	const username = useSelector((state) => state.auth.user);
	const gameId = useSelector((state) => state.currentGame.id);

	/* create a solo game and store it to the currentGame slice, then connect to socket to exhange data with server */
	const handleSoloGameCreation = async() => {
		dispatch(createSoloGameThunk(username));
		dispatch(socketConnectThunk());
		setGameCreated(true);
	}
	const handleMultiplayerGameCreation = async() => {
		console.log('starting matchmaking process for multiplayer');
		const game = dispatch(createMultiGameThunk(username));
		const socket = await dispatch(socketConnectThunk());
		dispatch(joinMultiGameThunk({id: game.id, username: username, socket: socket}));		
		dispatch(joinRoomThunk({roomName: game.id, userSocket: socket}));		
		setMultiplayerGameCreated(true);
		dispatch(setWaitingForPlayersToJoin(true));
	}

	/* redirect to game when game has been created */
	useEffect(() => {
		if (gameCreated && gameId && username) {
			navigate(`/game/${gameId}`);
			setGameCreated(false);
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
							textContent='Multi'
							onClick={handleMultiplayerGameCreation} 
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
