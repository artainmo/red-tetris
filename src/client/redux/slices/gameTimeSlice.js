import { createSlice } from '@reduxjs/toolkit'

const gameTimeSlice = createSlice({
	name: 'gameTime',
	initialState: {
		startTime: null,
		endTime: null,
		currentTime: 0,
		totalBreakTime: 0,
		currentBreakTime: 0,
		isGameActive: false,
		isGamePaused: false,
	},
	reducers: {
		startGame(state) {
			state.startTime = Date.now()
			state.isGameActive = true
			state.endTime = null
			state.currentTime = 0
			state.totalBreakTime = 0
			state.currentBreakTime = 0
			state.isGamePaused = false
		},
		endGame(state) {
			state.endTime = Date.now()
			state.isGameActive = false
			state.currentTime = state.endTime - state.startTime - state.totalBreakTime
		},
		updateGameTime(state) {
			if (state.isGameActive && !state.isGamePaused) {
				state.currentTime = Date.now() - state.startTime - state.totalBreakTime
			}
		},
		pauseGame(state) {
			if (!state.isGamePaused) {
				state.isGamePaused = true
				state.currentBreakTime = Date.now()
			}
		},
		resumeGame(state) {
			if (state.isGamePaused) {
				state.isGamePaused = false
				state.currentBreakTime = Date.now() - state.currentBreakTime
				state.totalBreakTime += state.currentBreakTime
				state.currentBreakTime = 0
			}
		},
	},
})

export const { startGame, endGame, updateGameTime, pauseGame, resumeGame } =
	gameTimeSlice.actions

export default gameTimeSlice
