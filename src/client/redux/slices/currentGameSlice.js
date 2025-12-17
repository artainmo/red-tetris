import { createSlice } from '@reduxjs/toolkit'

const currentGameSlice = createSlice({
	name: 'currentGame',
	initialState: {
		id: null,
		players: [],
		scores: {},
		error: null,
		multi: false,
		waitingForPlayersToJoin: false,
		playersJoinedTheGame: false,
		roomName: '',
	},
	reducers: {
		setGame: (state, action) => {
			const game = action.payload
			state.id = game._id
			state.players.push(game._player1)
		},
		setWaitingForPlayersToJoin: (state, action) => {
			state.waitingForPlayersToJoin = action.payload
		},
		setPlayersJoinedTheGame: (state, action) => {
			state.playersJoinedTheGame = action.payload
		},
		setPlayers(state, action) {
			console.log('THUNK NEW PLAYER JOINED')
			state.players.push(action.payload)
		},
		setPlayerScore: (state, action) => {
			const { username, score } = action.payload
			console.log('setting score for player ' + username + ' who got ' + score)
			state.scores[username] = score
		},
		resetGame: (state) => {
			state.id = null
			state.players = []
			state.scores = {}
			state.error = null
			state.multi = false
			state.roomName = ''
			state.playersJoinedTheGame = false
		},
	},
})

export const {
	setGame,
	setPlayers,
	setWaitingForPlayersToJoin,
	setPlayerScore,
	setPlayersJoinedTheGame,
	resetGame,
} = currentGameSlice.actions

export default currentGameSlice
