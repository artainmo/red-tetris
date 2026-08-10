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
		try {
			dispatch(resetGameplayAndEmit())
		} catch (error) {
			console.error('Error occurred while resetting gameplay:', error)
		}
		dispatch(resetAllOpponents())
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
			//'/game/:room_id/:username' - read the room being left off the OLD path, not off redux state,
			//since by the time this runs the user may already have created/joined a different room (this
			//cleanup can lag behind that). Tagging the leave with the room it's actually meant for lets the
			//server ignore it if it arrives late - see 'leaveRoom' in app.js.
			const leavingRoomId = prev.pathname.split('/')[2] || null
			if (socket) leaveRoom(socket, leavingRoomId)
			dispatch(resetGameplayAndEmit())
			dispatch(resetAllOpponents())
		}

		prevLocationRef.current = location
	}, [location, socket, dispatch])

	return <Outlet />
}

export default GameGuard
