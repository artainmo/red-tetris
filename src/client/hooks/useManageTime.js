import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateGameTime } from '../redux/slices/gameTimeSlice'
import { startGame } from '../redux/slices/gameTimeSlice'
import { listenStartGame } from '../api/socket.api'
import {
	resetGameplay,
	resetGameplayNotBox,
	setScore,
} from '../redux/slices/gameplaySlice'
import pieceSlice from '../redux/slices/pieceSlice'

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
		const onGameStarted = (data) => {
			dispatch(resetGameplayNotBox())
			dispatch(setScore(0))
			//Replaces the piece list with the fresh basket the server just (re)generated (see
			//'restartGame' server-side), instead of replaying whatever list this client held onto
			//from before the (re)start.
			dispatch(pieceSlice.actions.refresh(data?.pieceBasket || []))
			dispatch(startGame())
		}

		listenStartGame(socket, onGameStarted)

		return () => {
			if (socket) {
				socket.off('startGame', onGameStarted)
			}
		}
	}, [dispatch, socket])

	return time
}

export default useManageTime
