import React from 'react'
import { useSelector } from 'react-redux'
import { fullTransparentMenuPanelStyle } from '../../style/panelStyle'
import {
	statsContainerStyle,
	stackedContainerStyle,
	smallWhiteStyle,
	redStyle,
	greenStyle,
} from '../../style/containersStyle'
import { StatusGame } from '../../utils/statusGame'

const GameStatsPanel = () => {
	const gameTime = useSelector((state) => state.gameTime.currentTime)
	const gameScore = useSelector((state) => state.gameplay.score)
	const isGameOver = useSelector((state) => state.gameplay.isGameOver)

	const formatTime = (milliseconds) => {
		const minutes = Math.floor(milliseconds / (60 * 1000))
		const seconds = ((milliseconds % (60 * 1000)) / 1000).toFixed(0)
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	return (
		<div style={fullTransparentMenuPanelStyle}>
			<div style={statsContainerStyle}>
				<div style={stackedContainerStyle}>
					<p style={smallWhiteStyle}>GAME STATS</p>
				</div>
				<div style={stackedContainerStyle}>
					<p style={smallWhiteStyle}>GAME DURATION</p>
					<p style={smallWhiteStyle}>{formatTime(gameTime)}</p>
				</div>
				<div style={stackedContainerStyle}>
					<p style={smallWhiteStyle}>SCORE</p>
					<p style={smallWhiteStyle}>{gameScore}</p>
				</div>
				{isGameOver == StatusGame.GAME_OVER && (
					<div style={stackedContainerStyle}>
						<p style={redStyle}>GAME OVER</p>
					</div>
				)}
				{isGameOver == StatusGame.WINNER && (
					<div style={stackedContainerStyle}>
						<p style={greenStyle}>YOU WON!</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default GameStatsPanel
