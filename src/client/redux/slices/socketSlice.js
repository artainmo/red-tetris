import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connect, disconnect } from "../../api/socket.api";

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
			return socket;
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
	}
});

export const { manualDisconnect, displaySocketState } = socketSlice.actions;

export default socketSlice;
