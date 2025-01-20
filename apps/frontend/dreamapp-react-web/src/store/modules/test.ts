import { createSlice } from '@reduxjs/toolkit';
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    count: 0,
  },
  reducers: {
    add(state, action) {
      state.count += action.payload;
    },
    sub(state, action) {
      state.count -= action.payload;
    },
  },
});
export const { add, sub } = counterSlice.actions;
export default counterSlice.reducer;
