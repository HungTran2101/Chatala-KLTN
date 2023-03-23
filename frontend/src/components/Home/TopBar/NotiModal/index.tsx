import * as S from "./NotiModal.styled";
import * as React from "react";
import { useOutsideClick } from "../../../Global/ProcessFunctions";
import { FriendApi } from "../../../../services/api/friend";
import { RoomApi } from "../../../../services/api/room";
import { useDispatch, useSelector } from "react-redux";
import { roomListActions } from "../../../../features/redux/slices/roomListSlice";

import Image from "next/image";
import { useSocketContext } from "../../../../contexts/socket";

interface INotiModal {
  listNoti: any;
  getListNotify: () => void;
  setActiveNotiModal: (isActive: boolean) => void;
}

const NotiModal = ({
  listNoti,
  getListNotify,
  setActiveNotiModal,
}: INotiModal) => {
  const handleOutsideClick = () => {
    setActiveNotiModal(false);
  };

  const dispatch = useDispatch();
  const socket = useSocketContext();

  const NotiRef = useOutsideClick(handleOutsideClick);

  const friendAccept = async (
    id: string,
    uid: string,
    nickname: string,
    avatar: string
  ) => {
    try {
      await FriendApi.friendAccept(id);
      getListNotify();
      const userToRoom = [
        {
          uid,
          nickname,
          avatar,
        },
      ];
      const createdRoom = await RoomApi.createRoom(userToRoom);
      if (createdRoom) {
        const rooms = await RoomApi.getRoomList();
        dispatch(roomListActions.setRoomList(rooms.result));
        socket.emit("new room", uid);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const friendDecline = async (id: string) => {
    try {
      await FriendApi.friendDecline(id);
      getListNotify();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <S.Noti ref={NotiRef}>
      <S.NotiTitles>Friend Requests</S.NotiTitles>
      {listNoti.length > 0 ? (
        <S.NotiList>
          {listNoti.map((data: any, index: number) => (
            <S.NotiItem key={index}>
              <S.NotiInfo>
                <S.NotiAvatar>
                  <Image
                    src={data.avatar}
                    alt="avatar"
                    layout="fill"
                    objectFit="cover"
                  />
                </S.NotiAvatar>
                <S.NotiNameWrapper>
                  <S.NotiName>{data.name}</S.NotiName>
                  {/* <S.NotiNumFriend>{`${data.numFriends} Friends`}</S.NotiNumFriend> */}
                </S.NotiNameWrapper>
              </S.NotiInfo>
              <S.NotiAccept
                onClick={() =>
                  friendAccept(data._id, data.uid, data.name, data.avatar)
                }
              >
                Accept
              </S.NotiAccept>
              <S.NotiDecline onClick={() => friendDecline(data._id)}>
                Decline
              </S.NotiDecline>
            </S.NotiItem>
          ))}
        </S.NotiList>
      ) : (
        <S.NotiText>You don&apos;t have any friend requests</S.NotiText>
      )}
    </S.Noti>
  );
};

export default NotiModal;
