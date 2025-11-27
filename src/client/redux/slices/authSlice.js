import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { connect } from '../../api/http.api'

const initialState = {
	isAuthenticated: false,
	user: null,
	id: null,
	nameTooLong: false,
	nameInvalidChars: false,
}

export const userConnect = createAsyncThunk(
	'auth/userConnect',
	async (name, { rejectWithValue }) => {
		try {
			const response = await connect(name)

			if (response.status === 200) {
				return response.data
			} else {
				return rejectWithValue(response.data)
			}
		} catch (err) {
			if (err.response && err.response.data) {
				return rejectWithValue(err.response.data)
			} else {
				return rejectWithValue({ message: 'unknown error happened' })
			}
		}
	}
)

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(userConnect.fulfilled, (state, action) => {
				state.user = action.payload.username
				state.nameInvalidChars = false
				state.nameTooLong = false
				state.isAuthenticated = true
			})
			.addCase(userConnect.rejected, (state, action) => {
				console.log(action.payload)
				if (action.payload === "Player's username is too long") {
					state.nameTooLong = true
					state.nameInvalidChars = false
				} else if (
					action.payload === "Player's username contains special characters"
				) {
					state.nameTooLong = false
					state.nameInvalidChars = true
				}
			})
	},
})

export default authSlice
