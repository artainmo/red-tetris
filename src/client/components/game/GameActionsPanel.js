import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
	endGame,
	resumeGame,
	pauseGame,
} from '../../redux/slices/gameTimeSlice'
import { leaveRoom, startGame } from '../../api/socket.api'
import { resetGame } from '../../redux/slices/currentGameSlice'
import { resetGameplayAndEmit } from '../../redux/slices/gameplaySlice'
import { inlineContainerStyle } from '../../style/containersStyle'
import Cell from './Cell'
import RedButton from '../shared/RedButton'
import YellowButton from '../shared/YellowButton'
import { middlePanelStyle } from '../../style/panelStyle'
import useManageTime from '../../hooks/useManageTime'
import { pieceContainerStyle } from '../../style/containerStyle'

const GameActionsPanel = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const isGamePaused = useSelector((state) => state.gameTime.isGamePaused)
	const isGameStarted = useSelector((state) => state.gameTime.isGameActive)
	const box = useSelector((state) => state.gameplay.box)
	const opponents = useSelector((state) => state.opponents)
	const roomId = useSelector((state) => state.room.id)
	const socket = useSelector((state) => state.socket?.socket)
	const host = useSelector((state) => state.room.host)
	const username = useSelector((state) => state.auth.user)
	const [isHost, setIsHost] = useState(false)
	const players = useSelector((state) => state.room.players)
	const [opponentsList, setOpponentsList] = useState([])
	console.log('opponents in GameActionsPanel:', opponents)
	const isGameOver = useSelector((state) => state.gameplay.isGameOver)
	React.useEffect(() => {
		if (username === host) {
			setIsHost(true)
		} else {
			setIsHost(false)
		}
	}, [host])

	useEffect(() => {
		console.log(players)
	}, [players])

	useManageTime()

	/* dimensions of the board, in numbers of cells */
	const BOX_WIDTH = 10
	const BOX_HEIGHT = 10
	/* dimensions of an individual cell */
	const CELL_WIDTH = 30
	const CELL_HEIGHT = 30
	/* dimensions of the BOX, in pixels */
	const BOX_WIDTH_PIXELS = BOX_WIDTH * CELL_WIDTH
	const BOX_HEIGHT_PIXELS = BOX_HEIGHT * CELL_HEIGHT

	useEffect(() => {
		console.log('opponents updated:', opponents)
		if (opponents && opponents.byId.length > 0) {
			setOpponentsList(
				opponents.byId.map((opponent) => ({
					id: opponent,
					grid: opponents.entities[opponent].grid,
					score: opponents.entities[opponent].score,
				}))
			)
		}
	}, [opponents, setOpponentsList])

	useEffect(() => {
		// updateScreenAndScore(socket, newGrid, score);
	}, [socket])

	const pieceSquare = {
		width: BOX_WIDTH_PIXELS,
		height: BOX_HEIGHT_PIXELS,
		display: 'grid',
		gridTemplateRows: `repeat(${BOX_HEIGHT}, 1fr)`,
		gridTemplateColumns: `repeat(${BOX_WIDTH}, 1fr)`,
		boxSizing: 'border-box',
		border: '1rem solid white',
		filter: isGameOver ? 'grayscale(100%) brightness(0.7)' : 'none',
	}

	const alignSelfEnd = {
		alignSelf: 'flex-end',
		marginBottom: '1rem',
	}

	const handleClickStartButton = () => {
		startGame(socket, roomId)
	}

	const handleClickRestartButton = () => {
		startGame(socket, roomId)
	}

	const handleClickPauseResumeButton = () => {
		console.log('should pause the game')
		if (!isGamePaused) {
			dispatch(pauseGame())
		} else {
			dispatch(resumeGame())
		}
	}

	const handleClickCancelButton = () => {
		console.log('should cancel the game')
		leaveRoom(socket)
		dispatch(endGame())
		dispatch(resetGame())
		dispatch(resetGameplayAndEmit())
		navigate('/main_menu')
	}

	return (
		<div style={middlePanelStyle}>
			<div style={pieceContainerStyle}>
				<div style={pieceSquare}>
					{box.map((row, rowIndex) =>
						row.map((cell, cellIndex) => (
							<Cell key={`${rowIndex}-${cellIndex}`} colorCode={cell} />
						))
					)}
				</div>
			</div>
			{isHost && <div>Host</div>}
			<div style={inlineContainerStyle}>
				<div style={alignSelfEnd}>
					{isGameStarted && !isGameOver ? (
						<RedButton
							textContent={isGamePaused ? 'Resume' : 'Pause'}
							onClick={handleClickPauseResumeButton}
						/>
					) : isHost && isGameOver ? (
						<RedButton
							textContent="Restart"
							onClick={handleClickRestartButton}
						/>
					) : (
						<RedButton textContent="Start" onClick={handleClickStartButton} />
					)}
				</div>
				<div style={alignSelfEnd}>
					<YellowButton
						textContent="Cancel"
						onClick={handleClickCancelButton}
					/>
				</div>
			</div>
		</div>
	)
}

export default GameActionsPanel
