import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connect } from "../../api/socket.api";

const initialState = {
	socket: null,
	status: 'disconnected',
	error: null
}

export const socketConnect = createAsyncThunk(
	'socket/socketConnect',
	async ({rejectWithValue}) => {
		try {
			const response = await connect();
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
		// no reducers needed, just extraReducers
	},
	extraReducers: (builder) => {
		builder
		.addCase(socketConnect.pending, (state, action) => {
			state.status = 'connecting';
            state.error = null;
		})
		.addCase(socketConnect.fulfilled, (state, action) => {
			state.socket = action.payload;
			state.status = 'connected';
			state.error = null;
		})
		.addCase(socketConnect.rejected, (state, action) => {
			state.socket = null;
			state.error = action.payload || 'failed to connect';
		})
	}
});

export default socketSlice;
