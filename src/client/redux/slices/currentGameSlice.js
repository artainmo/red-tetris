import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSoloGame, getGames, searchOrCreateMultiGame, gameFinalScore } from '../../api/http.api';

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
			console.log("createGameThunk")
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
	async (arg, { getState, rejectWithValue }) => {
		try {
			console.log("handleGameOverThunk")
			const game = getState().currentGame;
			console.log(game)
			//console.log(game._player1_scorescore[player.username])
			const response = await gameFinalScore(game.id, "qq", 30);
			return response;
		} catch (err) {
			console.error('Error in handleGameOverThunk:', err);
		// Check if the error has a response property
		if (err.response && err.response.data) {
			return rejectWithValue(err.response.data);
		} else {
			// If not, use the error message as the payload
			return rejectWithValue({ message: err.message });
		}
	}
	}
);

const currentGameSlice = createSlice({
	name: 'currentGame',
	initialState,
	reducers: {
		setGame: (state,action) => {
			const game = action.payload ;
			state.id = game._id;
			state.players.push(game._player);
		},
		setPlayerScore: (state, action) => {
			console.log(state.id)
			console.log(action.payload)
			const { username, score } = action.payload;
			console.log("setting score for player " + username + " who got " + score)
			state.scores[username] = score;
		},
		resetGame: (state, action) => {
			state.id = null;		// resetting to initial state
			state.players = []
			state.scores = {}
			state.error = null;		
		}
	},
	extraReducers: (builder) => {
		builder
		.addCase(createSoloGameThunk.fulfilled, (state, action) => {
			const gameData = action.payload.game;
			console.log("fulfilled")
			state.id = gameData._id;
			state.players.push(gameData._player1);
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
		})
		.addCase(handleGameOverThunk.rejected, (state, action) => {
			console.log('problem when exiting the game / game is over');
			state.error = action.payload; // check this
		})
	}
});

export const { 
	setGame,
	setPlayerScore,
	resetGame
} = currentGameSlice.actions;

export default currentGameSlice;
