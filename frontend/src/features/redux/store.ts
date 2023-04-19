import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import { roomListSlice } from "./slices/roomListSlice";
import { roomInfoSlice } from "./slices/roomInfoSlice";
import { createWrapper } from "next-redux-wrapper";
import { messageSlice } from "./slices/messageSlice";
import { friendListSlice } from "./slices/friendListSlice";
import { fileSlice } from "./slices/fileSlice";
import { utilSlice } from "./slices/utilSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      [userSlice.name]: userSlice.reducer,
      [friendListSlice.name]: friendListSlice.reducer,
      [roomListSlice.name]: roomListSlice.reducer,
      [roomInfoSlice.name]: roomInfoSlice.reducer,
      [messageSlice.name]: messageSlice.reducer,
      [fileSlice.name]: fileSlice.reducer,
      [utilSlice.name]: utilSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);
