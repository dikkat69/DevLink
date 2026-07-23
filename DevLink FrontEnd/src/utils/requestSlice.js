import { createSlice } from "@reduxjs/toolkit";


const requestSlice = createSlice({
    name : "requests",
    initialState : [],
    reducers : {
        addRequests : (state , action) => {
            return action.payload  },
        removeRequest : (state , action) => {
            return state.filter((request) => request._id !== action.payload);}
    }
});

export const { addRequests, removeRequest } = requestSlice.actions

export default requestSlice.reducer