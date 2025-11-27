import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSoloGame, createMultiGame, joinMultiGame, gameFinalScore } from '../../api/http.api';


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

const currentGameSlice = createSlice({
	name: 'currentGame',
	initialState : {
		id: null,
		players: [],
		scores: {},
		error: null,
		multi: false,
		waitingForPlayersToJoin: false,
		playersJoinedTheGame: false,
		roomName: ""
	},
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
		setPlayers(state,action)
		{
			console.log("THUNK NEW PLAYER JOINED")
			state.players.push(action.payload);
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
			state.playersJoinedTheGame = false
		}
	},
	extraReducers: (builder) => {
		builder
		.addCase(createSoloGameThunk.fulfilled, (state, action) => {
			const gameData = action.payload.game;
			console.log("fulfilled")
			state.id = gameData.id;
			state.players.push(gameData.host);
			state.error = null;
			state.roomName = gameData.id;
		})
		.addCase(createSoloGameThunk.rejected, (state, action) => {
			console.log('problem creating solo game');
			state.error = action.payload; // check this
		})
	}
});

export const { 
	setGame,
	setPlayers,
	setWaitingForPlayersToJoin,
	setPlayerScore,
	setPlayersJoinedTheGame,
	resetGame
} = currentGameSlice.actions;

export default currentGameSlice;
