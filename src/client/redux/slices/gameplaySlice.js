import { createSlice } from "@reduxjs/toolkit";

const gameplaySlice = createSlice({
	name: 'gameplay',
	initialState: {
		grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
		box: Array.from({ length: 10 }, () => Array(10).fill(0)),				// upcoming piece display box
		activePiece: null, /* js object containing pieces coords for every orientation */
		activePieceType: null, /* letter of the piece */
		nextActivePiece: null, /* js object containing pieces coords for every orientation */
		nextActivePieceType: null, /* letter of the piece */
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
		setBox: (state, action) => {
			state.box = action.payload;
		},
		resetBox: (state) => {
			state.box = Array.from({ length: 5 }, () => Array(5).fill(0));
		},
		setActivePiece: (state, action) => {
			state.activePiece = action.payload;
		},
		setActivePieceType: (state, action) => {			
			state.activePieceType = action.payload;
		},
		setNextActivePiece: (state, action) => {
			state.nextActivePiece = action.payload;
		},
		setNextActivePieceType: (state, action) => {			
			state.nextActivePieceType = action.payload;
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
	setBox,
	resetBox,
	setActivePiece, 
	setActivePieceType,
	setNextActivePiece, 
	setNextActivePieceType,
	setPiecePosition, 
	setOrientation,
	setIsInContact,
	setIsGameOver,
	setRank,
	setScore,
} = gameplaySlice.actions;

export default gameplaySlice;
