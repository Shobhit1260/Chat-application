import { createSlice } from '@reduxjs/toolkit';
const initialState={
    value:{}, 
}

const tokenSlice= createSlice({
    name:'token',
    initialState,
    reducers:{
        settoken:(state,action)=>{
            state.value = action.payload
        }  
     }
})

export const { settoken } = tokenSlice.actions;
export default tokenSlice.reducer;
