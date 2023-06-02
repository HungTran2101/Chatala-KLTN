import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFriendListState } from '../../../../../features/redux/slices/friendListSlice';
import { roomListActions } from '../../../../../features/redux/slices/roomListSlice';
import { RoomApi } from '../../../../../services/api/room';
import { CreateGroupArray } from '../../../../../utils/dataConfig';
import { friendInfo, userInfo } from '../../../../../utils/types';
import UserInfo from '../../../TopBar/UserInfo';
import * as S from './CreateGroup.styled';
import { Modal, Button as AntButton, message } from 'antd';
import Button from '../../../../Global/Button';
import { selectUtilState } from '../../../../../features/redux/slices/utilSlice';
import { debounce } from 'lodash';
import { FriendApi } from '../../../../../services/api/friend';

interface ICreateGroup {
  onClose: () => void;
  open: boolean;
}

type userToAdd = {
  uid: string;
  nickname: string;
};

const CreateGroup = ({ open, onClose }: ICreateGroup) => {
  const dispatch = useDispatch();

  const [addedUsers, setAddedUsers] = useState<userInfo[]>([]);
  // const [toggleFriendProfile, setToggleFriendProfile] = useState(false);
  const [friendProfile, setFriendProfile] = useState<userInfo>();

  const friends = useSelector(selectFriendListState);
  const UIText = useSelector(selectUtilState).UIText;

  const showFriendProfile = (data: userInfo) => {
    showModalUser();
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
          message.success(UIText.messageNoti.createGroupSuccess);
          onClose();
        }
      } catch (err: any) {
        console.log(err);
        if (err?.error.statusCode === 400) {
          message.error(err?.message);
        }
      }
    } else {
      message.error('Cannot create group with 2 member!');
    }
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
      title={UIText.sideBar.topNav.createGroup.title}
      open={open}
      onOk={() => {
        createGroup();
        onClose();
      }}
      onCancel={onClose}
      okType='default'
      okText={UIText.sideBar.topNav.createGroup.confirm}
      cancelText={UIText.sideBar.topNav.createGroup.cancel}
      okButtonProps={{ disabled: addedUsers.length > 0 ? false : true }}
    >
      <S.CreateGroupSearch noAdded={addedUsers.length > 0 ? false : true}>
        <S.CreateGroupSearchIcon />
        <S.CreateGroupSearchInput
          placeholder={UIText.sideBar.topNav.createGroup.searchPlaceholder}
          noAdded={addedUsers.length > 0 ? false : true}
          onChange={debouncedOnChange}
        />
      </S.CreateGroupSearch>
      {addedUsers.length > 0 && (
        <S.CreateGroupAddedUsers>
          <S.CreateGroupAddedUsersInner>
            {addedUsers.map((data, index) => (
              <S.CreateGroupAddedUser key={index}>
                <S.CreateGroupAddedUserAvatar>
                  <Image src={data.avatar} layout='fill' />
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
        </S.CreateGroupAddedUsers>
      )}
      <S.GreateGroupList>
        {friendList?.length ? (
          friendList.map((data, index) => (
            <S.CreateGroupItem key={index}>
              <S.CreateGroupInfo onClick={() => showFriendProfile(data)}>
                <S.CreateGroupAvatar>
                  <Image
                    src={data.avatar}
                    alt='avatar'
                    layout='fill'
                    objectFit='cover'
                  />
                </S.CreateGroupAvatar>
                <div>
                  <S.CreateGroupName>{data.name}</S.CreateGroupName>
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
              </S.CreateGroupInfo>
              {/* {addedUsers.some((user) => user._id === data._id) ? (
              <S.CreateGroupAdded>Added</S.CreateGroupAdded>
            ) : ( */}
              <Button
                variant='blue'
                disabled={
                  addedUsers.some((user) => user._id === data._id)
                    ? true
                    : false
                }
                onClick={() => addUserToGroup(data)}
              >
                + {UIText.sideBar.topNav.createGroup.addbutton}
              </Button>
              {/* )} */}
            </S.CreateGroupItem>
          ))
        ) : (
          <p>No friend available</p>
        )}
      </S.GreateGroupList>
      <UserInfo
        friendProfile={friendProfile}
        open={modalUser}
        closeModal={closeModalUser}
      />
    </Modal>
  );
};

export default CreateGroup;
