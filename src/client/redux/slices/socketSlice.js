import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connect, disconnect, joinRoom } from "../../api/socket.api";

const initialState = {
	socket: null,
	status: 'disconnected',
	error: null
}

export const socketConnectThunk = createAsyncThunk(
	"socket/socketConnect",
	(token, { dispatch }) => {
		console.log("socketConnectThunk lancé");

		const socket = connect(token);

		socket.on("connect", () => {
			console.log("✅ Socket connecté:", socket.id);
			dispatch(socketConnected());
		});

		socket.on("connect_error", (err) => {
			console.error("❌ Erreur de connexion:", err.message);
			dispatch(socketConnectionFailed(err.message));
		});

		socket.on("disconnect", (reason) => {
			console.warn("⚠️ Déconnecté:", reason);
			dispatch(socketDisconnected(reason));
		});

		return socket;
	}
);

export const joinRoomThunk = createAsyncThunk(
	'socket/joinRoomThunk',
	({ username, userSocket, roomName }, { rejectWithValue }) => {
		try {
			console.log("joinRoomThunk ", roomName);
			const response = joinRoom(username, userSocket, roomName);
			return response;
		} catch (err) {
			console.error("Error joinRoom:", err);
			return rejectWithValue(err.message || "Unknown error occurred while joining room");
		}
	}
);

const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		socketConnected(state) {
			state.status = "connected";
			state.error = null;
		},
		socketConnectionFailed(state, action) {
			state.status = "disconnected";
			state.error = action.payload;
		},
		socketDisconnected(state, action) {
			state.status = "disconnected";
			state.error = action.payload || null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(socketConnectThunk.fulfilled, (state, action) => {
				state.socket = action.payload;
				state.status = "connecting"; // tentative de connexion en cours
			})
			.addCase(joinRoomThunk.fulfilled, (state, action) => {
				console.log("✅ Player joined the room");
				state.error = null;
			})
			.addCase(joinRoomThunk.rejected, (state, action) => {
				console.log("❌ Error: player could not join the room");
				state.error = action.payload;
			});
	},
});

export const {
	socketConnected,
	socketConnectionFailed,
	socketDisconnected,
} = socketSlice.actions;

export default socketSlice;