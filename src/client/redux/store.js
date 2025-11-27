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
			serializableCheck: false /* this is to fix "A non serializable object was detected in socket.socket error" */,
			/* see https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using*/
		}),
})

export default store
