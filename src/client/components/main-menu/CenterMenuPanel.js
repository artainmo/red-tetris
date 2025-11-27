import React, { useState, useEffect } from "react";
import RoomsArray from "./RoomsArray";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSoloGameThunk } from "../../redux/slices/currentGameSlice";
import { createMultiGameRoomThunk } from "../../redux/slices/roomSlice";
import RedButton from "../shared/RedButton";
import YellowButton from "../shared/YellowButton";
import { fullWhiteMenuPanelStyle, middlePanelStyle, middleArrayContainerStyle } from "../../style/panelStyle";

const CenterMenuPanel = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [localName, setLocalName] = useState('');
	const [emptyInputErrMsg, setEmptyInputErrMsg] = useState(false);
	const socketErrMsg = useSelector((state) => state.socket.error);
	const { nameTooLong, nameInvalidChars } = useSelector((state) => state.auth);
	const inputStyle = {
		backgroundColor: 'white',
		border: 'none',
		borderRadius: '20px',
		fontSize: '16px',
		padding: '10px 20px',
		margin: '24px',
		width: '60%'
	}

	const errMsgStyle = {
		color: 'red',
		fontSize: '12px',
	}

	const [gameCreated, setGameCreated] = useState(false);
	const [multiplayerGameCreated, setMultiplayerGameCreated] = useState(false);
	const socket = useSelector((state) => state.socket.socket)

	const username = useSelector((state) => state.auth.user);
	const gameId = useSelector((state) => state.currentGame.id);

	/* create a solo game and store it to the currentGame slice, then connect to socket to exhange data with server */
	const handleCreateGame = async() => {
		if (!localName) {
			setEmptyInputErrMsg(true);
			return;
		}
		navigate('/game/' + localName + '/' + username)
		// dispatch(createSoloGameThunk(localName));
		// setGameCreated(true);
	}

	/* redirect to game when game has been created */
	useEffect(() => {
		if (gameCreated && gameId && username) {
			setGameCreated(false);
			navigate(`/game/${gameId}`);
		}	

		if (multiplayerGameCreated && gameId && username) {   
			setMultiplayerGameCreated(false);          
			navigate(`/lobby`);
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
						<input 
						style={inputStyle}
						type='text'
						placeholder='Enter game name to create'
						value={localName}
						onChange={(e) => {
							setLocalName(e.target.value);
							setEmptyInputErrMsg(false);
						}}
					/>
					{nameTooLong && <p style={errMsgStyle}>Please enter a shorter username</p>}
					{emptyInputErrMsg && <p style={errMsgStyle}>Empty inputs are invalid</p>}
					{nameInvalidChars && <p style={errMsgStyle}>Invalid characters</p>}
					{socketErrMsg && <p style={errMsgStyle}>{socketErrMsg}</p>}
						<RedButton
							textContent='Create Game'
							onClick={handleCreateGame} 
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
