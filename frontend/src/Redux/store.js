import { configureStore } from '@reduxjs/toolkit'
import userReducer from './UserSlice';
import meReducer from './meSlice';
import tokenReducer from './tokenSlice'
import usersandGroupReducer from './usersandGroup';

export const store = configureStore({
  reducer: {
    userSelected: userReducer,
    me:meReducer,
    token:tokenReducer,
    usersandGroup: usersandGroupReducer,
  },
})


