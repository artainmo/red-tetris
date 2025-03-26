import React, { useEffect, useState } from "react";
import { arrayContainerStyle, arrayDivStyle, titleStyle, delimiterStyle } from "../../style/panelStyle";
import SmallButton from "../shared/SmallButton";
import { getJoinableGames } from "../../api/http.api";

const RoomsArray = () => {
	
	const [rooms,setRooms] = useState([])

	const handleMatchmakingForMultiplayer = () => {
		console.log('starting matchmaking process for multiplayer');
		dispatch(joinMultiGameThunk(username));
		dispatch(socketConnectThunk());
	}

	useEffect(() => {
		const fetchRooms = async () => {
		  try {
			const data = await getJoinableGames();
			setRooms(data.games);
		  } catch (error) {
			console.error('Error fetching joinable games:', error);
		  }
		};
	  
		fetchRooms();
		console.log(rooms)
	  }, []);

	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div>
					<h2 style={titleStyle}>Active Rooms</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div className="d-flex flex-wrap justify-content-between align-items-center">
				{
					rooms.length === 0 ?
					<p>No rooms to join right now</p>
					:
					rooms.map((item, index) => (
						<div style={{display:"flex"}} key={index}>
							<p style={{margin: "auto"}}>#{index} {item.player1_id} room</p>
							<SmallButton
								textContent={"Join"}
								onClick={handleMatchmakingForMultiplayer} 
							/>
						</div>
					))
				}
				</div>	
			</div>
		</div>
	)
}

export default RoomsArray;
