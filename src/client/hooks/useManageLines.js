import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setGrid } from '../redux/slices/gameplaySlice'
import { sendLinesCleared } from '../api/socket.api'

const useManageLines = (width, height) => {
	const dispatch = useDispatch()

	const grid = useSelector((state) => state.gameplay.grid)
	const username = useSelector((state) => state.auth.user)
	const socket = useSelector((state) => state.socket?.socket)

	const clearFullLines = useCallback(() => {
		const newGrid = grid.filter((row) =>
			row.some((cell) => cell === 0 || cell === 9)
		)
		const clearedLines = height - newGrid.length

		if (clearedLines > 0) {
			const emptyRows = Array.from({ length: clearedLines }, () =>
				Array(width).fill(0)
			)
			const updatedGrid = [...emptyRows, ...newGrid]

			if (clearedLines > 1) {
				sendLinesCleared(socket, clearedLines)
			}

			dispatch(setGrid(updatedGrid))
		}

		return clearedLines
	}, [dispatch, grid, width, height, socket, username])

	return { clearFullLines }
}

export default useManageLines
