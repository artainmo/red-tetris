import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { connect } from "../../api/http.api";

const initialState = {
	isAuthenticated: false,
	user: null,
	nameTooLong: false,
	nameInvalidChars: false,
	nameEmpty: false
}

export const userConnect = createAsyncThunk(
	'auth/userConnect',
	async (name, {rejectWithValue}) => {
		if (name === "") return rejectWithValue("Name cannot be empty");

		try {
			const response = await connect(name);
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// no need for reducers there, all is handled asynchronously by extraReducers
	},
	extraReducers: (builder) => {
		builder
		.addCase(userConnect.fulfilled, (state, action) => {
			state.user = action.payload.data.username;
			state.nameInvalidChars = false;
			state.nameTooLong = false;
			state.nameEmpty = false;
			state.isAuthenticated = true;
		})
		.addCase(userConnect.rejected, (state, action) => {
			if (action.payload === "Player's username is too long") {
				state.nameTooLong = true;
				state.nameInvalidChars = false;
				state.nameEmpty = false;
			} else if (action.payload === "Player's username contains special characters") {
				state.nameTooLong = false;
				state.nameInvalidChars = true;
				state.nameEmpty = false;
			} else if (action.payload === "Name cannot be empty") {
				state.nameTooLong = false;
				state.nameInvalidChars = false;
				state.nameEmpty = true;
			}
		})
	}
});

export default authSlice;
