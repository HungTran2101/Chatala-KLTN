import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { HYDRATE } from 'next-redux-wrapper';
import { roomInfo } from '../../../utils/types';
import { message } from 'antd';

// Type for our state
export interface roomListState {
  list: roomInfo[];
  activeList: number[];
  loading: boolean;
}

const roomListInitialState: roomInfo[] = [];

// Initial state
const initialState: roomListState = {
  list: roomListInitialState,
  activeList: [],
  loading: false,
};

// Actual Slice
export const roomListSlice = createSlice({
  name: 'roomList',
  initialState,
  reducers: {
    requestRoomList(state, action) {
      state.loading = true;
      state.list = roomListInitialState;
    },

    setRoomList(state, action) {
      state.loading = false;
      state.list = action.payload;

      let temp = [];
      for (let i = 0; i < action.payload.length; i++) {
        temp.push(0);
      }
      state.activeList = temp;
    },

    setActiveRoom(state, action) {
      const activeUser: Array<{ socketId: string; uid: string }> =
        action.payload.users;
      const loggedUid = action.payload.loggedUid;
      if (loggedUid !== '') {
        state.list.forEach((room, index) => {
          if (!room.roomInfo.isGroup) {
            if (
              activeUser.some(
                (user) =>
                  user.uid === room.roomInfo.users[0].uid &&
                  user.uid !== loggedUid
              ) ||
              activeUser.some(
                (user) =>
                  user.uid === room.roomInfo.users[1].uid &&
                  user.uid !== loggedUid
              )
            )
              state.activeList[index] = 1;
            else state.activeList[index] = 0;
          }
        });
      }
    },

    setNewLastMsg(state, action) {
      const message = action.payload;
      const roomIndex = state.list.findIndex(
        (room) => room.roomInfo._id.toString() === message.roomId.toString()
      );

      state.list[roomIndex].roomInfo.lastMsg =
        message.lastMsg !== '' ? message.lastMsg : 'File';
    },

    clearRoomList(state, action) {
      state.loading = false;
      state.list = roomListInitialState;
    },

    changeNickname(state, action) {
      const index = state.list.findIndex(
        (room) => room.roomInfo._id === action.payload.roomId
      );
      state.list[index].roomName = action.payload.nickname;
    },

    incUnreadMsg(state, action) {
      const { senderId, roomId } = action.payload;
      const roomIndex = state.list.findIndex(
        (it) => it.roomInfo._id === roomId
      );
      state.list[roomIndex].roomInfo.users.map(
        (user) => user.uid !== senderId && user.unReadMsg++
      );
    },

    seenRoom(state, action) {
      const { uid, roomId } = action.payload;
      const roomIndex = state.list.findIndex(
        (it) => it.roomInfo._id === roomId
      );
      state.list[roomIndex].roomInfo.users.map((user) => {
        if (user.uid === uid) return (user.unReadMsg = 0);
      });
    },
    changeGroupName(state, action) {
      const index = state.list.findIndex(
        (room) => room.roomInfo._id === action.payload.roomId
      );
      if (index >= 0) {
        state.list[index].roomName = action.payload.groupName;
        state.list[index].roomInfo.groupName = action.payload.groupName;
      }
    },
    updateRoomForNewMember(state, action) {
      const { newMember, existed, roomId } = action.payload;
      const roomIndex = state.list.findIndex((r) => r.roomInfo._id === roomId);

      if (existed) {
        state.list[roomIndex].roomInfo.users.map((u) => {
          if (u.uid === newMember._id) u.isLeave = false;
        });
      } else {
        state.list[roomIndex].roomInfo.users.push({
          _id: '',
          uid: newMember._id,
          avatar: newMember.avatar,
          nickname: newMember.nickname,
          unReadMsg: 0,
          role: false,
          isLeave: false,
        });
      }
    },

    updateRoomForKickMember(state, action) {
      const { uid, roomId } = action.payload;
      const roomIndex = state.list.findIndex(r => r.roomInfo._id === roomId);
      const uIndex = state.list[roomIndex].roomInfo.users.findIndex(u => u.uid === uid);

      state.list[roomIndex].roomInfo.users[uIndex].isLeave = true;
    },

    startCall(state, action) {
      const { meetingId, roomId } = action.payload;
      const roomIndex = state.list.findIndex(r => r.roomInfo._id === roomId);
      state.list[roomIndex].roomInfo.meetingId = meetingId;
    },

    endCall(state, action) {
      const { roomId } = action.payload;
      const roomIndex = state.list.findIndex(r => r.roomInfo._id === roomId);
      state.list[roomIndex].roomInfo.meetingId = '';
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

export const roomListActions = roomListSlice.actions;

export const selectRoomListState = (state: AppState) => state.roomList;
