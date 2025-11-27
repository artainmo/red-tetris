import React from 'react'
import PropTypes from 'prop-types'
import Cell from './Cell'

export default function Panel({ grid, size }) {
	const BOARD_WIDTH = 10
	const BOARD_HEIGHT = 20
	const CELL_WIDTH = 30
	const CELL_HEIGHT = 30
	const BOARD_WIDTH_PIXELS = BOARD_WIDTH * CELL_WIDTH
	const BOARD_HEIGHT_PIXELS = BOARD_HEIGHT * CELL_HEIGHT

	const boardCellsContainerStyle = {
		width: BOARD_WIDTH_PIXELS * (size ? size : 1),
		height: BOARD_HEIGHT_PIXELS * (size ? size : 1),
		display: 'grid',
		gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
		gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
		boxSizing: 'border-box',
		border: '1rem solid white',
	}

	return (
		<div style={boardCellsContainerStyle}>
			{grid.map((row, rowIndex) =>
				row.map((cell, cellIndex) => (
					<Cell key={`${rowIndex}-${cellIndex}`} colorCode={cell} />
				))
			)}
		</div>
	)
}

Panel.propTypes = {
	grid: PropTypes.array.isRequired,
	size: PropTypes.number,
}
