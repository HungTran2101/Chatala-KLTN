import * as S from './ShowFriends.styled';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { selectFriendListState } from '../../../../../features/redux/slices/friendListSlice';
import UserInfo from '../../../TopBar/UserInfo';
import { friendInfo, userInfo } from '../../../../../utils/types';
import { selectUtilState } from '../../../../../features/redux/slices/utilSlice';
import { FriendApi } from '../../../../../services/api/friend';
import { debounce } from 'lodash';
import { Button as AntButton, Modal } from 'antd';

interface IShowFriends {
  onClose: () => void;
  open: boolean;
}

const ShowFriends = ({ onClose, open }: IShowFriends) => {
  const friends = useSelector(selectFriendListState);
  const UIText = useSelector(selectUtilState).UIText.sideBar.topNav.friendList;

  // const [toggleFriendProfile, setToggleFriendProfile] = useState(false);
  const [friendProfile, setFriendProfile] = useState<userInfo>();

  const showFriendProfile = (data: userInfo) => {
    showModalUser();
    setFriendProfile(data);
  };

  const [modalUser, setModalUser] = useState(false);
  const showModalUser = () => {
    setModalUser(true);
  };
  const closeModalUser = () => {
    setModalUser(false);
  };

  const [listPage, setListPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState('');
  const checkScrollBottom = async (e: any) => {
    if (!searchInput) {
      const bottom =
        e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
      if (bottom) {
        console.log(bottom);
        setListPage(listPage + 1);
      }
    } else {
      // setListPage(listPage + 1);
    }
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const debouncedOnChange = debounce(onSearchChange, 500);

  const [friendList, setFriendList] = useState<friendInfo[]>(null);
  useEffect(() => {
    if (!searchInput) {
      const getFriendList = async () => {
        const res = await FriendApi.friendListLimit(listPage);
        if (res.length > 0) {
          if (listPage > 1 && friendList?.length) {
            setFriendList([...friendList, ...res]);
          } else {
            setFriendList(res);
          }
        }
        console.log(res);
      };
      getFriendList();
    } else {
      const getFriendList = async () => {
        const res = await FriendApi.search(searchInput);
        if (res.length > 0) {
          setFriendList(res);
        }
        console.log(res);
      };
      getFriendList();
    }
  }, [listPage, searchInput]);

  return (
    <Modal
      title={UIText.title}
      open={open}
      onOk={onClose}
      onCancel={onClose}
      okButtonProps={{ style: { display: 'none' } }}
      cancelText='OK'
    >
      <S.ShowFriendsSearch>
        <S.ShowFriendsSearchIcon />
        <S.ShowFriendsSearchInput
          placeholder={UIText.searchPlaceholder}
          onChange={debouncedOnChange}
        />
      </S.ShowFriendsSearch>
      <S.FriendList onScroll={checkScrollBottom}>
        {/* {friends.list.map((data, index) => (
          <S.ShowFriendsInfo
            key={index}
            onClick={() => showFriendProfile(data)}
          >
            <S.LeftWrap>
              <S.ShowFriendsAvatar>
                <Image
                  src={data.avatar}
                  alt='avatar'
                  layout='fill'
                  objectFit='cover'
                />
              </S.ShowFriendsAvatar>
              <S.ShowFriendsName>{data.name}</S.ShowFriendsName>
            </S.LeftWrap>
            <S.BackIcon />
          </S.ShowFriendsInfo>
        ))} */}
        {friendList?.length ? (
          friendList.map((data, index) => (
            <S.ShowFriendsInfo
              key={index}
              onClick={() => showFriendProfile(data)}
            >
              <S.LeftWrap>
                <S.ShowFriendsAvatar>
                  <Image
                    src={data.avatar}
                    alt='avatar'
                    layout='fill'
                    objectFit='cover'
                    loading='lazy'
                  />
                </S.ShowFriendsAvatar>
                <div>
                  <S.ShowFriendsName>{data.name}</S.ShowFriendsName>
                  <AntButton
                    type='link'
                    style={{
                      fontStyle: 'italic',
                      marginTop: '-10px',
                      pointerEvents: 'none',
                    }}
                  >
                    {data.phone}
                  </AntButton>
                </div>
              </S.LeftWrap>
              <S.BackIcon />
            </S.ShowFriendsInfo>
          ))
        ) : (
          <p>No friend available</p>
        )}
      </S.FriendList>
      <UserInfo
        friendProfile={friendProfile}
        open={modalUser}
        closeModal={closeModalUser}
      />
    </Modal>
  );
};

export default ShowFriends;
