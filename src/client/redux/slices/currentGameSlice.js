import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSoloGame } from '../../api/http.api';

const initialState = {
	id: null,
	players: [],
	scores: {},
	error: null,
}

export const createSoloGameThunk = createAsyncThunk(
	'currentGame/createSoloGameThunk',
	async (name, { rejectWithValue }) => {
		try {
			const response = await createSoloGame(name);
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

const currentGameSlice = createSlice({
	name: 'currentGame',
	initialState,
	reducers: {
		// just extra reducers
	},
	extraReducers: (builder) => {
		builder
		.addCase(createSoloGameThunk.fulfilled, (state, action) => {
			const gameData = action.payload.game;

			state.id = gameData._id;
			state.players = gameData._player1;
			state.scores = {
				[gameData._player1]: gameData._player1_score,
			}
			state.error = null;
		})
		.addCase(createSoloGameThunk.rejected, (state, action) => {
			console.log('problem creating the game');
			state.error = action.payload; // check this
		})
	}
});

export default currentGameSlice;
