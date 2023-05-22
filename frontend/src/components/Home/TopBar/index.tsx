import Image from 'next/image';
import * as S from './TopBar.styled';
import React, { useEffect, useState } from 'react';
import Logo from '../../../assets/imgs/LogoFullLong.png';
import UserInfo from './UserInfo';
import NotiModal from './NotiModal';
import SettingsModal from './SettingsModal';
import { UsersApi } from '../../../services/api/users';
import SearchModal from './SearchModal';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUserState,
  userActions,
} from '../../../features/redux/slices/userSlice';
import { useRouter } from 'next/router';
import { SearchResult } from '../../../utils/types';
import {
  roomInfoActions,
  selectRoomInfoState,
} from '../../../features/redux/slices/roomInfoSlice';
import { roomListActions } from '../../../features/redux/slices/roomListSlice';
import { FriendApi } from '../../../services/api/friend';
import { useSocketContext } from '../../../contexts/socket';
import { Popover } from 'antd';

const TopBar = () => {
  // const [userInfoModal, setUserInfoModal] = useState(false);
  const [activeNotiModal, setActiveNotiModal] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchModal, setSearchModal] = useState(false);
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
        setSearchModal(true);
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

  const showSettingModal = () => {
    setSettingModal(true);
  };

  const closeSettingModal = () => {
    setSettingModal(false);
  };

  const [modalUser, setModalUser] = useState(false);

  const showModalUser = () => {
    setModalUser(true);
  };

  const closeModalUser = () => {
    setModalUser(false);
  };

  return (
    <S.Container>
      <S.Wrapper>
        <S.LeftWrapper onClick={showModalUser}>
          <S.Avatar>
            {user.info?.avatar && user.info.avatar !== '' && (
              <Image
                src={user.info.avatar}
                alt='avatar'
                layout='fill'
                objectFit='cover'
              />
            )}
          </S.Avatar>
          <S.UserName>{user.info?.name}</S.UserName>
        </S.LeftWrapper>
        <S.RightWrapper>
          <S.LogoContainer>
            <S.Logo>
              <Image src={Logo} alt='logo' />
            </S.Logo>
          </S.LogoContainer>
          <S.Search>
            <S.SearchIcon />
            <S.SearchInput
              placeholder='Search...'
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              onFocus={() => setSearchModal(true)}
            />
            {searchModal && searchInput && (
              <SearchModal
                setSearchModal={setSearchModal}
                searchResult={searchResult}
                setAction={setAction}
                loading={searchLoading}
              />
            )}
          </S.Search>
          <S.Option>
            <S.OptionNotifyWrapper>
              <Popover
                content={
                  <NotiModal
                    listNoti={listNoti}
                    getListNotify={getListNotify}
                    setActiveNotiModal={setActiveNotiModal}
                  />
                }
                title='Friend request'
                trigger='click'
                placement='bottomRight'
              >
                <S.OptionNotify />
                {listNoti.length > 0 && (
                  <S.OptionNotifyNumber number={listNoti.length}>
                    {listNoti.length < 100 ? listNoti.length : '99+'}
                  </S.OptionNotifyNumber>
                )}
              </Popover>
            </S.OptionNotifyWrapper>
            {activeNotiModal && (
              <NotiModal
                listNoti={listNoti}
                getListNotify={getListNotify}
                setActiveNotiModal={setActiveNotiModal}
              />
            )}
            <S.OptionSetting onClick={showSettingModal} />
            <SettingsModal onClose={closeSettingModal} open={settingModal} />
            <S.OptionLogOut onClick={() => logout()} />
          </S.Option>
        </S.RightWrapper>
        <UserInfo open={modalUser} closeModal={closeModalUser} />
      </S.Wrapper>
    </S.Container>
  );
};

export default TopBar;
