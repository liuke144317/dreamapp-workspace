import { configureStore } from '@reduxjs/toolkit';
import countReducer from './modules/test.ts';
const store = configureStore({
  reducer: {
    counter: countReducer,
  },
});
export default store;
