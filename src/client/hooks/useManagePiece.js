import { useEffect, useCallback } from "react";
import { TETROMINOS } from "../utils/tetrominoes";
import { PIECES_COLOR_CODES } from "../utils/piecesColorCodes";
import { PIECE_STARTING_ORIENTATIONS } from "../utils/pieceStartingOrientation";
import { WALL_KICK_OFFSETS } from "../utils/wallKickOffsets";
import useCollisionDetection from "./useCollisionDetection";
import usePieceGenerator from "./usePieceGenerator";
import { useDispatch, useSelector } from 'react-redux';
import { setActivePiece, setActivePieceType, setNextActivePiece, setNextActivePieceType, setPiecePosition } from '../redux/slices/gameplaySlice';
import { setIsGameOver, setOrientation, setGrid, setBox } from "../redux/slices/gameplaySlice";
import { handleGameOverThunk, setPlayerScore } from "../redux/slices/currentGameSlice";

const useManagePiece = (width, height) => {
	
	const dispatch = useDispatch();

	const grid = useSelector((state) => state.gameplay.grid);
	const box = useSelector((state) => state.gameplay.box);
	const activePiece = useSelector((state) => state.gameplay.activePiece);
	const activePieceType = useSelector((state) => state.gameplay.activePieceType);
	const nextActivePiece = useSelector((state) => state.gameplay.nextActivePiece);
	const nextActivePieceType = useSelector((state) => state.gameplay.nextActivePieceType);
	const piecePosition = useSelector((state) => state.gameplay.piecePosition);
	const orientation = useSelector((state) => state.gameplay.orientation);
	const nextPiecePosition = { x: 0, y: 0 };
	const nextOrientation = [[0,0],[1,0],[1,1],[2,0]];
	const isGameOver = useSelector((state) => state.gameplay.isGameOver);

	const { canMoveDown, canMoveRight, canMoveLeft, canRotate } = useCollisionDetection(width, height, grid);
	const getNextPiece = usePieceGenerator();

	/* check whether the piece can indeed be inserted */
	const isPieceInsertable = (piece, x, y, orientation) => {
		const shapeCoords = piece[orientation];
		const gameOver =  shapeCoords.some(([relY, relX]) => {
			const newY = y + relY;
			const newX = x + relX;
			return grid[newY] && grid[newY][newX] !== 0;
		});

		if (gameOver && !isGameOver) {
			console.log("dispatching game over")
			dispatch(setIsGameOver(true));
			return false;
		}
		return true;
	}

	/* spawn an new piece */
	const spawnNewPiece = (both) => {
		if (isGameOver)
			return ;
		const { piece: pieceLetterCode, nextPiece: nextPieceLetterCode } = getNextPiece();
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
		
		if (both) {
			dispatch(setPiecePosition({x: initialX, y: initialY}));
			dispatch(setActivePiece(piece));
			dispatch(setActivePieceType(pieceLetterCode));
			dispatch(setNextActivePiece(nextPiece));
			dispatch(setNextActivePieceType(nextPieceLetterCode));
			dispatch(setOrientation(PIECE_STARTING_ORIENTATIONS[pieceLetterCode]));
		}
		else {
			dispatch(setPiecePosition({x: initialX, y: initialY}));
			dispatch(setActivePiece(nextActivePiece));
			dispatch(setActivePieceType(nextActivePieceType));
			dispatch(setNextActivePiece(piece));
			dispatch(setNextActivePieceType(pieceLetterCode));
			dispatch(setOrientation(PIECE_STARTING_ORIENTATIONS[pieceLetterCode]));
		}
	}

	/* general updater for the grid when there is a move */
	const updateGridWithPiece = (shapeCoords, x, y, colorCode) => {
		
		if (!shapeCoords) return;
		console.log("shape coords")
		console.log(shapeCoords)
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
		console.log("box coords")
		console.log(boxCoords)
		const newBox = box.map((row) => [...row]);

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
		const currentOrientation = orientation;
		const offsets = WALL_KICK_OFFSETS[activePieceType][currentOrientation];

		console.log('offset X = ', offsets[0], ' and offset Y = ', offsets[1]);

		for (const [offsetX, offsetY] of offsets) {
			const newX = piecePosition.x + offsetX;
        	const newY = piecePosition.y + offsetY;

			if (canRotate(activePiece, newX, newY, orientation, newOrientation)) {
				removePiece();
				dispatch(setPiecePosition({ x: newX, y: newY }));
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

	/* update grid when a parameter changes */
	useEffect(() => {
		// console.log("active")
		// console.log(activePieceType)
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
		console.log("next")
		console.log(nextActivePieceType)
		if (nextActivePiece && nextActivePieceType) {
			console.log("updating box")
			updateUpcomingPieceBox(
				nextActivePiece[nextOrientation],
				nextPiecePosition.x,
				nextPiecePosition.y,
				PIECES_COLOR_CODES[nextActivePieceType]
			);
		}		
	}, [nextActivePiece, nextActivePieceType]);

	return { spawnNewPiece, rotatePiece, movePieceRight, movePieceLeft, movePieceDown };
}

export default useManagePiece;
