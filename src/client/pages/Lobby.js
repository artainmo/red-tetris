/*
	This component is handling matchmaking for multiplayer 
	and the frontend part of game creation for single players
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pageMainContainerStyle, titleContainerStyle, redContainerStyle, whiteStyle, buttonContainerStyle } from "../style/containersStyle";
const Lobby = () => {
	
	const [matchmakingText, setMatchmakingText] = useState('Matchmaking In Progress');

	const navigate = useNavigate();

	/* used to add the "..." dynamically in the matchmaking text */
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
		// add some API call to remove the player form the match
		navigate('/main_menu');
	}
	
	return (
		<div style={pageMainContainerStyle}>
			<div style={titleContainerStyle}>
				<div style={redContainerStyle}>
					<p style={whiteStyle}>
						{matchmakingText}
					</p>
				</div>
			</div>
			<div style={buttonContainerStyle}>
				<RedButton
					textContent='Cancel'
					onClick={handleCancelButton}
				/>
			</div>
		</div>
	);
}

export default Lobby;
