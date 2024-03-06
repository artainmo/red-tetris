import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import gameSessionsSlice from "./slices/gameSessionsSlice";
import gameTimeSlice from "./slices/gameTimeSlice";
import socketsSlice from "./slices/socketsSlice";

const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		socket: socketsSlice.reducer,
		gameTime: gameTimeSlice.reducer,
		gameSessions: gameSessionsSlice.reducer,
	}
});

export default store; 
