import ChatPreviewItem from "../ChatPreviewItem";
import * as S from "./ChatList.styled";
import React from "react";
import { useState, useEffect } from "react";
import { RoomApi } from "../../../../services/api/room";
import { ClipLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { selectRoomListState } from "../../../../features/redux/slices/roomListSlice";
import { roomInfoActions } from "../../../../features/redux/slices/roomInfoSlice";
import { messageActions } from "../../../../features/redux/slices/messageSlice";
import { useSocketContext } from "../../../../contexts/socket";

const ChatList = () => {
  const [roomSelected, setRoomSelected] = useState(-1);

  const roomList = useSelector(selectRoomListState);
  const socket = useSocketContext();

  const dispatch = useDispatch();

  const roomSelect = async (index: number) => {
    if (roomSelected !== index) {
      // dispatch(roomInfoActions.requestRoomInfo(null));
      const result = await RoomApi.getRoomInfo(
        roomList.list[index].roomInfo._id
      );

      dispatch(
        roomInfoActions.setRoomInfo({
          roomName: result.roomName,
          roomInfo: result.roomInfo,
          roomAvatar: result.roomAvatar,
        })
      );
      dispatch(messageActions.setMessage(result.messages));

      //@ts-ignore
      socket.emit("room leave", roomList.list[roomSelected]?.roomInfo._id);
      socket.emit("room join", roomList.list[index].roomInfo._id);

      setRoomSelected(index);
    }
  };

  return (
    <S.ChatList>
      <S.Wrapper>
        {roomList.loading ? (
          <ClipLoader color="#769FCD" />
        ) : roomList.list.length > 0 ? (
          roomList.list.map((data, index) => (
            <React.Fragment key={index}>
              <ChatPreviewItem
                avatar={data.roomAvatar}
                msg={data.roomInfo.lastMsg}
                name={data.roomName}
                index={index}
                active={roomSelected === index}
                onClick={() => roomSelect(index)}
              />
            </React.Fragment>
          ))
        ) : (
          <i>You don&apos;t have any room chat</i>
        )}
      </S.Wrapper>
    </S.ChatList>
  );
};

export default ChatList;
