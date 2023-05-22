import * as S from './ShowFriends.styled';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { selectFriendListState } from '../../../../../features/redux/slices/friendListSlice';
import UserInfo from '../../../TopBar/UserInfo';
import { userInfo } from '../../../../../utils/types';
import { Modal } from 'antd';

interface IShowFriends {
  onClose: () => void;
  open: boolean;
}

const ShowFriends = ({ onClose, open }: IShowFriends) => {
  const friends = useSelector(selectFriendListState);

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

  return (
    <Modal
      title='Your Friends'
      open={open}
      onOk={onClose}
      onCancel={onClose}
      okButtonProps={{ style: { display: 'none' } }}
      cancelText='OK'
    >
      <S.ShowFriendsSearch>
        <S.ShowFriendsSearchIcon />
        <S.ShowFriendsSearchInput placeholder='Search with name or phone number...' />
      </S.ShowFriendsSearch>
      <S.FriendList>
        {friends.list.map((data, index) => (
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
        ))}
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
