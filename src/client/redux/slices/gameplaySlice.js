import { createSlice } from '@reduxjs/toolkit'

import { updateScreenAndScore } from '../../api/socket.api'

export const EmitGridAndScore = () => (dispatch, getState) => {
	const state = getState()
	const socket = state.socket.socket
	const score = state.gameplay.score
	const grid = state.gameplay.grid

	if (socket && typeof socket.emit === 'function') {
		updateScreenAndScore(socket, grid, score)
	}
}

export const resetGameplayAndEmit = () => (dispatch, getState) => {
	console.log('resetGameplayAndEmit called')
	const state = getState()
	const socket = state.socket.socket

	const initialGrid = Array.from({ length: 20 }, () => Array(10).fill(0))
	const initialScore = 0

	if (socket && typeof socket.emit === 'function') {
		updateScreenAndScore(socket, initialGrid, initialScore)
	}

	dispatch(resetGameplayAndScore())
}

const gameplaySlice = createSlice({
	name: 'gameplay',
	initialState: {
		grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
		box: Array.from({ length: 10 }, () => Array(10).fill(0)),
		piecePosition: { x: 4, y: 0 },
		orientation: 0,
		nextOrientation: 0,
		isInContact: false,
		isGameOver: false,
		score: 0,
	},
	reducers: {
		setGrid: (state, action) => {
			state.grid = action.payload
		},
		setBox: (state, action) => {
			state.box = action.payload
		},
		resetBox: (state) => {
			state.box = Array.from({ length: 10 }, () => Array(10).fill(0))
		},
		setPiecePosition: (state, action) => {
			state.piecePosition = action.payload
		},
		setOrientation: (state, action) => {
			state.orientation = action.payload
		},
		setNextOrientation: (state, action) => {
			state.nextOrientation = action.payload
		},
		setIsInContact: (state, action) => {
			state.isInContact = action.payload
		},
		setIsGameOver: (state, action) => {
			state.isGameOver = action.payload
		},
		setScore: (state, action) => {
			state.score = action.payload
		},
		resetGameplayNotBox: (state) => {
			console.log('resetGameplayNotBox')
			state.grid = Array.from({ length: 20 }, () => Array(10).fill(0))
			state.piecePosition = { x: 4, y: 0 }
			state.orientation = 0
			state.nextOrientation = 0
			state.isInContact = false
			state.isGameOver = false
		},
		resetGameplay: (state) => {
			console.log('resetGameplay')
			state.grid = Array.from({ length: 20 }, () => Array(10).fill(0))
			state.box = Array.from({ length: 10 }, () => Array(10).fill(0))
			state.piecePosition = { x: 4, y: 0 }
			state.orientation = 0
			state.nextOrientation = 0
			state.isInContact = false
			state.isGameOver = false
		},
		resetGameplayAndScore: (state) => {
			console.log('resetGameplayAndScore')
			state.grid = Array.from({ length: 20 }, () => Array(10).fill(0))
			state.box = Array.from({ length: 10 }, () => Array(10).fill(0))
			state.piecePosition = { x: 4, y: 0 }
			state.orientation = 0
			state.nextOrientation = 0
			state.isInContact = false
			state.isGameOver = false
			state.score = 0
		},
	},
})

export const {
	setGrid,
	setBox,
	resetBox,
	setPiecePosition,
	setOrientation,
	setNextOrientation,
	setIsInContact,
	setIsGameOver,
	setRank,
	setScore,
	resetGameplay,
	resetGameplayNotBox,
	resetGameplayAndScore,
} = gameplaySlice.actions

export default gameplaySlice
