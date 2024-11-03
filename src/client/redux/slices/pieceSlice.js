import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { askNewPiece, listenNewPiece } from "../../api/socket.api";

/* objects : contains info keyed by game_id */
const initialState = {
	nextPieces: {},
	currentPieces: {},
	status: {},
	errors: {}
}

export const getNextPieceThunk = createAsyncThunk(
	'piece/getNextPiece',
	async (socket, gameId, {rejectWithValue}) => {
		try {
			askNewPiece(socket, gameId);
			const response = await listenNewPiece(socket, ); // refacto/update this

		} catch (err) {
			return rejectWithValue(err.toString()); // check this
		}
	}
);

const pieceSlice = createSlice({
	name: 'piece',
	initialState,
	reducers: {

	},
	extraReducers: (builder) => {
		builder
		.addCase(getNextPieceThunk.pending, (state, action) => {

		})
		.addCase(getNextPieceThunk.fulfilled, (state, action) => {

		})
		.addCase(getNextPieceThunk.rejected, (state, action) => {

		})
	}
});

export default pieceSlice;
