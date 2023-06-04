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
import {
  AutoComplete,
  Popconfirm,
  Popover,
  Select,
  SelectProps,
  message,
} from 'antd';
import { RoomApi } from '../../../services/api/room';
import { messageActions } from '../../../features/redux/slices/messageSlice';
import { fileActions } from '../../../features/redux/slices/fileSlice';
import { friendListActions } from '../../../features/redux/slices/friendListSlice';
import {
  selectUtilState,
  utilActions,
} from '../../../features/redux/slices/utilSlice';
import FriendRequestModal from './FriendRequestModal';

const TopBar = () => {
  // const [userInfoModal, setUserInfoModal] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [action, setAction] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const socket = useSocketContext();
  const user = useSelector(selectUserState);
  const roomInfo = useSelector(selectRoomInfoState);
  const UIText = useSelector(selectUtilState).UIText;

  const dispatch = useDispatch();
  const router = useRouter();

  const [listNoti, setListNoti] = useState([]);
  const [listFriendRequest, setListFriendRequest] = useState([]);
  const [unreadNoti, setUnreadNoti] = useState(0);

  const getLoggedUser = async () => {
    const result = await UsersApi.getLoggedUser();
    if (result) {
      dispatch(userActions.setUserInfo(result));
    }
  };

  const getListFriendRequest = async () => {
    const res = await FriendApi.friendRequestList();
    setListFriendRequest(res);
  };

  const getNotiList = async () => {
    const res = await FriendApi.notiList();
    setListNoti(res);
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
    getListFriendRequest();
    getNotiList();
    socket.on('receiveFriendRequest', () => {
      getListFriendRequest();
    });
    socket.on('friend noti', () => {
      getNotiList();
      getLoggedUser();
      setUnreadNoti((pre) => pre + 1);
    });
    socket.on('friend cancel', () => {
      getListFriendRequest();
    });
  }, []);

  useEffect(() => {
    //set unread Noti
    setUnreadNoti(user.info.unreadNoti);

    //set UI text base on locale
    dispatch(utilActions.setUIText({ locale: user.info.locale }));

    // @ts-ignore
    socket.emit('logged', user.info._id);
    socket.on('getUsers', (users) => {
      console.log('users', users);
      dispatch(
        roomListActions.setActiveRoom({ users, loggedUid: user.info._id })
      );
    });

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
            {UIText.topBar.search.modal.message}
          </S.SearchModalMessage>
        ) : data.status === 'receive' ? (
          <S.FlexWrap>
            <S.SearchModalAccept
              onClick={() =>
                friendAccept(data.notificationId, data._id, data.name)
              }
            >
              {UIText.topBar.search.modal.accept}
            </S.SearchModalAccept>
            <S.SearchModalDecline
              onClick={() => friendDecline(data.notificationId, data._id)}
            >
              {UIText.topBar.search.modal.decline}
            </S.SearchModalDecline>
          </S.FlexWrap>
        ) : data.status === 'request' ? (
          <>
            <S.SearchModalCancel
              onClick={() => cancelRequest(data.notificationId, data._id)}
            >
              {UIText.topBar.search.modal.cancel}
            </S.SearchModalCancel>
            <S.SearchModalPending>
              {UIText.topBar.search.modal.pending}
            </S.SearchModalPending>
          </>
        ) : (
          <S.SearchModalAddFriend onClick={() => friendRequest(data._id)}>
            {UIText.topBar.search.modal.addfriend}
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
      message.success(UIText.messageNoti.requestFriendSuccess);
      socket.emit('sendFriendRequest', id);
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
        socket.emit('friend noti', uid);
      }
      getListFriendRequest();
      message.success(UIText.messageNoti.acceptFriendSuccess);
    } catch (err) {
      console.log(err);
    }
  };

  const friendDecline = async (notificationId: string, uid: string) => {
    try {
      const res = await FriendApi.friendDecline(notificationId);
      getListFriendRequest();
      message.success(UIText.messageNoti.declineFriendSuccess);
      socket.emit('friend noti', uid);
      setAction(true);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelRequest = async (notificationId: string, uid: string) => {
    try {
      const res = await FriendApi.cancelRequest(notificationId);
      message.success(UIText.messageNoti.cancelRequestSuccess);
      socket.emit('friend cancel', uid);
      getListFriendRequest();
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

  const seenNoti = async (visible: boolean) => {
    if (visible) {
      const newUser = await UsersApi.seenNoti();
      setUnreadNoti(0);
    }
  };

  return (
    <>
      <S.Container>
        <S.Wrapper>
          <S.LeftWrapper onClick={() => showUserInfo()}>
            <S.Avatar>
              {user.info.avatar !== '' && (
                <Image
                  src={user.info.avatar}
                  alt="avatar"
                  layout="fill"
                  objectFit="cover"
                />
              )}
            </S.Avatar>
            <S.UserName>{user.info.name}</S.UserName>
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
                // dropdownMatchSelectWidth={500}
                style={{ width: '100%' }}
                options={options}
                notFoundContent={UIText.topBar.search.modal.loading}
                listHeight={500}
              >
                <S.SearchInput
                  placeholder={UIText.topBar.search.placeHolder}
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
              </AutoComplete>
            </S.Search>
            <S.Options>
              <S.OptionWrapper>
                <Popover
                  content={
                    <FriendRequestModal
                      listFriendRequest={listFriendRequest}
                      friendAccept={friendAccept}
                      friendDecline={friendDecline}
                    />
                  }
                  title={UIText.topBar.friendRequest.title}
                  trigger="click"
                  placement="bottomRight"
                  arrow={{ pointAtCenter: true }}
                >
                  <S.OptionFriendRequest />
                  {listFriendRequest.length > 0 && (
                    <S.OptionNumber number={listFriendRequest.length}>
                      {listFriendRequest.length < 100
                        ? listFriendRequest.length
                        : '99+'}
                    </S.OptionNumber>
                  )}
                </Popover>
              </S.OptionWrapper>
              <S.OptionWrapper>
                <Popover
                  content={
                    <NotiModal
                      listNoti={listNoti}
                      unreadNoti={user.info.unreadNoti}
                    />
                  }
                  title={UIText.topBar.noti.title}
                  trigger="click"
                  placement="bottomRight"
                  arrow={{ pointAtCenter: true }}
                  onOpenChange={seenNoti}
                >
                  <S.OptionNotify />
                  {unreadNoti > 0 && (
                    <S.OptionNumber number={unreadNoti}>
                      {unreadNoti < 100 ? unreadNoti : '99+'}
                    </S.OptionNumber>
                  )}
                </Popover>
              </S.OptionWrapper>
              <S.OptionSetting onClick={() => setSettingModal(true)} />
              <SettingsModal
                onClose={() => setSettingModal(false)}
                open={settingModal}
              />
              <S.OptionLogOut onClick={() => logout()} />
            </S.Options>
          </S.RightWrapper>
          <UserInfo
            open={modalUser}
            closeModal={() => setModalUser(false)}
            friendProfile={friendProfile}
          />
        </S.Wrapper>
      </S.Container>

      <S.Search mobile>
        <S.SearchIcon />
        <AutoComplete
          popupClassName="certain-category-search-dropdown"
          // dropdownMatchSelectWidth={500}
          style={{ width: '100%' }}
          options={options}
          notFoundContent={UIText.topBar.search.modal.loading}
          listHeight={500}
        >
          <S.SearchInput
            placeholder={UIText.topBar.search.placeHolder}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </AutoComplete>
      </S.Search>
    </>
  );
};

export default TopBar;
