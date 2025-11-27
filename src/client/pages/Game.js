import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { socketConnectThunk } from "../redux/slices/socketSlice";
import { joinRoomThunk } from "../redux/slices/roomSlice";
import { userConnect } from "../redux/slices/authSlice";
import { pageMainContainerStyle } from "../style/containersStyle";
import Board from "../components/game/Board";
import GameStatsPanel from "../components/game/GameStatsPanel";
import { panelsStyle } from "../style/panelStyle";
import RedTetrisLogo from "../components/shared/RedTetrisLogo";
import GameEnd from "./GameEnd";
import { useGameSocket, useRoomSocket } from "../hooks/useRoomSocket";
import OpponentsPanel from "../components/game/OpponentsPanel";
import { useNextPieceListener } from "../redux/slices/pieceSlice";

const Game = () => {
	
	const { room_id, username } = useParams();
	const isGameOver = useSelector((state) => state.gameplay.isGameOver)
	const score = useSelector((state) => state.gameplay.score)
	const authentificationStatus = useSelector((state) => state.socket.status);
	// guard against undefined roomSlice to avoid runtime error when reading id
	// const gameStatus = useSelector((state) => state.roomSlice?.id ?? null);
	const roomError = useSelector((state) => state.room.error);
	const socket = useSelector((state) => state.socket.socket);
	const roomId = useSelector((state) => state.room.id);
	const [roomJoined, setRoomJoined] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const roomSocket = useRoomSocket();
	const gameSocket = useGameSocket();
	const pieceSocket = useNextPieceListener();



	useEffect(() => {
		async function handleAuth() {
			console.log("handle Auth!")
			if (socket !== null) {
				return;
			}
			if (!username || username.trim() === "") {
				setEmptyInputErrMsg(true);
				return;
			}
			console.log("handle Auth!")
			// setConnectionAttempt(true);
			const data = await dispatch(userConnect(username));
			console.log("data from dispatch:", data);
			try {
				await dispatch(socketConnectThunk(data.payload.jwt)).unwrap();
			} catch (err) {
				console.log("Socket connection failed:", err);
			}
		}
		handleAuth();
	}, [username, socket]);

	useEffect(() => {
		if (authentificationStatus === 'disconnected') {
			navigate(`/auth`, { replace: true });
		}
		if (authentificationStatus === 'connected') {
			console.log("Socket connected");
		}
	}, [authentificationStatus]);

	useEffect(() => {
		if (roomError !== null && authentificationStatus === 'connected') {
			console.error("Room error:", roomError);
			navigate(`/main_menu`, { replace: true });
		}
	}, [roomError, authentificationStatus, navigate]);

	useEffect(() => {
		if (authentificationStatus === 'connected') {
			dispatch(joinRoomThunk({ username, userSocket: socket, roomName: room_id }));
		}
	}, [authentificationStatus, room_id, username, socket, dispatch]);

	// useEffect(() => {
	// 	dispatch(joinRoomThunk({ room: room_id, playerName: username }));
	// }, [room_id, username, dispatch]);

	useEffect(() => {
		if (roomId !== null) {
			console.log("Game started!");
			setRoomJoined(true);
		}
	}, [roomId]);

	return (
		authentificationStatus === 'null' ?
			<div>Loading...</div>
			:
			authentificationStatus === 'connected' && roomId !== null ?
				<div style={pageMainContainerStyle}>		
					<RedTetrisLogo firstLine={"Red"} secondLine={"Tetris"}/>	
					<div style={panelsStyle}>
						<OpponentsPanel />						{/* Right panel */}
						<GameStatsPanel />							{/* Left panel */}
						<Board isMultiPlayer={false}/>				{/* Center and right panel */}
					</div>
				</div>
				:
				<div>Joining game...</div>
	)
}

export default Game;
