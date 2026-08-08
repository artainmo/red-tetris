import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	listenPlayerLeft,
	listenPlayerJoined,
	listenLinesCleared,
	listenOtherScreenAndScore,
	updateScore,
	listenNewHost,
} from '../api/socket.api'
import { playerLeft, playerJoined, setNewHost } from '../redux/slices/roomSlice'
import {
	removeOpponent,
	setOpponentGridAndScore,
} from '../redux/slices/opponentsSlice'
import { StatusGame } from '../utils/statusGame'
import { setScore, setIsGameOver } from '../redux/slices/gameplaySlice'
import { pauseGame } from '../redux/slices/gameTimeSlice'

const useRoomSocket = () => {
	const socket = useSelector((state) => state.socket?.socket)
	const dispatch = useDispatch()

	useEffect(() => {
		if (!socket) {
			return
		}

		const onPlayerLeft = (data) => {
			console.log('Player left: ', data)
			dispatch(playerLeft(data))
			dispatch(removeOpponent(data))
		}

		const onPlayerJoined = (data) => {
			console.log('Player joined: ', data)
			dispatch(playerJoined(data))
		}

		const onGameStarted = () => {
			dispatch(startGame())
			dispatch(resetAllOpponents())
		}

		listenPlayerLeft(socket, onPlayerLeft)
		listenPlayerJoined(socket, onPlayerJoined)

		return () => {
			if (socket && socket.off) {
				socket.off('playerLeft')
				socket.off('playerJoined')
			}
		}
	}, [socket, dispatch])
}

export { useRoomSocket }

const useGameSocket = () => {
	const socket = useSelector((state) => state.socket?.socket)
	const username = useSelector((state) => state.auth.user)
	const dispatch = useDispatch()

	useEffect(() => {
		if (!socket) {
			return
		}

		const onScreenAndScoreUpdate = (data) => {
			dispatch(
				setOpponentGridAndScore({
					id: data.player,
					grid: data.structure,
					score: data.score,
				})
			)
		}

		const onPlayerLeft = (data) => {
			console.log(`Player ${data.player} has left the game.`)
			dispatch(removeOpponent(data.player))
		}

		const onLinesCleared = (player, linesCleared) => {
			console.log(`Player ${player} cleared ${linesCleared} lines.`)
		}

		const onScoreUpdate = (data) => {
			console.log(
				`Score update for ${data.username}: ${data.score} + ${data.isWinner}`
			)
			if (data.username && data.score !== undefined) {
				if (data.username === username) {
					dispatch(setScore(data.score))
					dispatch(pauseGame())
					if (data.isGameOver) {
						dispatch(setIsGameOver(StatusGame.WINNER))
					} else {
						dispatch(setIsGameOver(StatusGame.GAME_OVER))
					}
				} else {
					dispatch(
						setOpponentGridAndScore({
							id: data.username,
							score: data.score,
							isGameOver: data.isGameOver || false,
						})
					)
				}
			}
		}

		const onNewHost = (newHost) => {
			console.log(`New host is ${newHost}`)
			dispatch(setNewHost(newHost))
		}

		listenOtherScreenAndScore(socket, onScreenAndScoreUpdate)
		listenLinesCleared(socket, onLinesCleared)
		listenPlayerLeft(socket, onPlayerLeft)
		listenNewHost(socket, onNewHost)
		updateScore(socket, onScoreUpdate)

		return () => {
			if (socket && socket.off) {
				socket.off('screenAndScoreUpdate')
				socket.off('linesCleared')
				socket.off('playerLeft')
				socket.off('updateScore')
				socket.off('newHost')
			}
		}
	}, [socket, dispatch])
}

export { useGameSocket }
