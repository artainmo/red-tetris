import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { socketConnectThunk } from '../redux/slices/socketSlice'
import { joinRoomThunk } from '../redux/slices/roomSlice'
import { userConnect } from '../redux/slices/authSlice'
import { pageMainContainerStyle } from '../style/containersStyle'
import Board from '../components/game/Board'
import GameStatsPanel from '../components/game/GameStatsPanel'
import { panelsStyle } from '../style/panelStyle'
import RedTetrisLogo from '../components/shared/RedTetrisLogo'
import { useGameSocket, useRoomSocket } from '../hooks/useRoomSocket'
import OpponentsPanel from '../components/game/OpponentsPanel'
import { useNextPieceListener } from '../redux/slices/pieceSlice'

const Game = () => {
	const { room_id, username } = useParams()
	const authentificationStatus = useSelector((state) => state.socket.status)
	const roomError = useSelector((state) => state.room.error)
	const socket = useSelector((state) => state.socket.socket)
	const roomId = useSelector((state) => state.room.id)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const roomSocket = useRoomSocket()
	const gameSocket = useGameSocket()
	const pieceSocket = useNextPieceListener()

	useEffect(() => {
		async function handleAuth() {
			console.log('handle Auth!')
			if (socket !== null) {
				return
			}
			if (!username || username.trim() === '') {
				setEmptyInputErrMsg(true)
				return
			}
			console.log('handle Auth!')
			const data = await dispatch(userConnect(username))
			console.log('data from dispatch:', data)
			try {
				await dispatch(socketConnectThunk(data.payload.jwt)).unwrap()
			} catch (err) {
				console.log('Socket connection failed:', err)
			}
		}
		handleAuth()
	}, [username, socket])

	useEffect(() => {
		if (authentificationStatus === 'disconnected') {
			navigate('/auth', { replace: true })
		}
		if (authentificationStatus === 'connected') {
			console.log('Socket connected')
		}
	}, [authentificationStatus])

	useEffect(() => {
		if (roomError !== null && authentificationStatus === 'connected') {
			console.error('Room error:', roomError)
			navigate('/main_menu', { replace: true })
		}
	}, [roomError, authentificationStatus, navigate])

	useEffect(() => {
		if (authentificationStatus === 'connected') {
			dispatch(
				joinRoomThunk({ username, userSocket: socket, roomName: room_id })
			)
		}
	}, [authentificationStatus, room_id, username, socket, dispatch])

	return authentificationStatus === 'null' ? (
		<div>Loading...</div>
	) : authentificationStatus === 'connected' && roomId !== null ? (
		<div style={pageMainContainerStyle}>
			<RedTetrisLogo firstLine={'Red'} secondLine={'Tetris'} />
			<div style={panelsStyle}>
				<OpponentsPanel />
				<GameStatsPanel />
				<Board />
			</div>
		</div>
	) : (
		<div>Joining game...</div>
	)
}

export default Game
