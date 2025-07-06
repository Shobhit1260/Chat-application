import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: null,
};

export const userSlice = createSlice({
  name: 'userSelected',
  initialState,
  reducers: {
    setSelectedUser: (state,action) => {
      state.value = action.payload;
    },
    clearSelectedUser: (state) => {
      state.value = null;
    },
  },
});

export const { setSelectedUser, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
