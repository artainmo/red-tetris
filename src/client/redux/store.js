import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import currentGameSlice from "./slices/currentGameSlice";
import gameSessionsSlice from "./slices/gameSessionsSlice";
import gameTimeSlice from "./slices/gameTimeSlice";
import socketsSlice from "./slices/socketsSlice";

const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		currentGame: currentGameSlice.reducer,
		socket: socketsSlice.reducer,
		gameTime: gameTimeSlice.reducer,
		gameSessions: gameSessionsSlice.reducer,
	}
});

export default store; 
