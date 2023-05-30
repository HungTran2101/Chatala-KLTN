import Image from 'next/image';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  roomInfoActions,
  selectRoomInfoState,
} from '../../../../../features/redux/slices/roomInfoSlice';
import { UsersApi } from '../../../../../services/api/users';
import { roomInfo, roomUser, userInfo } from '../../../../../utils/types';
import UserInfo from '../../../TopBar/UserInfo';
import NicknameModal from '../NicknameModal';
import * as S from './GroupMembers.styled';
import { Button as AntButton, Modal, Popconfirm, message } from 'antd';
import { RoomApi } from '../../../../../services/api/room';
import { roomListActions } from '../../../../../features/redux/slices/roomListSlice';
import { socket } from '../../../../../contexts/socket';
import Button from '../../../../Global/Button';
import { GrUserAdmin } from 'react-icons/gr';
import { selectUtilState } from '../../../../../features/redux/slices/utilSlice';

interface IGroupMembers {
  open: boolean;
  closeModal: () => void;
  roomInfo: roomInfo;
  user: userInfo;
}

const GroupMembers = ({ open, closeModal, roomInfo, user }: IGroupMembers) => {
  const UIText =
    useSelector(selectUtilState).UIText;

  const [friendProfile, setFriendProfile] = useState<userInfo>();
  // const [toggleFriendProfile, setToggleFriendProfile] = useState(false);
  // const [toggleNickname, setToggleNickname] = useState(false);
  const [userNeedChange, setUserNeedChange] = useState<roomUser>();
  const [kickConfirm, setKickConfirm] = useState(-1);

  const activeUsers: roomUser[] = [];
  roomInfo.roomInfo.users.forEach((u) => !u.isLeave && activeUsers.push(u));

  const isLeader = roomInfo.roomInfo.users.find((u) => u.uid === user._id).role;

  const seeFriendProfile = async (uid: string) => {
    const friend = await UsersApi.userFindById(uid);
    setFriendProfile(friend);
    setModalUser(true);
  };

  const changeNicknameClicked = (data: roomUser) => {
    setUserNeedChange(data);
    setModalNickName(true);
  };

  const dispatch = useDispatch();
  const kickMember = async (data: roomUser) => {
    try {
      const res = await RoomApi.kickMember(roomInfo.roomInfo._id, data.uid);
      dispatch(roomInfoActions.kickMember({ uid: res.uid }));
      dispatch(
        roomListActions.updateRoomForKickMember({
          uid: res.uid,
          roomId: res.roomId,
        })
      );

      socket.emit('kickmember', { uid: res.uid, roomId: res.roomId });
      setKickConfirm(-1);

      message.success(UIText.messageNoti.kickFromGroupSuccess);
    } catch (err) {
      console.log(err);
      message.error(err);
    }
  };

  const [modalUser, setModalUser] = useState(false);
  const [modalNickName, setModalNickName] = useState(false);

  return (
    <Modal
      title={UIText.chatArea.moreOptions.groupMembers.label}
      open={open}
      onOk={closeModal}
      onCancel={closeModal}
      cancelButtonProps={{ style: { display: 'none' } }}
      okType="link"
      destroyOnClose
    >
      <S.GroupMembersSearch>
        <S.GroupMembersSearchIcon />
        <S.GroupMembersSearchInput placeholder={UIText.chatArea.moreOptions.groupMembers.searchPlaceholder} />
      </S.GroupMembersSearch>
      <S.GroupMembersList>
        {activeUsers.map((data, index) => (
          <S.GroupMembersItem key={index}>
            <S.GroupMembersInfo>
              <S.LeftWrap>
                <S.GroupMembersAvatar
                  onClick={() => seeFriendProfile(data.uid)}
                >
                  <Image
                    src={data.avatar}
                    alt="avatar"
                    layout="fill"
                    objectFit="cover"
                  />
                </S.GroupMembersAvatar>
                <div>
                  <S.GroupMembersName
                    onClick={() => seeFriendProfile(data.uid)}
                  >
                    {data.nickname}{' '}
                    {data.role && (
                      <GrUserAdmin
                        style={{ display: 'inline-block' }}
                        size={14}
                      />
                    )}
                  </S.GroupMembersName>
                  <AntButton
                    type="link"
                    onClick={() => changeNicknameClicked(data)}
                    style={{ fontStyle: 'italic', marginTop: '-10px' }}
                  >
                    {UIText.chatArea.moreOptions.groupMembers.nickname}
                  </AntButton>
                </div>
              </S.LeftWrap>

              {isLeader && data.uid !== user._id && (
                <Popconfirm
                  title={`${UIText.chatArea.moreOptions.groupMembers.titleConfirm} ${data.nickname}`}
                  description={UIText.chatArea.moreOptions.groupMembers.descriptionConfirm}
                  onConfirm={() => kickMember(data)}
                  open={kickConfirm === index}
                  onCancel={() => setKickConfirm(-1)}
                  okType="danger"
                  cancelText={UIText.chatArea.moreOptions.groupMembers.cancelConfirm}
                >
                  <Button onClick={() => setKickConfirm(index)}>
                    {UIText.chatArea.moreOptions.groupMembers.kick}
                  </Button>
                </Popconfirm>
              )}
            </S.GroupMembersInfo>
          </S.GroupMembersItem>
        ))}
      </S.GroupMembersList>
      <UserInfo
        friendProfile={friendProfile}
        open={modalUser}
        closeModal={() => setModalUser(false)}
      />
      <NicknameModal
        closeModal={() => setModalNickName(false)}
        open={modalNickName}
        roomInfo={roomInfo}
        userNeedChange={userNeedChange}
      />
    </Modal>
  );
};

export default GroupMembers;
