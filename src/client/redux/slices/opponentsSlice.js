import { createSlice } from '@reduxjs/toolkit'

const opponentsSlice = createSlice({
	name: 'opponents',
	initialState: {
		byId: {},
	},
	reducers: {
		removeOpponent: (state, action) => {
			const id = action.payload
			delete state.byId[id]
		},
		setOpponentGridAndScore: (state, action) => {
			const { id, grid, score, isGameOver } = action.payload
			if (!state.byId[id]) {
				state.byId[id] = {
					grid: grid ?? Array.from({ length: 20 }, () => Array(10).fill(0)),
					score: score ?? 0,
					isGameOver: isGameOver ?? false,
				}
			} else {
				if (grid !== undefined) {
					state.byId[id].grid = grid
				}
				if (score !== undefined) {
					state.byId[id].score = score
				}
				if (isGameOver !== undefined) {
					state.byId[id].isGameOver = isGameOver
				}
			}
		},
		resetAllOpponents: (state) => {
			state.byId = {}
		},
	},
})

export const { removeOpponent, setOpponentGridAndScore, resetAllOpponents } =
	opponentsSlice.actions

export default opponentsSlice
