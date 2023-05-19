import Image from 'next/image';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFriendListState } from '../../../../../features/redux/slices/friendListSlice';
import { roomListActions } from '../../../../../features/redux/slices/roomListSlice';
import { RoomApi } from '../../../../../services/api/room';
import { CreateGroupArray } from '../../../../../utils/dataConfig';
import { userInfo } from '../../../../../utils/types';
import UserInfo from '../../../TopBar/UserInfo';
import * as S from './CreateGroup.styled';

interface ICreateGroup {
  setToggleCreateGroup: (toggle: boolean) => void;
}

type userToAdd = {
  uid: string;
  nickname: string;
};

const CreateGroup = ({ setToggleCreateGroup }: ICreateGroup) => {
  const dispatch = useDispatch();

  const [addedUsers, setAddedUsers] = useState<userInfo[]>([]);
  const [toggleFriendProfile, setToggleFriendProfile] = useState(false);
  const [friendProfile, setFriendProfile] = useState<userInfo>();

  const friends = useSelector(selectFriendListState);

  const showFriendProfile = (data: userInfo) => {
    setToggleFriendProfile(true);
    setFriendProfile(data);
  };

  const addUserToGroup = (data: userInfo) => {
    if (addedUsers.every((user) => user._id !== data._id)) {
      setAddedUsers([...addedUsers, data]);
    }
  };

  const removeUserToGroup = (index: number) => {
    const temp = addedUsers;
    temp.splice(index, 1);
    setAddedUsers([...temp]);
  };

  const createGroup = async () => {
    if (addedUsers.length > 1) {
      const users: userToAdd[] = [];
      addedUsers.forEach((user) => {
        users.push({
          uid: user._id,
          nickname: user.name,
        });
      });

      try {
        const createdRoom = await RoomApi.createRoom({ users, isGroup: true });
        if (createdRoom) {
          const rooms = await RoomApi.getRoomList();
          dispatch(roomListActions.setRoomList(rooms.result));
          setToggleCreateGroup(false);
        }
      } catch (err: any) {
        console.log(err);
        if (err?.error.statusCode === 400) {
          alert(err?.message);
        }
      }
    } else {
      alert('Cannot create group with 2 member!');
    }
  };

  return (
    <S.CreateGroupModal>
      <S.CreateGroupOverlay onClick={() => setToggleCreateGroup(false)} />
      <S.CreateGroupBody>
        <S.CreateGroupTitle>Creating Group Chat</S.CreateGroupTitle>
        <S.CreateGroupSearch>
          <S.CreateGroupSearchIcon />
          <S.CreateGroupSearchInput placeholder="Search with name or phone number..." />
        </S.CreateGroupSearch>
        {addedUsers.length > 0 && (
          <S.CreateGroupAddedUsers>
            <S.CreateGroupAddedUsersInner>
              {addedUsers.map((data, index) => (
                <S.CreateGroupAddedUser key={index}>
                  <S.CreateGroupAddedUserAvatar>
                    <Image src={data.avatar} layout="fill" />
                  </S.CreateGroupAddedUserAvatar>
                  <S.CreateGroupAddedUserName>
                    {data.name}
                  </S.CreateGroupAddedUserName>
                  <S.CreateGroupAddedUserRemove
                    onClick={() => removeUserToGroup(index)}
                  />
                </S.CreateGroupAddedUser>
              ))}
            </S.CreateGroupAddedUsersInner>
            <S.CreateGroupSubmit onClick={createGroup}>
              Create
            </S.CreateGroupSubmit>
          </S.CreateGroupAddedUsers>
        )}
        <S.GreateGroupList>
          {friends.list.map((data, index) => (
            <S.CreateGroupItem key={index}>
              <S.CreateGroupInfo onClick={() => showFriendProfile(data)}>
                <S.CreateGroupAvatar>
                  <Image
                    src={data.avatar}
                    alt="avatar"
                    layout="fill"
                    objectFit="cover"
                  />
                </S.CreateGroupAvatar>
                <S.CreateGroupName>{data.name}</S.CreateGroupName>
              </S.CreateGroupInfo>
              {addedUsers.some((user) => user._id === data._id) ? (
                <S.CreateGroupAdded>Added</S.CreateGroupAdded>
              ) : (
                <S.CreateGroupAdd onClick={() => addUserToGroup(data)}>
                  Add
                </S.CreateGroupAdd>
              )}
            </S.CreateGroupItem>
          ))}
        </S.GreateGroupList>
        {toggleFriendProfile && (
          <UserInfo
            friendProfile={friendProfile}
            setUserInfoModal={setToggleFriendProfile}
          />
        )}
      </S.CreateGroupBody>
    </S.CreateGroupModal>
  );
};

export default CreateGroup;
