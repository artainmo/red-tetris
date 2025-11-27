import React, { useEffect } from "react";
import useModifyGrid from "../../hooks/useModifyGrid";
import Cell from "./Cell";
import GameActionsPanel from "./GameActionsPanel";
import { fullTransparentMenuPanelStyle } from "../../style/panelStyle";
import Panel from "./Panel";
import { useSelector } from "react-redux";

const Board = ({isMultiPlayer}) => {
	const isGameOver = useSelector((state) => state.gameplay.isGameOver);
	/* dimensions of the board, in numbers of cells */
	const BOARD_WIDTH = 10;
	const BOARD_HEIGHT = 20;
	/* dimensions of an individual cell */
	const CELL_WIDTH = 30;
	const CELL_HEIGHT = 30;
	/* dimensions of the board, in pixels */
	const BOARD_WIDTH_PIXELS = BOARD_WIDTH * CELL_WIDTH;
	const BOARD_HEIGHT_PIXELS = BOARD_HEIGHT * CELL_HEIGHT;

	const grid = useModifyGrid(BOARD_WIDTH, BOARD_HEIGHT);
	
	const boardContainerStyle = {
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		filter: isGameOver ? 'grayscale(100%) brightness(0.7)' : 'none'

	}
	
	return (
		<>
			<div style={fullTransparentMenuPanelStyle}>
				<div style={boardContainerStyle}>
					<Panel grid={grid} />
				</div>
			</div>
			<div style={fullTransparentMenuPanelStyle}>
				<GameActionsPanel isMultiPlayer={isMultiPlayer}/>
			</div>
		</>
		
	)
}

export default Board;
