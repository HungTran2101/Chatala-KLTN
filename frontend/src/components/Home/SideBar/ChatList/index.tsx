import ChatPreviewItem from "../ChatPreviewItem";
import * as S from "./ChatList.styled";
import React from "react";
import { useState, useEffect } from "react";
import { RoomApi } from "../../../../services/api/room";
import { ClipLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import {
  roomListActions,
  selectRoomListState,
} from "../../../../features/redux/slices/roomListSlice";
import {
  roomInfoActions,
  selectRoomInfoState,
} from "../../../../features/redux/slices/roomInfoSlice";
import { messageActions } from "../../../../features/redux/slices/messageSlice";
import { useSocketContext } from "../../../../contexts/socket";
import { fileActions } from "../../../../features/redux/slices/fileSlice";
import { selectUserState } from "../../../../features/redux/slices/userSlice";

const ChatList = () => {
  const [roomSelected, setRoomSelected] = useState<number>(-1);

  const roomList = useSelector(selectRoomListState);
  const roomInfo = useSelector(selectRoomInfoState);
  const user = useSelector(selectUserState);
  const socket = useSocketContext();

  const dispatch = useDispatch();

  const seenRoom = async (roomId: string) => {
    const res = await RoomApi.seenRoom(
      user.info._id,
      roomId
    );
    console.log(res);
  }

  const roomSelect = async (index: number) => {
    if (roomSelected !== index) {
      // dispatch(roomInfoActions.requestRoomInfo(null));
      const result = await RoomApi.getRoomInfo(
        roomList.list[index].roomInfo._id
      );

      const unReadMsgNumber = roomList.list[index].roomInfo.users.find(
        (it) => it.uid === user.info._id
      ).unReadMsg;

      if (unReadMsgNumber >= 1) {
        seenRoom(roomList.list[index].roomInfo._id)
      }
      // dispatch(
      //   roomInfoActions.setRoomInfo({
      //     roomName: result.roomName,
      //     roomInfo: result.roomInfo,
      //     roomAvatar: result.roomAvatar,
      //   })
      // );
      dispatch(roomInfoActions.setRoomInfo(roomList.list[index]));
      dispatch(
        roomListActions.seenRoom({
          uid: user.info._id,
          roomId: roomList.list[index].roomInfo._id,
        })
      );
      dispatch(messageActions.setMessage(result.messages));
      dispatch(fileActions.setFilesData(result.files));

      //@ts-ignore
      socket.emit(
        "join new room",
        roomList.list[roomSelected]?.roomInfo._id,
        roomList.list[index].roomInfo._id
      );

      setRoomSelected(index);
    }
  };

  useEffect(() => {
    //@ts-ignore
    socket.on("incUnreadMsg", (senderId, roomId) => {
      if (senderId !== user.info._id) {
        if (
          roomInfo.info === undefined ||
          roomInfo.info.roomInfo._id !== roomId
        ) {
          dispatch(roomListActions.incUnreadMsg({ senderId, roomId }));
        }
        else {
          seenRoom(roomId)
        }
      }
    });

    return () => {
      socket.off("incUnreadMsg");
    };
  }, [roomInfo, user]);

  return (
    <S.ChatList>
      <S.Wrapper>
        {roomList.loading ? (
          <ClipLoader color="#769FCD" />
        ) : roomList.list.length > 0 ? (
          roomList.list.map((data, index) => {
            const status = roomList.activeList[index];

            return (
              <ChatPreviewItem
                key={index}
                roomInfo={data}
                status={status}
                active={roomSelected === index}
                onClick={() => roomSelect(index)}
              />
            );
          })
        ) : (
          <i>You don&apos;t have any room chat</i>
        )}
      </S.Wrapper>
    </S.ChatList>
  );
};

export default ChatList;
