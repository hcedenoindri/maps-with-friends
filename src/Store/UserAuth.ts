import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../User/User";
type InitialState = {
  isAuth: boolean;
  user: any;
  error: string;
  profile: any;
};
const initialState: InitialState = {
  isAuth: false,
  error: "",
  user: {},
  profile: {},
};

const userAuth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authUserLogin(state, action: PayloadAction<any>) {
      state.error = "";
      state.user = action.payload;
      state.isAuth = true;
    },

    authUserLogout(state) {
      state.error = "";
      state.isAuth = false;
      state.user = {};
    },

    createProfile(state, action: PayloadAction<User>) {
      state.profile = action.payload;
    },

    updateUsername(state, action: PayloadAction<string>) {
      state.profile.username = action.payload;
    },
    updateAvatarImg(state, action: PayloadAction<string>) {
      state.profile.avatarImg = action.payload;
    },
    updatePoints(state, action: PayloadAction<string>) {
      state.profile.poits = action.payload;
    },
  },
});

export const {
  authUserLogin,
  authUserLogout,
  createProfile,
  updateUsername,
  updateAvatarImg,
  updatePoints,
} = userAuth.actions;

export default userAuth.reducer;
