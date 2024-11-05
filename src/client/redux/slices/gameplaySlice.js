import { createSlice } from "@reduxjs/toolkit";

const gameplaySlice = createSlice({
	name: 'gameplay',
	initialState: {
		grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
		activePiece: null, /* js object containing pieces coords for every orientation */
		activePieceType: null, /* letter of the piece */
		piecePosition: { x: 0, y: 0 },
		orientation: 0,
		isInContact: false,
		isGameOver: false,
		rank: 0,
		score: 0,
	},
	reducers: {
		setGrid: (state, action) => {
			state.grid = action.payload;
		},
		resetGrid: (state) => {
			state.grid = Array.from({ length: 20 }, () => Array(10).fill(0));
		},
		setActivePiece: (state, action) => {
			state.activePiece = action.payload;
		},
		setActivePieceType: (state, action) => {			
			state.activePieceType = action.payload;
		},
		setPiecePosition: (state, action) => {
			state.piecePosition = action.payload;
		},
		setOrientation: (state, action) => {
			state.orientation = action.payload;
		},
		setIsInContact: (state, action) => {
			state.isInContact = action.payload;
		},
		setIsGameOver: (state, action) => {
			state.isGameOver = action.payload;
		},
		setRank: (state, action) => {
			state.rank = action.payload;
		},
		setScore: (state,action) => {
			state.score = action.payload;
		},
	}
})

export const { 
	setGrid,
	resetGrid,
	setActivePiece, 
	setActivePieceType,
	setPiecePosition, 
	setOrientation,
	setIsInContact,
	setIsGameOver,
	setRank,
	setScore,
} = gameplaySlice.actions;
export default gameplaySlice.reducer;
