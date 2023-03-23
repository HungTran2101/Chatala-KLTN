import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { userInfo } from "../../../utils/types";

// Type for our state
export interface UserState {
  info: userInfo;
  loading: boolean;
}

const userInfoInitialState = {
  _id: "",
  avatar: "",
  banner: "",
  name: "",
  phone: "",
  gender: "",
  dob: "",
  createdAt: "",
  updatedAt: "",
  __v: 0,
};

// Initial state
const initialState: UserState = {
  info: userInfoInitialState,
  loading: false,
};

// Actual Slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    requestUserInfo(state, action) {
      state.loading = true;
      state.info = userInfoInitialState;
    },

    setUserInfo(state, action) {
      state.loading = false;
      state.info = action.payload;
    },

    clearUserInfo(state, action) {
      state.loading = false;
      state.info = userInfoInitialState;
    },

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: {
      // @ts-ignore
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.user,
        };
      },
    },
  },
});

export const userActions = userSlice.actions;

export const selectUserState = (state: AppState) => state.user;
