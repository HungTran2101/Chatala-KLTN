import * as S from './SearchModal.styled';
import * as React from 'react';
import Image from 'next/image';
import { useOutsideClick } from '../../../Global/ProcessFunctions';
import { SearchResult, userInfo } from '../../../../utils/types';
import { FriendApi } from '../../../../services/api/friend';
import { useSocketContext } from '../../../../contexts/socket';
import { RoomApi } from '../../../../services/api/room';
import {
  roomListActions,
  selectRoomListState,
} from '../../../../features/redux/slices/roomListSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserState } from '../../../../features/redux/slices/userSlice';
import { useState } from 'react';
import { roomInfoActions } from '../../../../features/redux/slices/roomInfoSlice';
import { messageActions } from '../../../../features/redux/slices/messageSlice';
import { fileActions } from '../../../../features/redux/slices/fileSlice';
import UserInfo from '../UserInfo';
interface ISearchModalModal {
  setSearchModal: (isActive: boolean) => void;
  searchResult: SearchResult[];
  setAction: (isActive: boolean) => void;
  loading: boolean;
}

const SearchModal = ({
  searchResult,
  setSearchModal,
  setAction,
  loading,
}: ISearchModalModal) => {
  const handleOutsideClick = () => {
    setSearchModal(false);
  };

  const socket = useSocketContext();
  const dispatch = useDispatch();

  const SearchModalRef = useOutsideClick(handleOutsideClick);

  const roomlist = useSelector(selectRoomListState);
  const user = useSelector(selectUserState);

  const [toggleFriendProfile, setToggleFriendProfile] = useState(false);
  const [friendProfile, setFriendProfile] = useState<userInfo>();

  const friendRequest = async (id: string) => {
    try {
      const res = await FriendApi.friendRequest(id);
      socket.emit('receiveNoti', id);
      setAction(true);
    } catch (err) {
      console.log(err);
    }
  };

  const friendAccept = async (
    notificationId: string,
    uid: string,
    nickname: string
  ) => {
    try {
      const res = await FriendApi.friendAccept(notificationId);
      setAction(true);

      const userToRoom = [
        {
          uid,
          nickname,
        },
      ];
      const createdRoom = await RoomApi.createRoom(userToRoom);
      if (createdRoom) {
        const rooms = await RoomApi.getRoomList();
        dispatch(roomListActions.setRoomList(rooms.result));
        socket.emit('new room', uid);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const friendDecline = async (id: string) => {
    try {
      const res = await FriendApi.friendDecline(id);
      setAction(true);
    } catch (err) {
      console.log(err);
    }
  };

  const messagesClick = async (uid: string) => {
    const roomInfoTemp = roomlist.list.find((it) => {
      const users = it.roomInfo.users;
      if (
        (users[0].uid === uid && users[1].uid === user.info._id) ||
        (users[1].uid === uid && users[0].uid === user.info._id)
      )
        return it.roomInfo._id;
    });

    const result = await await RoomApi.getRoomInfo(roomInfoTemp.roomInfo._id);
    dispatch(
      roomInfoActions.setRoomInfo({
        roomName: result.roomName,
        roomInfo: result.roomInfo,
        roomAvatar: result.roomAvatar,
      })
    );
    dispatch(messageActions.setMessage(result.messages));
    dispatch(fileActions.setFilesData(result.files));
    handleOutsideClick();
  };

  const infoClick = async (data: userInfo) => {
    setToggleFriendProfile(true);
    setFriendProfile(data);
  };

  return (
    <S.SearchModal ref={SearchModalRef}>
      <S.SearchModalList>
        {!loading ? (
          searchResult.length ? (
            searchResult.map((data, index) => (
              <S.SearchModalItem key={index}>
                <S.SearchModalInfo>
                  <S.SearchModalAvatar>
                    <Image
                      src={data.avatar}
                      alt='avatar'
                      layout='fill'
                      objectFit='cover'
                    />
                  </S.SearchModalAvatar>
                  <S.SearchModalNameWrapper>
                    <S.SearchModalName>{data.name}</S.SearchModalName>
                  </S.SearchModalNameWrapper>
                </S.SearchModalInfo>
                {data.status === 'available' ? (
                  <S.SearchModalMessage>Message</S.SearchModalMessage>
                ) : data.status === 'receive' ? (
                  <S.FlexWrap>
                    <S.SearchModalAccept
                      onClick={() =>
                        friendAccept(data.notificationId, data._id, data.name)
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
                ) : data.status === 'request' ? (
                  <S.SearchModalPending>Pending</S.SearchModalPending>
                ) : (
                  <S.SearchModalAddFriend
                    onClick={() => friendRequest(data._id)}
                  >
                    Add Friend
                  </S.SearchModalAddFriend>
                )}
              </S.SearchModalItem>
            ))
          ) : (
            <div>No Result</div>
          )
        ) : (
          <div>Loading...</div>
        )}
      </S.SearchModalList>
      {toggleFriendProfile && (
        <UserInfo
          friendProfile={friendProfile}
          setUserInfoModal={setToggleFriendProfile}
        />
      )}
    </S.SearchModal>
  );
};

export default SearchModal;
