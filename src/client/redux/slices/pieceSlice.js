import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


/* objects : contains info keyed by game_id */
const initialState = {
	nextPieces: {},
	currentPieces: {},
	status: {},
	error: {}
}

export const getNextPiece = createAsyncThunk(
	'piece/getNextPiece',
	async (sessionId, {rejectWithValue}) => {
		try {
			const response = await getNextPiece(sessionId); // check if that exists
			return response;
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
		.addCase()
		.addCase()
		.addCase()
	}
});

export default pieceSlice;
