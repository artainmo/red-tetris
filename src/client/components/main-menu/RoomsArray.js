import React, { useEffect, useState } from "react";
import { arrayContainerStyle, arrayDivStyle, titleStyle, delimiterStyle } from "../../style/panelStyle";
import SmallButton from "../shared/SmallButton";
import { getJoinableGames } from "../../api/http.api";
import { useDispatch, useSelector } from "react-redux";
import { joinMultiGameThunk, setPlayersJoinedTheGame } from "../../redux/slices/currentGameSlice";
import { joinRoomThunk } from "../../redux/slices/socketSlice";
import { useNavigate } from "react-router-dom";

const RoomsArray = () => {
	
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [rooms,setRooms] = useState([])
	const username = useSelector((state) => state.auth.user)
	const socket = useSelector((state) => state.socket.socket)
	const gameId = useSelector((state) => state.currentGame.id)

	const joinMultiplayer = (id) => {
		console.log('joining multiplayer room');
		dispatch(joinMultiGameThunk({id: id, username: username, socket: socket}));		
		dispatch(joinRoomThunk({roomName: id, userSocket: socket}));
		dispatch(setPlayersJoinedTheGame(true));
		navigate(`/multiplayer/${gameId}`);
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
								onClick={() => joinMultiplayer(r.id)} 
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
