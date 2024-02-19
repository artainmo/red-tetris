import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { connect } from "../../api/http.api";

const initialState = {
	user: null,
	name: "",
	nameTooLong: false,
	nameInvalidChars: false
}

export const userConnect = createAsyncThunk(
	'auth/userConnect',
	async (name, {rejectWithValue}) => {
		if (name === "") return rejectWithValue("name cannot be empty");

		try {
			const response = await connect(name);
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setName: (state, action) => {
			state.name = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
		.addCase(userConnect.fulfilled, (state, action) => { // case success
			state.user = state.name;
			state.nameInvalidChars = false;
			state.nameTooLong = false;
		})
		.addCase(userConnect.rejected, (state, action) => { // case err
			if (action.payload === "Player's username is too long") {
				state.nameTooLong = true;
				state.nameInvalidChars = false;
			} else if (action.payload === "Player's username contains special characters") {
				state.nameTooLong = false;
				state.nameInvalidChars = true;
			}
		})
	}
});

export const { setName } = authSlice.actions;
export default authSlice;
