import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { joinRoom, leaveRoom } from '../../api/socket.api'

export const joinRoomThunk = createAsyncThunk(
	'socket/joinRoomThunk',
	({ username, userSocket, roomName }, { rejectWithValue }) => {
		try {
			console.log('joinRoomThunk ', roomName)
			const response = joinRoom(username, userSocket, roomName)
			return response
		} catch (err) {
			console.error('Error joinRoom:', err)
			return rejectWithValue(
				err.message || 'Unknown error occurred while joining room'
			)
		}
	}
)

export const leaveRoomThunk = createAsyncThunk(
	'socket/leaveRoomThunk',
	({ username, userSocket, roomName }, { rejectWithValue }) => {
		try {
			console.log('leaveRoomThunk ', roomName)
			const response = leaveRoom(username, userSocket, roomName)
			return response
		} catch (err) {
			console.error('Error leaveRoom:', err)
			return rejectWithValue(
				err.message || 'Unknown error occurred while leaving room'
			)
		}
	}
)

const roomSlice = createSlice({
	name: 'roomSlice',
	initialState: {
		id: null,
		players: [],
		gameStarted: false,
		host: null,
		error: null,
	},
	reducers: {
		setPlayers(state, action) {
			state.players = action.payload
		},
		setRoomId(state, action) {
			state.id = action.payload
		},
		playerJoined(state, action) {
			const p = action.payload
			state.players.push(p)
			state.players = state.players
		},
		playerLeft(state, action) {
			state.players = state.players.filter((p) => p !== action.payload)
		},
		gameStarted(state) {
			state.gameStarted = true
		},
		setNewHost(state, action) {
			state.host = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(joinRoomThunk.fulfilled, (state, action) => {
				console.log('✅ Player joined the room')
				console.log(action.payload)
				state.error = null
				state.id = action.payload.game.id
				state.players = action.payload.game.players
				state.host = action.payload.game.host
			})
			.addCase(joinRoomThunk.rejected, (state, action) => {
				console.log('❌ Error: player could not join the room')
				console.error(action.payload)
				state.error = action.payload
			})
	},
})

export const {
	setPlayers,
	setRoomId,
	playerLeft,
	playerJoined,
	gameStarted,
	setNewHost,
} = roomSlice.actions
export default roomSlice
