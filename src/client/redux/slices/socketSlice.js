import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connect, disconnect, joinRoom } from "../../api/socket.api";

const initialState = {
	socket: null,
	status: 'disconnected',
	error: null
}

export const socketConnectThunk = createAsyncThunk(
	'socket/socketConnect',
	async (_, {rejectWithValue}) => {
		try {
			const socket = await connect();
			const response = await new Promise((resolve, reject) => {
				console.log("promise")
				console.log(resolve(data))
				});
			return socket;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const joinRoomThunk = createAsyncThunk(
	'currentGame/joinMultiGameThunk',
	async ({roomName, userSocket}, { rejectWithValue }) => {
		try {
			
			console.log("joinRoomSocketThunk")
			console.log(roomName)
			console.log(userSocket)
			joinRoom(userSocket, roomName)
			const response = await new Promise((resolve, reject) => {
				console.log("promise")
				socket.on("newPlayerJoined", (data) => {
					console.log(data)
				});
			});
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		manualDisconnect(state) {
			if (state.socket) {
				disconnect(state.socket);
				state.socket = null;
				state.status = 'disconnected';
			}
		},
		displaySocketState(state) {
			if (state.socket && state.status === 'connected') {
				console.log('socket is connected');
			} else {
				console.log('socket is disconnected');
			}
		}
	},
	extraReducers: (builder) => {
		builder
		.addCase(socketConnectThunk.pending, (state) => {
			state.status = 'connecting';
		})
		.addCase(socketConnectThunk.fulfilled, (state, action) => {
			state.socket = action.payload;
			state.status = 'connected';
			state.error = null;
		})
		.addCase(socketConnectThunk.rejected, (state, action) => {
			state.socket = null;
			state.status = 'disconnected';
			state.error = action.payload;
		})
		.addCase(joinRoomThunk.fulfilled, (state, action) => {
			console.log("player joined the room")
			state.error = null;
		})
		.addCase(joinRoomThunk.rejected, (state, action) => {
			console.log("error: player could not join the room")
			state.error = action.payload;
		})
	}
});

export const { manualDisconnect, displaySocketState } = socketSlice.actions;

export default socketSlice;
