import Image from 'next/image';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectRoomInfoState } from '../../../../../features/redux/slices/roomInfoSlice';
import { UsersApi } from '../../../../../services/api/users';
import { roomInfo, roomUser, userInfo } from '../../../../../utils/types';
import UserInfo from '../../../TopBar/UserInfo';
import NicknameModal from '../NicknameModal';
import * as S from './GroupMembers.styled';

interface IGroupMembers {
  setToggleGroupMembers: (toggle: boolean) => void;
  roomInfo: roomInfo;
}

const GroupMembers = ({ setToggleGroupMembers, roomInfo }: IGroupMembers) => {
  const [friendProfile, setFriendProfile] = useState<userInfo>();
  // const [toggleFriendProfile, setToggleFriendProfile] = useState(false);
  const [toggleNickname, setToggleNickname] = useState(false);
  const [userNeedChange, setUserNeedChange] = useState<roomUser>();

  const activeUsers = []
  roomInfo.roomInfo.users.forEach(u => !u.isLeave && activeUsers.push(u))

  const seeFriendProfile = async (uid: string) => {
    const friend = await UsersApi.userFindById(uid);
    setFriendProfile(friend);
    showModalUser();
  };

  const changeNicknameClicked = (data: roomUser) => {
    setUserNeedChange(data);
    setToggleNickname(true);
  };

  const [modalUser, setModalUser] = useState(false);
  const showModalUser = () => {
    setModalUser(true);
  };
  const closeModalUser = () => {
    setModalUser(false);
  };

  return (
    <S.GroupMembersModal>
      <S.GroupMembersOverlay onClick={() => setToggleGroupMembers(false)} />
      <S.GroupMembersBody>
        <S.GroupMembersTitle>Group Members</S.GroupMembersTitle>
        <S.GroupMembersSearch>
          <S.GroupMembersSearchIcon />
          <S.GroupMembersSearchInput placeholder='Search with name or phone number...' />
        </S.GroupMembersSearch>
        <S.GroupMembersList>
          {activeUsers.map((data, index) => (
            <S.GroupMembersItem key={index}>
              <S.GroupMembersInfo onClick={() => seeFriendProfile(data.uid)}>
                <S.GroupMembersAvatar>
                  <Image
                    src={data.avatar}
                    alt='avatar'
                    layout='fill'
                    objectFit='cover'
                  />
                </S.GroupMembersAvatar>
                <S.GroupMembersName>{data.nickname}</S.GroupMembersName>
              </S.GroupMembersInfo>
              <S.GroupMembersChangeNickname
                onClick={() => changeNicknameClicked(data)}
              >
                Change nickname
              </S.GroupMembersChangeNickname>
            </S.GroupMembersItem>
          ))}
        </S.GroupMembersList>
        <UserInfo
          friendProfile={friendProfile}
          open={modalUser}
          closeModal={closeModalUser}
        />
        {toggleNickname && (
          <NicknameModal
            setToggleNickname={setToggleNickname}
            roomInfo={roomInfo}
            userNeedChange={userNeedChange}
          />
        )}
      </S.GroupMembersBody>
    </S.GroupMembersModal>
  );
};

export default GroupMembers;
