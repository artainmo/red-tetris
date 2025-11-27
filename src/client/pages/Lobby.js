/*
	This component is handling matchmaking for multiplayer 
	and the frontend part of game creation for single players
*/

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
	pageMainContainerStyle,
	buttonContainerStyle,
} from '../style/containersStyle'
import FullPageWithCentralText from '../components/shared/FullPageWithCentralText'
import RedButton from '../components/shared/RedButton'
import { endGame } from '../redux/slices/gameTimeSlice'
import {
	resetGame,
	setPlayersJoinedTheGame,
	setWaitingForPlayersToJoin,
	setPlayers,
} from '../redux/slices/currentGameSlice'
import {
	resetGameplayAndEmit,
	setIsGameOver,
} from '../redux/slices/gameplaySlice'
import { leaveRoom, startGame } from '../api/socket.api'

const Lobby = () => {
	const dispatch = useDispatch()
	const [matchmakingText, setMatchmakingText] = useState(
		'Matchmaking In Progress'
	)
	const [gameStartingSoonText, setGameStartingSoonText] = useState(
		'New players joined the game'
	)
	const [dotCount, setDotCount] = useState(0)
	const roomId = useSelector((state) => state.currentGame.id)
	const playersJoinedTheGame = useSelector(
		(state) => state.currentGame.playersJoinedTheGame
	)
	const socket = useSelector((state) => state.socket.socket)

	const navigate = useNavigate()

	/* used to add the "..." dynamically in the matchmaking text */
	useEffect(() => {
		console.log('useEffect matchmaking')

		const interval = setInterval(() => {
			if (dotCount < 3) {
				setMatchmakingText((matchmakingText) => matchmakingText + '.')
				setDotCount(dotCount + 1)
			} else {
				setMatchmakingText('Matchmaking In Progress')
				setDotCount(0)
			}
		}, 500)

		return () => clearInterval(interval)
	}, [setMatchmakingText, dotCount])

	useEffect(() => {
		socket.on('newPlayerJoined', (data) => {
			console.log('NEW PLAYER JOINED')
			console.log(data)
			dispatch(setWaitingForPlayersToJoin(false))
			dispatch(setPlayersJoinedTheGame(true))
			dispatch(setPlayers(data.player))
			startGame(socket, roomId)
		})

		socket.on('startGame', () => {
			console.log('startgame in first player')
			console.log('startGame')
			navigate(`/multiplayer/${roomId}`)
		})
	}, [socket])

	const handleCancelButton = () => {
		// add some API call to remove the player form the match
		console.log('should cancel the game')
		leaveRoom(socket)
		dispatch(setIsGameOver(true))
		dispatch(endGame())
		dispatch(resetGame())
		dispatch(resetGameplayAndEmit())
		navigate('/main_menu')
	}

	return (
		<div style={pageMainContainerStyle}>
			{
				/* ca serait cool de faire un countdown de 10 seconds si on a le temps */
				playersJoinedTheGame ? (
					<FullPageWithCentralText
						firstLine={gameStartingSoonText}
						secondLine={'Game will start soon.'}
					/>
				) : (
					<FullPageWithCentralText
						firstLine={matchmakingText}
						secondLine={''}
					/>
				)
			}
			<div style={buttonContainerStyle}>
				<RedButton textContent="Cancel" onClick={handleCancelButton} />
			</div>
		</div>
	)
}

export default Lobby
