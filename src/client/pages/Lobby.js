import React, { useEffect, useState } from "react";
import Header from '../components/Header';
import { landingPageStyle, mainContainerStyle } from "../style/mainStyle";

const Lobby = () => {
	
	const [matchmakingText, setMatchmakingText] = useState('Matchmaking In Progress');

	// used to add the ... dynamically in the matchmaking text
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
	
	return (
		<div style={mainContainerStyle}>
			<Header />
			<div style={landingPageStyle}>
				<p>{matchmakingText}</p>
				<button>
					Cancel
				</button>
			</div>
		</div>
	);
}

export default Lobby;
