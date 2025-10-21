import { useEffect, useCallback } from "react";
import { TETROMINOS } from "../utils/tetrominoes";
import { PIECES_COLOR_CODES } from "../utils/piecesColorCodes";
import { PIECE_STARTING_ORIENTATIONS } from "../utils/pieceStartingOrientation";
import { WALL_KICK_OFFSETS } from "../utils/wallKickOffsets";
import useCollisionDetection from "./useCollisionDetection";
import usePieceGenerator from "./usePieceGenerator";
import { useDispatch, useSelector } from 'react-redux';
import { setActivePiece, setActivePieceType, setNextActivePiece, setNextActivePieceType, setPiecePosition } from '../redux/slices/gameplaySlice';
import { setIsGameOver, setOrientation, setNextOrientation, setGrid, setBox } from "../redux/slices/gameplaySlice";
import { handleGameOverThunk } from "../redux/slices/currentGameSlice";

const useManagePiece = (width, height) => {
	
	const dispatch = useDispatch();

	const username = useSelector((state) => state.auth.user)
	const scores = useSelector((state) => state.currentGame.scores)
	const grid = useSelector((state) => state.gameplay.grid);
	const activePiece = useSelector((state) => state.gameplay.activePiece);
	const activePieceType = useSelector((state) => state.gameplay.activePieceType);
	const nextActivePiece = useSelector((state) => state.gameplay.nextActivePiece);
	const nextActivePieceType = useSelector((state) => state.gameplay.nextActivePieceType);
	const piecePosition = useSelector((state) => state.gameplay.piecePosition);
	const orientation = useSelector((state) => state.gameplay.orientation);
	const nextPiecePosition = { x: 4, y: 4 };
	const nextOrientation = useSelector((state) => state.gameplay.nextOrientation);;
	const isGameOver = useSelector((state) => state.gameplay.isGameOver);

	const { canMoveDown, canMoveRight, canMoveLeft, canRotate, canWallRotate } = useCollisionDetection(width, height, grid);
	const getNextPiece = usePieceGenerator();

	/* check whether the piece can indeed be inserted */
	const isPieceInsertable = async(piece, x, y, orientation) => {
		const shapeCoords = piece[orientation];
		const gameOver =  shapeCoords.some(([relY, relX]) => {
			const newY = y + relY;
			const newX = x + relX;
			return grid[newY] && grid[newY][newX] !== 0;
		});

		if (gameOver && !isGameOver) {
			console.log("dispatching game over")
			const score = scores[username];
			console.log(score)
			dispatch(handleGameOverThunk({user: username, score: score}))
			dispatch(setIsGameOver(true))
			return false;
		}
		return true;
	}

	/* spawn an new piece */
	const spawnNewPiece = (both) => {
		if (isGameOver)
			return ;
		if (both) {
			const pieceLetterCode = getNextPiece();
			const nextPieceLetterCode = getNextPiece();
			const piece = TETROMINOS[pieceLetterCode];
			const nextPiece = TETROMINOS[nextPieceLetterCode];
	
			if (!piece) {
				console.error('Unknown piece type: ', pieceLetterCode);
				return;
			}
	
			const initialX = Math.floor(width / 2) - Math.floor(TETROMINOS[pieceLetterCode][0].length / 2);
			const initialY = 0;
	
			if (!isPieceInsertable(piece, initialX,initialY, PIECE_STARTING_ORIENTATIONS[pieceLetterCode])) {
				return; 
			}

			dispatch(setPiecePosition({x: initialX, y: initialY}));
			dispatch(setActivePiece(piece));
			dispatch(setActivePieceType(pieceLetterCode));
			dispatch(setNextActivePiece(nextPiece));
			dispatch(setNextActivePieceType(nextPieceLetterCode));
			dispatch(setOrientation(PIECE_STARTING_ORIENTATIONS[pieceLetterCode]));
			dispatch(setNextOrientation(PIECE_STARTING_ORIENTATIONS[nextPieceLetterCode]));
		}
		else {
			const pieceLetterCode = getNextPiece();
			const piece = TETROMINOS[pieceLetterCode];
	
			if (!piece) {
				console.error('Unknown piece type: ', pieceLetterCode);
				return;
			}
	
			const initialX = Math.floor(width / 2) - Math.floor(TETROMINOS[pieceLetterCode][0].length / 2);
			const initialY = 0;

			if (!isPieceInsertable(piece, initialX,initialY, PIECE_STARTING_ORIENTATIONS[pieceLetterCode])) {
				return; 
			}

			dispatch(setPiecePosition({x: initialX, y: initialY}));
			dispatch(setActivePiece(nextActivePiece));
			dispatch(setActivePieceType(nextActivePieceType));
			dispatch(setNextActivePiece(piece));
			dispatch(setNextActivePieceType(pieceLetterCode));
			dispatch(setOrientation(nextOrientation));
			dispatch(setNextOrientation(PIECE_STARTING_ORIENTATIONS[pieceLetterCode]));
		}
	}

	/* general updater for the grid when there is a move */
	const updateGridWithPiece = (shapeCoords, x, y, colorCode) => {
		
		if (!shapeCoords) return;

		const newGrid = grid.map((row) => [...row]);

		shapeCoords.forEach(([relY, relX]) => {
			const newY = y + relY;
			const newX = x + relX;
			newGrid[newY][newX] = colorCode;
		});

		dispatch(setGrid(newGrid));
	};

	const updateUpcomingPieceBox = (boxCoords, x, y, colorCode) => {

		if (!boxCoords) return;

		const newBox = Array.from({ length: 10 }, () => Array(10).fill(0));

		boxCoords.forEach(([relY, relX]) => {
			const newY = y + relY;
			const newX = x + relX;
			newBox[newY][newX] = colorCode;
		});

		dispatch(setBox(newBox));
	};

	/* used to removed the piece when producing a move, to later display the piece in new position */
	const removePiece = useCallback(() => {
		const newGrid = grid.map((row) => [...row]);

		if (activePiece) {
			activePiece[orientation].forEach(([relY, relX]) => {
				const oldY = piecePosition.y + relY;
				const oldX = piecePosition.x + relX;
				newGrid[oldY][oldX] = 0;
			})	
		}
		dispatch(setGrid(newGrid));
	}, [dispatch, activePiece, grid, orientation, piecePosition]);

	/* Rotations managers */
	const rotatePieceWithWallKick = (newOrientation) => {
		let places = [0, 1, -1];
		if (activePieceType == 'I') {
			places = [0, 1, -1, 2, -2];
		}
		for (let i of places) {
			if (canWallRotate(activePiece, piecePosition.x, piecePosition.y, orientation, newOrientation, i)) {
				removePiece();
				dispatch(setPiecePosition({ x: piecePosition.x + i, y: piecePosition.y}));
				dispatch(setOrientation(newOrientation));
				return;
			}
		};
		console.log('no rotation possible');
	};

	const rotatePiece = useCallback(() => {
		if (activePiece) {
			const newOrientation = (orientation + 90) % 360;
		  	if (canRotate(activePiece, piecePosition.x, piecePosition.y, orientation, newOrientation)) {
				removePiece();
				dispatch(setOrientation(newOrientation));
		  	} else {
				rotatePieceWithWallKick(newOrientation);
			}
		}
	}, [activePiece, piecePosition, orientation, canRotate, removePiece, dispatch]);

	const movePieceRight = useCallback(() => {
		if (!activePiece || !canMoveRight(activePiece, piecePosition.x, piecePosition.y, orientation)) {
			return;
		}
		removePiece();
		dispatch(setPiecePosition({ x: piecePosition.x + 1, y: piecePosition.y }));
	}, [dispatch, activePiece, piecePosition, orientation, canMoveRight, removePiece]);

	const movePieceLeft = useCallback (() => {
		if (!activePiece || !canMoveLeft(activePiece, piecePosition.x, piecePosition.y, orientation)) {
			return;
		}
		removePiece();
		dispatch(setPiecePosition({ x: piecePosition.x - 1, y: piecePosition.y }));
	}, [dispatch, activePiece, piecePosition, orientation, canMoveLeft, removePiece]);

	const movePieceDown = () => {	
		if (!activePiece || !canMoveDown(activePiece, piecePosition.x, piecePosition.y, orientation)) {
			return false;
		}
		removePiece();
		dispatch(setPiecePosition({ x: piecePosition.x, y: piecePosition.y + 1 }));
		return true;
	}

	const dropPiece = () => {
		if (!activePiece) {
			return;
		}
		let dropY = piecePosition.y;
		while (canMoveDown(activePiece, piecePosition.x, dropY, orientation)) {
			dropY += 1;
		}
		removePiece();
		dispatch(setPiecePosition({ x: piecePosition.x, y: dropY }));
	};

	/* update grid when a parameter changes */
	useEffect(() => {

		if (activePiece && activePieceType && piecePosition && orientation !== null) {
			updateGridWithPiece(
				activePiece[orientation],
				piecePosition.x,
				piecePosition.y,
				PIECES_COLOR_CODES[activePieceType]
			);
		}		
	}, [activePiece, activePieceType, piecePosition, orientation]);

	useEffect(() => {

		if (nextActivePiece && nextActivePieceType) {
			updateUpcomingPieceBox(
				nextActivePiece[nextOrientation],
				nextPiecePosition.x,
				nextPiecePosition.y,
				PIECES_COLOR_CODES[nextActivePieceType]
			);
		}		
	}, [nextActivePiece, nextActivePieceType]);

	return { spawnNewPiece, rotatePiece, movePieceRight, movePieceLeft, movePieceDown, dropPiece };
}

export default useManagePiece;
