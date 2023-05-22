import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { fileType } from '../../../utils/types';

// Type for our state
export interface UtilState {
  replyId: string;
  onCall: boolean;
}

// Initial state
const initialState: UtilState = {
  replyId: null,
  onCall: false,
};

// Actual Slice
export const utilSlice = createSlice({
  name: 'util',
  initialState,
  reducers: {
    setReplyId(state, action) {
      state.replyId = action.payload;
    },
    clearReplyId(state, action: PayloadAction<void>) {
      state.replyId = null;
    },
    toggleCalling(state, action) {
      state.onCall = action.payload;
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

export const utilActions = utilSlice.actions;

export const selectUtilState = (state: AppState) => state.util;
