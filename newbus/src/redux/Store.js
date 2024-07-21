// store.js
import { configureStore } from '@reduxjs/toolkit';
import buspriceReducer from './busprice';
import bookedticketreducer from './Bookedticket'
const store = configureStore({
  reducer: {
    busprice: buspriceReducer,
    bookedticket: bookedticketreducer,

  }
});

export default store;
