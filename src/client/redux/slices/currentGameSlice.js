import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSoloGame, SearchOrCreateMultiGame } from '../../api/http.api';

const initialState = {
	id: null,
	players: [],
	scores: {},
	error: null
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

export const searchOrCreateMultiGameThunk = createAsyncThunk(
	'currentGame/createMultiGameThunk',
	async (name, { rejectWithValue }) => {
		try {
			const response = await searchOrCreateMultiGame(name);
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const handleGameOverThunk = createAsyncThunk(
	'currentGame/handleGameOverThunk',
	async (game, { rejectWithValue }) => {
		try {
			const response = await gameFinalScore(game);
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
			console.log('problem creating solo game');
			state.error = action.payload; // check this
		})
		.addCase(searchOrCreateMultiGameThunk.fulfilled, (state, action) => {
			const gameData = action.payload.game;
			state.id = gameData._id;
			state.players = [gameData._player1, gameData._player2, gameData._player3, gameData._player4];
			state.scores = {
				[gameData._player1]: gameData._player1_score,
				[gameData._player2]: gameData._player2_score,
				[gameData._player3]: gameData._player3_score,
				[gameData._player4]: gameData._player4_score
			}
			state.error = null;
		})
		.addCase(searchOrCreateMultiGameThunk.rejected, (state, action) => {
			console.log('problem creating multi game');
			state.error = action.payload; // check this
		})
	}
});

export default currentGameSlice;
