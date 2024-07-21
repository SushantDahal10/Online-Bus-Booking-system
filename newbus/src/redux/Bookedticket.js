import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    BookedSeats: [],
    quantity: 0
  };
  const bookticketslice=createSlice({
    name:"bookticket",
    initialState,
    reducers: {
          Occupied:(state,action)=>{
            state.BookedSeats=action.payload
            state.quantity+=1;
          }

    }

  })
  export const {Occupied}=bookticketslice.actions
  export default bookticketslice.reducer;
  