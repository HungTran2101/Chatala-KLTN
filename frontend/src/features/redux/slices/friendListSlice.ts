import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { friendInfo } from "../../../utils/types";

// Type for our state
export interface friendListState {
  list: friendInfo[];
  loading: boolean;
}

const friendListInitialState: friendInfo[] = [];

// Initial state
const initialState: friendListState = {
  list: friendListInitialState,
  loading: false,
};

// Actual Slice
export const friendListSlice = createSlice({
  name: "friendList",
  initialState,
  reducers: {
    requestFriendList(state, action) {
      state.loading = true;
      state.list = friendListInitialState;
    },

    setFriendList(state, action) {
      state.loading = false;
      state.list = action.payload;
    },

    clearFriendList(state, action) {
      state.loading = false;
      state.list = friendListInitialState;
    },

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    // extraReducers: {
    //   // @ts-ignore
    //   [HYDRATE]: (state, action) => {
    //     return {
    //       ...state,
    //       ...action.payload.user,
    //     };
    //   },
    // },
  },
});

export const friendListActions = friendListSlice.actions;

export const selectFriendListState = (state: AppState) => state.friendList;
