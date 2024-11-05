import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import currentGameSlice from "./slices/currentGameSlice";
import gameSessionsSlice from "./slices/gameSessionsSlice";
import gameTimeSlice from "./slices/gameTimeSlice";
import socketSlice from "./slices/socketSlice";
import gameplaySlice from "./slices/gameSessionsSlice";

const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		currentGame: currentGameSlice.reducer,
		gameplaySlice: gameSessionsSlice.reducer,
		socket: socketSlice.reducer,
		gameTime: gameTimeSlice.reducer,
		gameSessions: gameSessionsSlice.reducer,
	}
});

export default store; 
