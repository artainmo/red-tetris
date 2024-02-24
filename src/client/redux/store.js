import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import gameTimeSlice from "./slices/gameTimeSlice";
import socketSlice from "./slices/socketSlice";

const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		socket: socketSlice.reducer,
		gameTime: gameTimeSlice.reducer,
	}
});

export default store; 
