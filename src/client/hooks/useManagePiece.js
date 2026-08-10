import { useEffect, useCallback, useState } from 'react'
import { TETROMINOS } from '../utils/tetrominoes'
import { PIECES_COLOR_CODES } from '../utils/piecesColorCodes'
import { PIECE_STARTING_ORIENTATIONS } from '../utils/pieceStartingOrientation'
import useCollisionDetection from './useCollisionDetection'
import { useDispatch, useSelector } from 'react-redux'
import { setPiecePosition } from '../redux/slices/gameplaySlice'
import {
	setIsGameOver,
	setOrientation,
	setNextOrientation,
	setGrid,
	setBox,
} from '../redux/slices/gameplaySlice'
import { incrementIndexFun } from '../redux/slices/pieceSlice'
import { pauseGame } from '../redux/slices/gameTimeSlice'
import { loseGame } from '../api/socket.api'
import { StatusGame } from '../utils/statusGame'

const useManagePiece = (width, height) => {
	const dispatch = useDispatch()

	const username = useSelector((state) => state.auth.user)
	const grid = useSelector((state) => state.gameplay.grid)
	const activePiece = useSelector((state) => state.piece.tetrominosCurrentPiece)
	const activePieceType = useSelector((state) => state.piece.currentPiece)
	const nextActivePiece = useSelector(
		(state) => state.piece.tetrominosNextPiece
	)
	const nextActivePieceType = useSelector((state) => state.piece.nextPiece)
	const piecePosition = useSelector((state) => state.gameplay.piecePosition)
	const orientation = useSelector((state) => state.gameplay.orientation)
	const nextPiecePosition = { x: 4, y: 4 }
	const nextOrientation = useSelector((state) => state.gameplay.nextOrientation)
	const isGameOver = useSelector((state) => state.gameplay.isGameOver)
	const socket = useSelector((state) => state.socket?.socket)
	const [update, setUpdate] = useState(false)

	const { canMoveDown, canMoveRight, canMoveLeft, canRotate, canWallRotate } =
		useCollisionDetection(width, height, grid)

	const isPieceInsertable = async (piece, x, y, orientation) => {
		const shapeCoords = piece[orientation]
		const gameOver = shapeCoords.some(([relY, relX]) => {
			const newY = y + relY
			const newX = x + relX
			return grid[newY] && grid[newY][newX] !== 0
		})

		if (gameOver && isGameOver === StatusGame.PLAYING) {
			console.log('dispatching game over')

			dispatch(setIsGameOver(StatusGame.GAME_OVER))

			dispatch(pauseGame())
			loseGame(socket)
			return false
		}
		return true
	}

	const spawnNewPiece = (both) => {
		console.log('Spawning new piece, both:', both)
		console.log('Active piece type:', activePieceType)
		if (isGameOver !== StatusGame.PLAYING) {
			return
		}
		if (both) {
			const pieceLetterCode = activePieceType
			const piece = TETROMINOS[pieceLetterCode]

			if (!piece) {
				console.error('Unknown piece type: ', pieceLetterCode)
				return
			}

			const initialX =
				Math.floor(width / 2) -
				Math.floor(TETROMINOS[pieceLetterCode][0].length / 2)
			const initialY = 0

			if (
				!isPieceInsertable(
					piece,
					initialX,
					initialY,
					PIECE_STARTING_ORIENTATIONS[pieceLetterCode]
				)
			) {
				return
			}

			dispatch(setPiecePosition({ x: initialX, y: initialY }))
			dispatch(setOrientation(PIECE_STARTING_ORIENTATIONS[pieceLetterCode]))
			setUpdate(!update)
		} else {
			dispatch(incrementIndexFun())

			const piece = activePiece

			if (!piece) {
				console.error('Unknown piece type: ', activePieceType)
				return
			}

			const initialX =
				Math.floor(width / 2) -
				Math.floor(TETROMINOS[activePieceType][0].length / 2)
			const initialY = 0

			if (
				!isPieceInsertable(
					piece,
					initialX,
					initialY,
					PIECE_STARTING_ORIENTATIONS[activePieceType]
				)
			) {
				return
			}

			dispatch(setPiecePosition({ x: initialX, y: initialY }))
			dispatch(setOrientation(nextOrientation))
			dispatch(setNextOrientation(PIECE_STARTING_ORIENTATIONS[activePieceType]))
			setUpdate(!update)
		}
	}

	const updateGridWithPiece = (shapeCoords, x, y, colorCode) => {
		console.log('Updating grid with piece at position:', x, y)
		if (!shapeCoords) {
			return
		}
		console.log('shapeCoords:', shapeCoords)
		const newGrid = grid.map((row) => [...row])

		shapeCoords.forEach(([relY, relX]) => {
			const newY = y + relY
			const newX = x + relX
			newGrid[newY][newX] = colorCode
		})

		dispatch(setGrid(newGrid))
	}

	const updateUpcomingPieceBox = (boxCoords, x, y, colorCode) => {
		if (!boxCoords) {
			return
		}

		const newBox = Array.from({ length: 10 }, () => Array(10).fill(0))

		boxCoords.forEach(([relY, relX]) => {
			const newY = y + relY
			const newX = x + relX
			newBox[newY][newX] = colorCode
		})

		dispatch(setBox(newBox))
	}

	const removePiece = useCallback(() => {
		const newGrid = grid.map((row) => [...row])

		if (activePiece) {
			activePiece[orientation].forEach(([relY, relX]) => {
				const oldY = piecePosition.y + relY
				const oldX = piecePosition.x + relX
				newGrid[oldY][oldX] = 0
			})
		}
		dispatch(setGrid(newGrid))
	}, [dispatch, activePiece, grid, orientation, piecePosition])

	const removePieceSync = () => {
		const newGrid = grid.map((row) => [...row])

		if (activePiece) {
			activePiece[orientation].forEach(([relY, relX]) => {
				const oldY = piecePosition.y + relY
				const oldX = piecePosition.x + relX
				newGrid[oldY][oldX] = 0
			})
		}
		console.log(newGrid)
		return newGrid
	}

	const rotatePieceWithWallKick = (newOrientation) => {
		let places = [0, 1, -1]
		if (activePieceType === 'I') {
			places = [0, 1, -1, 2, -2]
		}
		for (const i of places) {
			if (
				canWallRotate(
					activePiece,
					piecePosition.x,
					piecePosition.y,
					orientation,
					newOrientation,
					i
				)
			) {
				removePiece()
				dispatch(
					setPiecePosition({ x: piecePosition.x + i, y: piecePosition.y })
				)
				dispatch(setOrientation(newOrientation))
				return
			}
		}
		console.log('no rotation possible')
	}

	const rotatePiece = useCallback(() => {
		if (activePiece) {
			const newOrientation = (orientation + 90) % 360
			if (
				canRotate(
					activePiece,
					piecePosition.x,
					piecePosition.y,
					orientation,
					newOrientation
				)
			) {
				removePiece()
				dispatch(setOrientation(newOrientation))
			} else {
				rotatePieceWithWallKick(newOrientation)
			}
		}
	}, [
		activePiece,
		piecePosition,
		orientation,
		canRotate,
		removePiece,
		dispatch,
	])

	const movePieceRight = useCallback(() => {
		if (
			!activePiece ||
			!canMoveRight(activePiece, piecePosition.x, piecePosition.y, orientation)
		) {
			return
		}
		removePiece()
		dispatch(setPiecePosition({ x: piecePosition.x + 1, y: piecePosition.y }))
	}, [
		dispatch,
		activePiece,
		piecePosition,
		orientation,
		canMoveRight,
		removePiece,
	])

	const movePieceLeft = useCallback(() => {
		if (
			!activePiece ||
			!canMoveLeft(activePiece, piecePosition.x, piecePosition.y, orientation)
		) {
			return
		}
		removePiece()
		dispatch(setPiecePosition({ x: piecePosition.x - 1, y: piecePosition.y }))
	}, [
		dispatch,
		activePiece,
		piecePosition,
		orientation,
		canMoveLeft,
		removePiece,
	])

	const movePieceDown = () => {
		if (
			!activePiece ||
			!canMoveDown(activePiece, piecePosition.x, piecePosition.y, orientation)
		) {
			return false
		}
		removePiece()
		dispatch(setPiecePosition({ x: piecePosition.x, y: piecePosition.y + 1 }))
		return true
	}

	const dropPiece = () => {
		if (!activePiece) {
			return
		}
		let dropY = piecePosition.y
		while (canMoveDown(activePiece, piecePosition.x, dropY, orientation)) {
			dropY += 1
		}
		removePiece()
		dispatch(setPiecePosition({ x: piecePosition.x, y: dropY }))
	}

	useEffect(() => {
		console.log('useEffect updateGridWithPiece triggered')
		console.log('Dependencies:', {
			activePiece,
			activePieceType,
			piecePosition,
			orientation,
		})
		if (
			activePiece &&
			activePieceType &&
			piecePosition &&
			orientation !== null
		) {
			updateGridWithPiece(
				activePiece[orientation],
				piecePosition.x,
				piecePosition.y,
				PIECES_COLOR_CODES[activePieceType]
			)
		}
	}, [activePiece, activePieceType, piecePosition, orientation, update])

	useEffect(() => {
		if (nextActivePiece && nextActivePieceType) {
			updateUpcomingPieceBox(
				nextActivePiece[nextOrientation],
				nextPiecePosition.x,
				nextPiecePosition.y,
				PIECES_COLOR_CODES[nextActivePieceType]
			)
		}
	}, [nextActivePiece, nextActivePieceType])

	const addUnbreakableMalusLine = useCallback(
		(nlines) => {
			let piecePutDown = false
			let actualGrid = grid
			for (let i = 0; i < nlines; i++) {
				if (
					canMoveDown(
						activePiece,
						piecePosition.x,
						piecePosition.y,
						orientation,
						i + 1
					) === false &&
					piecePutDown === false
				) {
					for (let j = 0; j < i + 1; j++) {
						movePieceDown()
					}
					piecePutDown = true
				}
			}
			if (piecePutDown === false) {
				actualGrid = removePieceSync()
				console.log('removing piece before adding malus line')
			}
			const newGrid = actualGrid.slice(nlines)
			console.log(newGrid)
			const malusRows = Array.from({ length: nlines }, () =>
				Array.from({ length: width }, () => 9)
			)
			const updatedGrid = [...newGrid, ...malusRows]
			if (!piecePutDown) {
				dispatch(setPiecePosition({ x: piecePosition.x, y: piecePosition.y }))
			}

			dispatch(setGrid(updatedGrid))
		},
		[dispatch, grid, width]
	)

	return {
		spawnNewPiece,
		rotatePiece,
		movePieceRight,
		movePieceLeft,
		movePieceDown,
		dropPiece,
		addUnbreakableMalusLine,
	}
}

export { useManagePiece }
