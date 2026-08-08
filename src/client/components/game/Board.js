import React from 'react'
import useModifyGrid from '../../hooks/useModifyGrid'
import GameActionsPanel from './GameActionsPanel'
import { fullTransparentMenuPanelStyle } from '../../style/panelStyle'
import Panel from './Panel'
import { useSelector } from 'react-redux'
import { StatusGame } from '../../utils/statusGame'

const Board = () => {
	const isGameOver = useSelector((state) => state.gameplay.isGameOver)
	const BOARD_WIDTH = 10
	const BOARD_HEIGHT = 20

	const grid = useModifyGrid(BOARD_WIDTH, BOARD_HEIGHT)

	const boardContainerStyle = {
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		filter:
			isGameOver !== StatusGame.PLAYING
				? 'grayscale(100%) brightness(0.7)'
				: 'none',
	}

	return (
		<>
			<div style={fullTransparentMenuPanelStyle}>
				<div style={boardContainerStyle}>
					<Panel grid={grid} />
				</div>
			</div>
			<div style={fullTransparentMenuPanelStyle}>
				<GameActionsPanel />
			</div>
		</>
	)
}

export default Board
