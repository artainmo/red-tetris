import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// update the logic when understanding backend functionning
export const fetchGameId = createAsyncThunk(
	'game/fetchGameId',
	async (gameCriterion, {rejectWithValue}) => {
		try {
			const response = await fetchGameSessionId(gameCriterion); // update this, template
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

// export const 

const gameSessionsSlice = createSlice({
	name: 'game',
	initialState : {
		currentGameId: null,
		status: 'idle',
		error: null
	},
	reducers: {
		displayGameSliceState(state) {
			if (state.currentGameId) {
				console.log(`game id = ${state.currentGameId}`);
			}
			console.log(`game status : ${state.status}`);
		}
	},
	extraReducers: (builder) => {
		builder
		.addCase(fetchGameId.pending, (state) => {
			state.status = 'loading';
		})
		.addCase(fetchGameId.fulfilled, (state, action) => {
			state.status = 'succeeded';
		})
		.addCase(fetchGameId.rejected, (state, action) => {
			state.status = 'failed';
			state.error = action.payload;
		})
	}
});

export const { displayGameSliceState } = gameSessionsSlice.actions; // reducers here

export default gameSessionsSlice;
