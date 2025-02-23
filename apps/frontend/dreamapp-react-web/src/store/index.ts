import { configureStore } from '@reduxjs/toolkit';
import countReducer from './modules/test.ts';
import userReducer from './modules/user.ts';
const store = configureStore({
  reducer: {
    counter: countReducer,
    user: userReducer,
  },
});
export default store;
