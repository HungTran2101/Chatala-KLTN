import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { UITextType } from '../../../utils/types';
import { UIText as UI } from '../../../utils/dataConfig';

// Type for our state
export interface UtilState {
  replyId: string;
  onCall: boolean;
  UItext: UITextType;
}

// Initial state
const initialState: UtilState = {
  replyId: null,
  onCall: false,
  UItext: UI[0],
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
    setUIText(state, action) {
      const { locale } = action.payload;
      const uiText = UI.find((it) => it.locale === locale);
      state.UItext = uiText;
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
