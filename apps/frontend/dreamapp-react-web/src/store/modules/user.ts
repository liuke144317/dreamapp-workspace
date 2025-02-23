import { createSlice } from '@reduxjs/toolkit';
import { getToken } from '@/utils/auth.ts';
const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: getToken(),
    userInfo: null,
  },
  reducers: {
    setUserToken(state, action) {
      state.token = action.payload;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
  },
});
export const { setUserToken, setUserInfo } = userSlice.actions;
export default userSlice.reducer;
