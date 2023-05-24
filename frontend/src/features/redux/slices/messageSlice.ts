import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { messageType } from "../../../utils/types";

// Type for our state
export interface messageState {
  list: messageType[];
  loading: boolean;
}

const messageInitialState: messageType[] = [];

// Initial state
const initialState: messageState = {
  list: messageInitialState,
  loading: false,
};

// Actual Slice
export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    requestMessage(state, action) {
      state.loading = true;
      state.list = messageInitialState;
    },

    setMessage(state, action) {
      state.loading = false;
      state.list = action.payload;
    },

    newMessage(state, action) {
      state.list.unshift(action.payload);
    },

    loadMessage(state, action) {
      state.list = state.list.concat(action.payload);
    },

    clearMessage(state, action) {
      state.loading = false;
      state.list = messageInitialState;
    },

    unsend(state, action) {
      const index = state.list.findIndex((msg) => msg._id === action.payload);
      state.list[index].unSend = true;
    },

    delete(state, action) {
      const index = state.list.findIndex((msg) => msg._id === action.payload);
      state.list[index].deleted = true;
    },

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    // extraReducers: {
    //   // @ts-ignore
    //   [HYDRATE]: (state, action) => {
    //     return {
    //       ...state,
    //       ...action.payload.roomInfo,
    //     };
    //   },
    // },
  },
});

export const messageActions = messageSlice.actions;

export const selectMessageState = (state: AppState) => state.messages;
