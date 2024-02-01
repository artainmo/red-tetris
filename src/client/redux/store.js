import { configureStore } from '@reduxjs/toolkit';
import chronoReducer from './slices/chronoSlice'; 

export const store = configureStore({
	reducer: {
		chrono: chronoReducer
	}
});
