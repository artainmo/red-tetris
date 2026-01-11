import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateGameTime } from '../redux/slices/gameTimeSlice'
import { startGame } from '../redux/slices/gameTimeSlice'
import { listenStartGame } from '../api/socket.api'
import {
	resetGameplay,
	resetGameplayNotBox,
} from '../redux/slices/gameplaySlice'

const useManageTime = () => {
	const dispatch = useDispatch()
	const socket = useSelector((state) => state.socket?.socket)

	const time = useSelector((state) => state.gameTime.currentTime)
	const gameActive = useSelector((state) => state.gameTime.isGameActive)
	const [intervalId, setIntervalId] = useState(null)

	useEffect(() => {
		if (gameActive) {
			const id = setInterval(() => {
				dispatch(updateGameTime())
			}, 1000)

			setIntervalId(id)

			return () => clearInterval(id)
		}
	}, [gameActive])

	useEffect(() => {
		if (time >= 60 * 60 * 1000) {
			clearInterval(intervalId)
		}
	}, [time, intervalId])

	useEffect(() => {
		console.log('Setting up listenStartGame in useManageTime')
		const onGameStarted = () => {
			dispatch(resetGameplayNotBox())
			dispatch(startGame())
		}

		listenStartGame(socket, onGameStarted)

		return () => {
			if (socket) {
				socket.off('gameStarted', onGameStarted)
			}
		}
	}, [dispatch, socket])

	return time
}

export default useManageTime
