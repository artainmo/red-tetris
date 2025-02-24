import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGrid, setScore } from "../redux/slices/gameplaySlice";
import { setPlayerScore } from "../redux/slices/currentGameSlice"

const useManageLines = (width, height) => {

	const dispatch = useDispatch();

	const grid = useSelector((state) => state.gameplay.grid);
	const score = useSelector((state) => state.gameplay.score);
	const username = useSelector((state) => state.auth.user)
	
	const clearFullLines = useCallback(() => { 
		const newGrid = grid.filter(row => row.some(cell => cell === 0));
		const clearedLines = height - newGrid.length + 1;

		const emptyRows = Array.from({ length: clearedLines }, () => Array(width).fill(0));
		const updatedGrid = [...emptyRows, ...newGrid];

		if (clearedLines > 0) {
			dispatch(setGrid(updatedGrid));
			dispatch(setScore(score + clearedLines * 10));
			dispatch(setPlayerScore({username: username, score: score}))
		} 

		// send malus to API (do when integrate with full multi game) TODO
	}, [dispatch, grid, width, height, score]);

	const addUnbreakableMalusLine = useCallback(() => {
		
	}, []);

	return { clearFullLines, addUnbreakableMalusLine };
}

export default useManageLines;
