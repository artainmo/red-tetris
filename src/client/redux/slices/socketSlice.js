import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { connect } from '../../api/socket.api'

export const socketConnectThunk = createAsyncThunk(
	'socket/socketConnect',
	(token, { dispatch }) => {
		console.log('socketConnectThunk lancé')

		const socket = connect(token)

		socket.on('connect', () => {
			console.log('✅ Socket connecté:', socket.id)
			dispatch(socketConnected())
		})

		socket.on('connect_error', (err) => {
			console.error('❌ Erreur de connexion:', err.message)
			dispatch(socketConnectionFailed(err.message))
		})

		socket.on('disconnect', (reason) => {
			console.warn('⚠️ Déconnecté:', reason)
			dispatch(socketDisconnected(reason))
		})

		return socket
	}
)

const socketSlice = createSlice({
	name: 'socket',
	initialState: {
		socket: null,
		status: 'null',
		error: null,
	},
	reducers: {
		socketConnected(state) {
			state.status = 'connected'
			state.error = null
		},
		socketConnectionFailed(state, action) {
			state.status = 'disconnected'
			state.error = action.payload
		},
		socketDisconnected(state, action) {
			state.status = 'disconnected'
			state.error = action.payload || null
		},
	},
	extraReducers: (builder) => {
		builder.addCase(socketConnectThunk.fulfilled, (state, action) => {
			state.socket = action.payload
			state.status = 'connecting'
		})
	},
})

export const { socketConnected, socketConnectionFailed, socketDisconnected } =
	socketSlice.actions

export default socketSlice
