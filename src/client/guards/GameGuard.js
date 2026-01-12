import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { endGame } from '../redux/slices/gameTimeSlice'
import { removeCurrentPiece } from '../redux/slices/pieceSlice'
import { resetGameplayAndEmit } from '../redux/slices/gameplaySlice'
import { leaveRoom } from '../api/socket.api'
import { resetAllOpponents } from '../redux/slices/opponentsSlice'

const GameGuard = () => {
	const location = useLocation()
	const prevLocationRef = useRef(null)
	const dispatch = useDispatch()
	const socket = useSelector((state) => state.socket?.socket)

	useEffect(() => {
		console.log('🧠 GameGuard mounted')
		return () => console.log('💀 GameGuard unmounted')
	}, [])

	useEffect(() => {
		const prev = prevLocationRef.current

		if (
			prev?.pathname.startsWith('/game') &&
			!location.pathname.startsWith('/game')
		) {
			console.log('Leaving game → cleanup')
			dispatch(endGame())
			dispatch(removeCurrentPiece())
			if (socket) leaveRoom(socket)
			dispatch(resetGameplayAndEmit())
			dispatch(resetAllOpponents())
		}

		prevLocationRef.current = location
	}, [location, socket, dispatch])

	return <Outlet />
}

export default GameGuard
