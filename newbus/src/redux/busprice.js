// redux/busprice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSeats: [],
  quantity: 0
};

const buspriceSlice = createSlice({
  name: 'busprice',
  initialState,
  reducers: {
    Addseat: (state, action) => {
      const seatId = action.payload;
      if (state.selectedSeats.includes(seatId)) {
        state.selectedSeats = state.selectedSeats.filter(seat => seat !== seatId);
        state.quantity -= 1;
      } else {
        state.selectedSeats = [...state.selectedSeats, seatId];
        state.quantity += 1;
      }
    }
  }
});

export const { Addseat } = buspriceSlice.actions;
export default buspriceSlice.reducer;
