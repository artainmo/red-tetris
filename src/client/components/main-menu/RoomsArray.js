import React, { useEffect, useState } from "react";
import { arrayContainerStyle, arrayDivStyle, titleStyle, delimiterStyle } from "../../style/panelStyle";
import SmallButton from "../shared/SmallButton";
import { getJoinableGames } from "../../api/http.api";
import { useDispatch, useSelector } from "react-redux";
import { joinMultiGameThunk, setPlayersJoinedTheGame } from "../../redux/slices/currentGameSlice";
import { socketConnectThunk } from "../../redux/slices/socketSlice";

const RoomsArray = () => {
	
	const dispatch = useDispatch();

	const [rooms,setRooms] = useState([])
	const username = useSelector((state) => state.auth.user)

	const handleMatchmakingForMultiplayer = (id) => {
		console.log('starting matchmaking process for multiplayer');
		dispatch(joinMultiGameThunk({id: id, username: username}));
		dispatch(socketConnectThunk());
		dispatch(setPlayersJoinedTheGame(true));
	}

	useEffect(() => {
		const fetchRooms = async () => {
		  try {
			const data = await getJoinableGames();
			console.log("rooms")
			console.log(data.games)
			setRooms(data.games);
		  } catch (error) {
			console.error('Error fetching joinable games:', error);
		  }
		};
	  
		fetchRooms();

	  }, []);

	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div>
					<h2 style={titleStyle}>Active Rooms</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
				{
					rooms.length === 0 ?
					<p>No rooms to join right now</p>
					:
					rooms.map((r, index) => (
						<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} key={index}>
							<p style={{ margin: 'auto', marginLeft: '0' }}>#{index} {r.player1_id} room</p>
							<SmallButton
								textContent={"Join"}
								onClick={() => handleMatchmakingForMultiplayer(r.id)} 
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
