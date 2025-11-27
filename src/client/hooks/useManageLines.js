import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setGridAndEmit, setScore } from '../redux/slices/gameplaySlice'
import { setPlayerScore } from '../redux/slices/currentGameSlice'
import { sendLinesCleared } from '../api/socket.api'

const useManageLines = (width, height) => {
	const dispatch = useDispatch()

	const grid = useSelector((state) => state.gameplay.grid)
	const score = useSelector((state) => state.gameplay.score)
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

			dispatch(setGridAndEmit(updatedGrid))
			const currScore = score + clearedLines * 10
			dispatch(setScore(currScore))
			dispatch(setPlayerScore({ username: username, score: currScore }))
		}

		return clearedLines
	}, [dispatch, grid, width, height, score, socket, username])

	// const addUnbreakableMalusLine = useCallback((nlines) => {
	// 	const newGrid = grid.slice(nlines);
	// 	const malusRows = Array.from({ length: nlines }, () =>
	// 		Array.from({ length: width }, () => 9)
	// 	);
	// 	const updatedGrid = [...newGrid, ...malusRows];
	// 	dispatch(setGridAndEmit({ grid: updatedGrid, keepCurrentPiece: true }));
	// }, [dispatch, grid, width]);

	return { clearFullLines }
}

export default useManageLines
