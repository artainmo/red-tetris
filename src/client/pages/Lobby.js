import React from "react";
import Header from '../components/Header';
import { landingPageStyle } from "../style/mainStyle";

const Lobby = () => {
	
	return (
		<div style={landingPageStyle}>
			<Header />
			<div>
				<p>Matchmaking In Progress</p>
				<button>
					Cancel
				</button>
			</div>
		</div>
	);
}

export default Lobby;
