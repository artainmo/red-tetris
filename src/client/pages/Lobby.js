/*
	This component is handling matchmaking for multiplayer 
	and the frontend part of game creation for single players
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/shared/Header';
import { landingPageStyle, mainContainerStyle } from "../style/mainStyle";

const Lobby = () => {
	
	const [matchmakingText, setMatchmakingText] = useState('Matchmaking In Progress');

	const navigate = useNavigate();

	// used to add the "..." dynamically in the matchmaking text
	useEffect(() => {
		let dotCount = 0;
		const interval = setInterval(() => {
			if (dotCount < 3) {
				setMatchmakingText(matchmakingText => matchmakingText + '.');
				dotCount += 1;
			} else {
				setMatchmakingText('Matchmaking In Progress');
				dotCount = 0;
			}
		}, 500);
		
		return () => clearInterval(interval);
	}, []);

	const handleCancelButton = () => {
		navigate('/main_menu');
	}

	const cancelButtonStyle = {

	}
	
	return (
		<div style={mainContainerStyle}>
			<Header />
			<div style={landingPageStyle}>
				<p>{matchmakingText}</p>
				<button style={cancelButtonStyle} onClick={handleCancelButton}>
					Cancel
				</button>
			</div>
		</div>
	);
}

export default Lobby;
