import Image from 'next/image';
import * as S from './TopBar.styled';
import React, { useEffect, useState } from 'react';
import Logo from '../../../assets/imgs/LogoFullLong.png';
import UserInfo from './UserInfo';
import NotiModal from './NotiModal';
import SettingsModal from './SettingsModal';
import { UsersApi } from '../../../services/api/users';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUserState,
  userActions,
} from '../../../features/redux/slices/userSlice';
import { useRouter } from 'next/router';
import { SearchResult, userInfo } from '../../../utils/types';
import {
  roomInfoActions,
  selectRoomInfoState,
} from '../../../features/redux/slices/roomInfoSlice';
import {
  roomListActions,
  selectRoomListState,
} from '../../../features/redux/slices/roomListSlice';
import { FriendApi } from '../../../services/api/friend';
import { useSocketContext } from '../../../contexts/socket';
import { AutoComplete, Popover, Select, SelectProps, message } from 'antd';
import { RoomApi } from '../../../services/api/room';
import { messageActions } from '../../../features/redux/slices/messageSlice';
import { fileActions } from '../../../features/redux/slices/fileSlice';
import { friendListActions } from '../../../features/redux/slices/friendListSlice';

const TopBar = () => {
  // const [userInfoModal, setUserInfoModal] = useState(false);
  const [activeNotiModal, setActiveNotiModal] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [action, setAction] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const socket = useSocketContext();
  const user = useSelector(selectUserState);
  const roomInfo = useSelector(selectRoomInfoState);
  const dispatch = useDispatch();
  const router = useRouter();

  const [listNoti, setListNoti] = useState([]);

  const getLoggedUser = async () => {
    const result = await UsersApi.getLoggedUser();
    if (result) dispatch(userActions.setUserInfo(result));
  };

  const getListNotify = async () => {
    const listNotify = await FriendApi.friendRequestList();
    setListNoti(listNotify);
  };

  const logout = async () => {
    await UsersApi.logout();

    //Remove call token
    sessionStorage.removeItem('callToken');

    //@ts-ignore
    socket.emit('logout', roomInfo.info?.roomInfo._id);
    dispatch(userActions.clearUserInfo(null));
    dispatch(roomInfoActions.clearRoomInfo(null));
    dispatch(roomListActions.clearRoomList(null));
    router.push('/login');
  };

  const getSearchResult = async () => {
    setSearchResult([]);
    if (searchInput) {
      try {
        const res = await UsersApi.userFind({ search: searchInput });
        setSearchResult(res.result);
        setSearchLoading(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      setSearchResult([]);
      // setSearchModal(false);
    }
  };

  useEffect(() => {
    getLoggedUser();
    getListNotify();
    socket.on('receiveNoti', () => {
      getListNotify();
    });
  }, []);

  useEffect(() => {
    if (user.loading === false && user.info) {
      // @ts-ignore
      socket.emit('logged', user.info._id);
      socket.on('getUsers', (users) => {
        console.log('users', users);
        dispatch(
          roomListActions.setActiveRoom({ users, loggedUid: user.info._id })
        );
      });
    }

    return () => {
      socket.off('getUsers');
    };
  }, [user]);

  useEffect(() => {
    let t: any;
    setSearchResult([]);
    setSearchLoading(true);
    t = setTimeout(() => {
      getSearchResult();
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);
  useEffect(() => {
    if (action) {
      getSearchResult();
      setAction(false);
    }
  }, [action]);

  const [settingModal, setSettingModal] = useState(false);
  const [modalUser, setModalUser] = useState(false);

  const renderItem = (data: SearchResult) => {
    return (
      <S.SearchModalItem>
        <S.SearchModalInfo onClick={() => infoClick(data)}>
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
        {data.status === 'available' ? (
          <S.SearchModalMessage onClick={() => messagesClick(data._id)}>
            Message
          </S.SearchModalMessage>
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
          <S.SearchModalAddFriend onClick={() => friendRequest(data._id)}>
            Add Friend
          </S.SearchModalAddFriend>
        )}
      </S.SearchModalItem>
    );
  };

  const [options, setOptions] = useState<SelectProps<object>['options']>([]);

  useEffect(() => {
    let _options = [];
    searchResult.forEach((it) => _options.push({ label: renderItem(it) }));
    setOptions(_options);
  }, [searchResult]);

  const roomlist = useSelector(selectRoomListState);

  const [friendProfile, setFriendProfile] = useState<userInfo>();

  const friendRequest = async (id: string) => {
    try {
      const res = await FriendApi.friendRequest(id);
      message.success(res.msg);
      socket.emit('sendNoti', id);
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
      const createdRoom = await RoomApi.createRoom({
        users: userToRoom,
        friendRelateId: res.friendRelateId,
      });
      if (createdRoom) {
        const rooms = await RoomApi.getRoomList();
        dispatch(roomListActions.setRoomList(rooms.result));
        const friends = await FriendApi.friendList();
        dispatch(friendListActions.setFriendList(friends));
        socket.emit('new room', uid);
      }
      getListNotify();
      message.success('Accept friend successfully');
    } catch (err) {
      console.log(err);
    }
  };

  const friendDecline = async (id: string) => {
    try {
      const res = await FriendApi.friendDecline(id);
      message.success('Decline friend successfully');
      getListNotify();
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

    const result = await RoomApi.getRoomInfo(roomInfoTemp.roomInfo._id);
    dispatch(
      roomInfoActions.setRoomInfo({
        roomName: roomInfoTemp.roomName,
        roomInfo: roomInfoTemp.roomInfo,
        roomAvatar: roomInfoTemp.roomAvatar,
      })
    );
    dispatch(messageActions.setMessage(result.messages));
    dispatch(fileActions.setFilesData(result.files));
  };

  const infoClick = async (data: userInfo) => {
    setModalUser(true);
    setFriendProfile(data);
  };

  const showUserInfo = async () => {
    setModalUser(true);
    setFriendProfile(undefined);
  };

  return (
    <S.Container>
      <S.Wrapper>
        <S.LeftWrapper onClick={() => showUserInfo()}>
          <S.Avatar>
            {user.info?.avatar && user.info.avatar !== '' && (
              <Image
                src={user.info.avatar}
                alt="avatar"
                layout="fill"
                objectFit="cover"
              />
            )}
          </S.Avatar>
          <S.UserName>{user.info?.name}</S.UserName>
        </S.LeftWrapper>
        <S.RightWrapper>
          <S.LogoContainer>
            <S.Logo>
              <Image src={Logo} alt="logo" />
            </S.Logo>
          </S.LogoContainer>
          <S.Search>
            <S.SearchIcon />
            <AutoComplete
              popupClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={500}
              style={{ width: '100%' }}
              options={options}
              notFoundContent="Loading!"
              listHeight={500}
            >
              <S.SearchInput
                placeholder="Search..."
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
              />
            </AutoComplete>
          </S.Search>
          <S.Option>
            <S.OptionNotifyWrapper>
              <Popover
                content={
                  <NotiModal
                    listNoti={listNoti}
                    friendAccept={friendAccept}
                    friendDecline={friendDecline}
                  />
                }
                title="Notification"
                trigger="click"
                placement="bottomRight"
              >
                <S.OptionNotify />
                {listNoti.length > 0 && (
                  <S.OptionNotifyNumber number={listNoti.length}>
                    {listNoti.length < 100 ? listNoti.length : '99+'}
                  </S.OptionNotifyNumber>
                )}
              </Popover>
            </S.OptionNotifyWrapper>
            <S.OptionSetting onClick={() => setSettingModal(true)} />
            <SettingsModal
              onClose={() => setSettingModal(false)}
              open={settingModal}
            />
            <S.OptionLogOut onClick={() => logout()} />
          </S.Option>
        </S.RightWrapper>
        <UserInfo
          open={modalUser}
          closeModal={() => setModalUser(false)}
          friendProfile={friendProfile}
        />
      </S.Wrapper>
    </S.Container>
  );
};

export default TopBar;
