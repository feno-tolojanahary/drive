import { configureStore } from '@reduxjs/toolkit';
import docManagerSlice from './docManagerSlice';

export const store = configureStore({
  reducer: {
    docManager: docManagerSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;