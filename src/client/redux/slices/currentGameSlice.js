import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSoloGame, getGames, searchOrCreateMultiGame } from '../../api/http.api';

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
	async (name, { rejectWithValue }) => {
		try {
			console.log("currentGamescores")
			console.log(state.scores._player1_score)
			console.log(state.scores._player1)
			scoreValues = Object.values(state.scores)
			const game = await getGames(state.id)[0]
			const response = await gameFinalScore(game, scoreValues[0], scoreValues[1], 
												scoreValues[2], scoreValues[3], scoreValues[4], scoreValues[5]);
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
		setPlayerScore: (state, action) => {
			console.log(action.payload)
			const { username, score } = action.payload;
			console.log("setting score for player " + username + " who got " + score)
			state.scores[username] = score;
		}
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
		.addCase(handleGameOverThunk.fulfilled, (state, action) => {
			console.log('updating the game in the db before game over');
			state.id = null;		// resetting to initial state
			state.players = {}
			state.scores = {}
			state.error = null;		
		})
		.addCase(handleGameOverThunk.rejected, (state, action) => {
			console.log('problem when exiting the game / game is over');
			state.error = action.payload; // check this
		})
	}
});

export const { 
	setPlayerScore
} = currentGameSlice.actions;

export default currentGameSlice;
