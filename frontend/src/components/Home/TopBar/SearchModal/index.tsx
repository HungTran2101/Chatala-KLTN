import * as S from "./SearchModal.styled";
import * as React from "react";
import Image from "next/image";
import { useOutsideClick } from "../../../Global/ProcessFunctions";
import { SearchResult } from "../../../../utils/types";
import { FriendApi } from "../../../../services/api/friend";
import { useSocketContext } from "../../../../contexts/socket";
import { RoomApi } from "../../../../services/api/room";
import { roomListActions } from "../../../../features/redux/slices/roomListSlice";
import { useDispatch } from "react-redux";
interface ISearchModalModal {
  setSearchModal: (isActive: boolean) => void;
  searchResult: SearchResult[];
  setAction: (isActive: boolean) => void;
}

const SearchModal = ({
  searchResult,
  setSearchModal,
  setAction,
}: ISearchModalModal) => {
  const handleOutsideClick = () => {
    setSearchModal(false);
  };

  const socket = useSocketContext();
  const dispatch = useDispatch();

  const SearchModalRef = useOutsideClick(handleOutsideClick);

  const friendRequest = async (id: string) => {
    try {
      const res = await FriendApi.friendRequest(id);
      socket.emit("receiveNoti", id);
      setAction(true);
    } catch (err) {
      console.log(err);
    }
  };

  const friendAccept = async (
    notificationId: string,
    uid: string,
    nickname: string,
    avatar: string
  ) => {
    try {
      const res = await FriendApi.friendAccept(notificationId);
      setAction(true);

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
    console.log(id);

    try {
      const res = await FriendApi.friendDecline(id);
      setAction(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <S.SearchModal ref={SearchModalRef}>
      <S.SearchModalList>
        {searchResult.length ? (
          searchResult.map((data, index) => (
            <S.SearchModalItem key={index}>
              <S.SearchModalInfo>
                <S.SearchModalAvatar>
                  <Image
                    src={data.avatar}
                    alt="avatar"
                    layout="fill"
                    objectFit="cover"
                  />
                </S.SearchModalAvatar>
                <S.SearchModalNameWrapper>
                  <S.SearchModalName>{data.name}</S.SearchModalName>
                </S.SearchModalNameWrapper>
              </S.SearchModalInfo>
              {data.status === "available" ? (
                <S.SearchModalMessage>Message</S.SearchModalMessage>
              ) : data.status === "receive" ? (
                <S.FlexWrap>
                  <S.SearchModalAccept
                    onClick={() =>
                      friendAccept(
                        data.notificationId,
                        data._id,
                        data.name,
                        data.avatar
                      )
                    }
                  >
                    Accept
                  </S.SearchModalAccept>
                  <S.SearchModalDecline
                    onClick={() => friendDecline(data.notificationId)}
                  >
                    Decline
                  </S.SearchModalDecline>
                </S.FlexWrap>
              ) : data.status === "request" ? (
                <S.SearchModalPending>Pending</S.SearchModalPending>
              ) : (
                <S.SearchModalAddFriend onClick={() => friendRequest(data._id)}>
                  Add Friend
                </S.SearchModalAddFriend>
              )}
            </S.SearchModalItem>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </S.SearchModalList>
    </S.SearchModal>
  );
};

export default SearchModal;
