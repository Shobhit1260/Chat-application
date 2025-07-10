import { createSlice } from '@reduxjs/toolkit';
const initialState={
    value:{}, 
}

const meSlice= createSlice({
    name:'me',
    initialState,
    reducers:{
        getuser:(state,action)=>{
            state.value = action.payload
        }  
     }
})

export const { getuser } = meSlice.actions;
export default meSlice.reducer;
