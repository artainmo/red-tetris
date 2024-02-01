import { createSlice } from "@reduxjs/toolkit";

export const chronoSlice = createSlice({
	name: 'chrono',
	initialState: {
		isActive: false,
		elapsedTime: 0,
		startTime: 0
	},
	reducers: {
		startChrono: state => {
			state.isActive = true;
			state.elapsedTime = Date.now();
		},
		stopChrono: state => {
			state.isActive = false;
		},
		resetChrono: state => {
			state.isActive = false;
			state.elapsedTime = 0;
			state.startTime = 0;
		},
		updateChrono: (state, action) => {
			state.elapsedTime = action.payload - action.startTime;
		}
	}
});

export const { startChrono, stopChrono, resetChrono, updateChrono } = chronoSlice.actions;
export default chronoSlice.reducer;
