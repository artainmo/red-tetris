import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
	socket: null,
	nextPiece: null,
	currentPiece: null
}

export const fetchNewPiece = createAsyncThunk(
	'piece/fetchNewPiece',
	async (name, , {rejectWithValue}) => {

		try {
			const response = await connect(name);
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

const pieceSlice = createSlice(

);
