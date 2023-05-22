import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { HYDRATE } from 'next-redux-wrapper';
import { roomInfo } from '../../../utils/types';

// Type for our state
export interface roomInfoState {
  info: roomInfo | undefined;
  loading: boolean;
}

const roomInfoInitialState = undefined;

// Initial state
const initialState: roomInfoState = {
  info: roomInfoInitialState,
  loading: false,
};

// Actual Slice
export const roomInfoSlice = createSlice({
  name: 'roomInfo',
  initialState,
  reducers: {
    requestRoomInfo(state, action) {
      state.loading = true;
      state.info = roomInfoInitialState;
    },

    setRoomInfo(state, action) {
      state.loading = false;
      state.info = action.payload;
    },

    clearRoomInfo(state, action) {
      state.loading = false;
      state.info = roomInfoInitialState;
    },

    changeNickname(state, action) {
      const index = state.info.roomInfo.users.findIndex(
        (user) => user.uid === action.payload.uid
      );
      state.info.roomInfo.users[index].nickname = action.payload.nickname;
      state.info.roomName = action.payload.nickname;
    },

    changeGroupName(state, action) {
      state.info.roomName = action.payload;
      state.info.roomInfo.groupName = action.payload;
    },

    addMember(state, action) {
      const { newMember, existed } = action.payload;

      if (existed) {
        state.info.roomInfo.users.map((u) => {
          if (u.uid === newMember._id) u.isLeave = false;
        });
      } else {
        state.info.roomInfo.users.push({
          _id: '',
          uid: newMember._id,
          avatar: newMember.avatar,
          nickname: newMember.name,
          unReadMsg: 0,
          role: false,
          isLeave: false,
        });
      }
    },

    kickMember(state, action) {
      const { uid } = action.payload;
      const uindex = state.info.roomInfo.users.findIndex((u) => u.uid === uid);

      state.info.roomInfo.users[uindex].isLeave = true;
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

export const roomInfoActions = roomInfoSlice.actions;

export const selectRoomInfoState = (state: AppState) => state.roomInfo;
