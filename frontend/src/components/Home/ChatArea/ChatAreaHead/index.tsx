import Image from 'next/image';
import * as S from './ChatAreaHead.styled';
import { useSelector } from 'react-redux';
import { selectRoomInfoState } from '../../../../features/redux/slices/roomInfoSlice';
import { useEffect, useState } from 'react';
import { selectRoomListState } from '../../../../features/redux/slices/roomListSlice';
import { popupCallWindow } from '../../../Global/ProcessFunctions';
import { selectUserState } from '../../../../features/redux/slices/userSlice';

interface IChatAreaHead {
  setToggleOption: (value: boolean) => void;
}

const ChatAreaHead = ({ setToggleOption }: IChatAreaHead) => {
  const roomInfo = useSelector(selectRoomInfoState);
  const roomList = useSelector(selectRoomListState);
  const user = useSelector(selectUserState);
  const [status, setStatus] = useState(1);

  //Handle status
  const handleStatus = () => {
    const roomSelectedIndex = roomList.list.findIndex(
      (room) => room.roomInfo._id === roomInfo.info?.roomInfo._id
    );
    setStatus(roomList.activeList[roomSelectedIndex]);
  };
  useEffect(() => {
    handleStatus();
  }, [roomList.activeList, roomInfo.info]);

  const getReceiverId = () => {
    const users = roomInfo.info.roomInfo.users.filter(
      (u) => u.uid !== user.info._id
    );
    const receiverIds = [];
    users.forEach((u) => receiverIds.push(u.uid));
    return receiverIds.toString();
  };

  return (
    <S.ChatAreaHead>
      <S.ChatAreaHeadInfo>
        {roomInfo.info?.roomInfo.isGroup ? (
          <S.ChatAreaHeadAvatar isGroup={1}>
            {roomInfo.info.roomInfo.users.map(
              (user, index) =>
                index <= 3 && (
                  <S.ChatAvatarGroup key={index}>
                    <Image src={user.avatar} alt="avatar" layout="fill" />
                  </S.ChatAvatarGroup>
                )
            )}
          </S.ChatAreaHeadAvatar>
        ) : (
          <S.ChatAreaHeadAvatar>
            <Image
              src={roomInfo.info!.roomAvatar}
              alt="avatar"
              layout="fill"
              objectFit="cover"
            />
          </S.ChatAreaHeadAvatar>
        )}
        <S.ChatAreaHeadNameWrapper>
          <S.ChatAreaHeadName>
            {roomInfo.info?.roomInfo.isGroup
              ? roomInfo.info.roomInfo.groupName
              : roomInfo.info?.roomName}
          </S.ChatAreaHeadName>
          {!roomInfo.info?.roomInfo.isGroup && (
            <S.ChatAreaHeadStatus>
              {status ? 'Online' : 'Offline'}
              <S.ChatAreaHeadStatusIcon status={status} />
            </S.ChatAreaHeadStatus>
          )}
        </S.ChatAreaHeadNameWrapper>
      </S.ChatAreaHeadInfo>
      <S.RightWrap>
        <S.CallButton
          onClick={() =>
            popupCallWindow(
              `${document.URL}video-call?callerId=${
                user.info._id
              }&name=${user.info.name}&receiverIds=${getReceiverId()}`,
              'Call from Chatala',
              1200,
              700
            )
          }
        />
        <S.ChatAreaHeadOption onClick={() => setToggleOption(true)} />
      </S.RightWrap>
    </S.ChatAreaHead>
  );
};

export default ChatAreaHead;
