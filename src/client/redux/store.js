import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import currentGameSlice from './slices/currentGameSlice'
import gameTimeSlice from './slices/gameTimeSlice'
import socketSlice from './slices/socketSlice'
import gameplaySlice from './slices/gameplaySlice'
import pieceSlice from './slices/pieceSlice'
import roomSlice from './slices/roomSlice'
import opponentsSlice from './slices/opponentsSlice'

const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		gameplay: gameplaySlice.reducer,
		currentGame: currentGameSlice.reducer,
		socket: socketSlice.reducer,
		gameTime: gameTimeSlice.reducer,
		piece: pieceSlice.reducer,
		room: roomSlice.reducer,
		opponents: opponentsSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
})

export default store
