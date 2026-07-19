import { useRef, useEffect, useState } from 'react'
import useManagePiece from './useManagePiece'
import useManageLines from './useManageLines'
import { useSelector, useDispatch } from 'react-redux'
import { pauseGame, resumeGame } from '../redux/slices/gameTimeSlice'
import { listenLinesCleared } from '../api/socket.api'
import { EmitGridAndScore } from '../redux/slices/gameplaySlice'

const useModifyGrid = (width, height) => {
	const dispatch = useDispatch()
	const isGamePaused = useSelector((state) => state.gameTime.isGamePaused)
	const startGame = useSelector((state) => state.gameTime.isGameActive)
	const username = useSelector((state) => state.auth.user)
	const grid = useSelector((state) => state.gameplay.grid)
	const socket = useSelector((state) => state.socket?.socket)

	const [isInContact, setIsInContact] = useState(false)

	const {
		spawnNewPiece,
		movePieceLeft,
		movePieceRight,
		rotatePiece,
		movePieceDown,
		dropPiece,
		addUnbreakableMalusLine,
	} = useManagePiece(width, height)
	const { clearFullLines } = useManageLines(width, height)

	useEffect(() => {
		if (!socket) {
			return
		}
		const onLinesCleared = (player, linesCleared) => {
			if (!linesCleared || linesCleared <= 0) {
				return
			}
			if (player === username) {
				return
			}
			addUnbreakableMalusLine(linesCleared)
		}
		listenLinesCleared(socket, onLinesCleared)
		return () => {
			if (socket && socket.off) {
				socket.off('linesCleared')
			}
		}
	}, [socket, username, addUnbreakableMalusLine])

	useEffect(() => {
		const handleKeyDown = (event) => {
			if ((isGamePaused && event.key !== 'Escape') || !startGame) {
				return
			}
			switch (event.key) {
				case 'ArrowUp':
					rotatePiece()
					break
				case 'ArrowLeft':
					movePieceLeft()
					break
				case 'ArrowRight':
					movePieceRight()
					break
				case 'ArrowDown':
					movePieceDown()
					break
				case 'u':
					console.log('Adding unbreakable malus line for testing')
					addUnbreakableMalusLine(1)
					break
				case ' ':
					event.preventDefault()
					dropPiece()
					break
				case 'Escape':
					if (!isGamePaused) {
						dispatch(pauseGame())
					} else {
						dispatch(resumeGame())
					}
					break
				default:
					break
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [
		movePieceLeft,
		movePieceRight,
		rotatePiece,
		movePieceDown,
		dropPiece,
		isGamePaused,
		dispatch,
		startGame,
	])

	const applyGravityRef = useRef(null)

	useEffect(() => {
		applyGravityRef.current = () => {
			if (isGamePaused || !startGame) {
				return
			}
			const pieceCanFall = movePieceDown()

			if (pieceCanFall) {
				setIsInContact(false)
			} else {
				if (isInContact) {
					clearFullLines()
					dispatch(EmitGridAndScore())
					spawnNewPiece(false)
				} else {
					setIsInContact(true)
				}
			}
		}
	}, [
		dispatch,
		movePieceDown,
		isInContact,
		clearFullLines,
		isGamePaused,
		startGame,
	])

	useEffect(() => {
		const interval = setInterval(() => {
			applyGravityRef.current()
		}, 500)

		return () => clearInterval(interval)
	}, [])

	return grid
}

export default useModifyGrid
