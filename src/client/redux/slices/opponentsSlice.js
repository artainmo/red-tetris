import { createSlice } from '@reduxjs/toolkit'

const opponentsSlice = createSlice({
	name: 'opponents',
	initialState: {
		byId: {}, // dictionary: opponentId -> { grid, score }
	},
	reducers: {
		removeOpponent: (state, action) => {
			const id = action.payload
			delete state.byId[id]
		},
		setOpponentGridAndScore: (state, action) => {
			const { id, grid, score } = action.payload
			if (!state.byId[id]) {
				state.byId[id] = {
					grid: grid ?? Array.from({ length: 20 }, () => Array(10).fill(0)),
					score: score ?? 0,
				}
			} else {
				if (grid !== undefined) state.byId[id].grid = grid
				if (score !== undefined) state.byId[id].score = score
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
