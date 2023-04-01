import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { fileType } from "../../../utils/types";

// Type for our state
export interface FileState {
  list: fileType[];
  loading: boolean;
}

// Initial state
const initialState: FileState = {
  list: [],
  loading: false,
};

// Actual Slice
export const fileSlice = createSlice({
  name: "roomfiles",
  initialState,
  reducers: {
    setFilesData(state, action) {
      state.loading = false;
      state.list = action.payload;
    },

    // // Special reducer for hydrating the state. Special case for next-redux-wrapper
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

export const fileActions = fileSlice.actions;

export const selectFileState = (state: AppState) => state.roomfiles;
