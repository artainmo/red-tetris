import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSoloGame, createMultiGame, joinMultiGame, gameFinalScore } from '../../api/http.api';

const initialState = {
	id: null,
	players: [],
	scores: {},
	error: null,
	multi: false,
	waitingForPlayersToJoin: false,
	playersJoinedTheGame: false,
	roomName: ""
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

export const createMultiGameThunk = createAsyncThunk(
	'currentGame/createMultiGameThunk',
	async (name, { rejectWithValue }) => {
		try {
			const response = await createMultiGame(name);
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const joinMultiGameThunk = createAsyncThunk(
	'currentGame/joinMultiGameThunk',
	async ({id, username, socket}, { rejectWithValue }) => {
		try {
			console.log("joinMultiGameThunk")
			console.log(id)
			console.log(username)
			const response = await joinMultiGame(id, username, socket);
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const handleGameOverThunk = createAsyncThunk(
	'currentGame/handleGameOverThunk',
	async ({user, score}, { getState, rejectWithValue }) => {
		try {
			console.log("handleGameOverThunk")
			console.log(user)
			console.log(score)
			const game = getState().currentGame;
			const response = await gameFinalScore(game.id, user, score);
			return response;
		} catch (err) {
			console.error('Error in handleGameOverThunk:', err);
			return rejectWithValue(err.response.data);
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
			state.players.push(game._player1);
		},
		setWaitingForPlayersToJoin: (state,action) => {
			state.waitingForPlayersToJoin = action.payload ;
		},
		setPlayersJoinedTheGame: (state,action) => {
			state.playersJoinedTheGame = action.payload ;
		},
		setPlayerScore: (state, action) => {
			const { username, score } = action.payload;
			console.log("setting score for player " + username + " who got " + score)
			state.scores[username] = score;
		},
		resetGame: (state, action) => {
			state.id = null;		// resetting to initial state
			state.players = []
			state.scores = {}
			state.error = null		
			state.multi = false
			state.roomName = ""
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
			state.roomName = gameData._id;
		})
		.addCase(createSoloGameThunk.rejected, (state, action) => {
			console.log('problem creating solo game');
			state.error = action.payload; // check this
		})
		.addCase(createMultiGameThunk.fulfilled, (state, action) => {
			const game = action.payload.game;
			console.log("succesfully created multi game!")
			console.log("gameData")
			console.log(game)
			state.id = game.id;
			state.multi = true;
			state.waitingForPlayersToJoin = true;
			state.players.push(game.player1)
			state.error = null;
			state.roomName = game.id;
		})
		.addCase(createMultiGameThunk.rejected, (state, action) => {
			console.log('problem creating multi game');
			state.error = action.payload; // check this
		})
		.addCase(joinMultiGameThunk.fulfilled, (state, action) => {
			const game = state.payload // <-- to check
			state.playersJoinedTheGame = true;
			state.waitingForPlayersToJoin = false;
			state.players = [game._player1, game._player2, game._player3, game._player4].filter((p) => p != undefined && p != null);
			state.error = null;
			console.log('succesfully joined multi game!');
		})
		.addCase(joinMultiGameThunk.rejected, (state, action) => {
			console.log('problem joining multi game');
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
	setWaitingForPlayersToJoin,
	setPlayerScore,
	setPlayersJoinedTheGame,
	resetGame
} = currentGameSlice.actions;

export default currentGameSlice;
