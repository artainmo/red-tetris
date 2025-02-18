import { useRef, useEffect, useState } from "react";
import useManagePiece from "./useManagePiece";
import useManageLines from "./useManageLines";
import { useSelector, useDispatch } from 'react-redux';
import { setActivePiece, setIsGameOver } from "../redux/slices/gameplaySlice";
import { gameFinalScore } from "../api/http.api";

const useModifyGrid = (width, height) => {

	const dispatch = useDispatch();
	
	const grid = useSelector((state) => state.gameplay.grid);
	const activePiece = useSelector((state) => state.gameplay.activePiece);
	const nextPiece = useSelector((state) => state.gameplay.nextPiece);
	const isGameOver = useSelector((state) => state.gameplay.isGameOver);

	const [isInContact, setIsInContact ] = useState(false);

	/* delegate piece management to specialized hook */
	const { spawnNewPiece, movePieceLeft, movePieceRight, rotatePiece, movePieceDown } 
	= useManagePiece(width, height);

	/* delegate line suppression and add unbreakble malus line when opponent player scores */
	const {clearFullLines, addUnbreakableMalusLine } = useManageLines(width, height);

	/* spawn the pieces, at launch and everytime activePiece is resetted to null */
	useEffect(() => {
		if (!activePiece && !isGameOver) {
			spawnNewPiece();
		}
	}, [activePiece, spawnNewPiece, isGameOver]);

	/* player inputs manager */
	useEffect(() => {
		const handleKeyDown = (event) => {
			switch (event.key) {
				case "ArrowUp":
					rotatePiece();
					break;
				case "ArrowLeft":
					movePieceLeft();
					break;
				case "ArrowRight": 
					movePieceRight();
					break;
				case "ArrowDown":
					movePieceDown();
					break;
				case " ": /* for the spacebar */
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		}
	}, [movePieceLeft, movePieceRight, rotatePiece, movePieceDown]);

	/* gravity manager */
	const applyGravityRef = useRef(null);

	useEffect(() => {
		applyGravityRef.current = () => {
			const pieceCanFall = movePieceDown();

			if (pieceCanFall) {
				setIsInContact(false);
			} else {
				if (isInContact) {
					clearFullLines();
					dispatch(setActivePiece(false));
				} else {
					setIsInContact(true);
				}
			}
		};
	}, [dispatch, movePieceDown, isInContact, clearFullLines]);

	useEffect(() => {
		const interval = setInterval(() => {
			applyGravityRef.current();
		}, 500);

		return () => clearInterval(interval);
	}, []);

	/* game over manager */
	useEffect(() => {
		if (isGameOver) {
			console.log('game over');
			dispatch(gameFinalScore())
			setIsGameOver(true)
			// pause the bloody game and handle the rest
		}
	}, [isGameOver]);
	
	return grid;
}

export default useModifyGrid;
