import React, { useEffect, useState } from 'react'
import {
	arrayContainerStyle,
	arrayDivStyle,
	titleStyle,
	delimiterStyle,
} from '../../style/panelStyle'
import SmallButton from '../shared/SmallButton'
import { getJoinableGames } from '../../api/http.api'
import { useDispatch, useSelector } from 'react-redux'
import { joinRoomThunk } from '../../redux/slices/roomSlice'
import { useNavigate } from 'react-router-dom'

const RoomsArray = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [rooms, setRooms] = useState([])
	const [loading, setLoading] = useState(false)
	const username = useSelector((state) => state.auth.user)
	const socket = useSelector((state) => state.socket.socket)
	// const gameId = useSelector((state) => state.currentGame.id)
	// const playersJoinedTheGame = useSelector(
	// 	(state) => state.currentGame.playersJoinedTheGame
	// )
	const fetchRooms = async () => {
		setLoading(true)
		try {
			const data = await getJoinableGames()
			setRooms(data.games || [])
			console.log('fetched games:', data.games)
		} catch (error) {
			console.error('Error fetching joinable games:', error)
		} finally {
			setLoading(false)
		}
	}

	const joinMultiplayer = async (id) => {
		console.log('joining multiplayer room')
		dispatch(
			joinRoomThunk({ username: username, userSocket: socket, roomName: id })
		)
	}

	// useEffect(() => {
	// 	fetchRooms()

	// 	if (playersJoinedTheGame) {
	// 		console.log('navigate multiplayer')
	// 		navigate(`/game/${gameId}/${username}`)
	// 	}
	// }, [playersJoinedTheGame])

	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<div style={{ alignItems: 'center', width: '100%' }}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<h2 style={titleStyle}>Active Rooms</h2>
							<SmallButton
								textContent={loading ? 'Refreshing...' : 'Refresh'}
								onClick={fetchRooms}
							/>
						</div>
						<div style={delimiterStyle}></div>
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						height: '60%',
						overflowY: 'auto',
						marginTop: 10,
					}}
				>
					{rooms.length === 0 ? (
						<p>No rooms to join right now</p>
					) : (
						rooms.map((r, index) => (
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									width: '100%',
								}}
								key={r.id || index}
							>
								<p style={{ margin: 'auto', marginLeft: '0' }}>
									#{index} {r.host} room ({r.players.length} players)
								</p>
								<SmallButton
									textContent={'Join'}
									onClick={() => joinMultiplayer(r.id)}
								/>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default RoomsArray
