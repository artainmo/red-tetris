import React from "react";
import { arrayContainerStyle, arrayDivStyle, titleStyle, delimiterStyle } from "../../style/panelStyle";
//import { useSelector } from "react-redux";
import Button from "../shared/RedButton";

const RoomsArray = () => {
	

	const handleMatchmakingForMultiplayer = () => {
		console.log('starting matchmaking process for multiplayer');
		dispatch(joinMultiGameThunk(username));
		dispatch(socketConnectThunk());
	}

	const rooms = [] // useSelector((state) => Object.values(state.currentGame.players))

	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div>
					<h2 style={titleStyle}>Active Rooms</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div>
				{
					rooms.map((item, index) => (
						<span key={index}>
							<p>#{index} {item.player1_id} room</p>
							<YellowButton 
								textContent='Join'
								onClick={handleMatchmakingForMultiplayer} 
							/>
						</span>
					))
				}
				</div>	
			</div>
		</div>
	)
}

export default RoomsArray;
