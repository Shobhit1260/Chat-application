import { configureStore } from '@reduxjs/toolkit'
import userReducer from './UserSlice';
import meReducer from './meSlice';

export const store = configureStore({
  reducer: {
    userSelected: userReducer,
    me:meReducer
  },
})


