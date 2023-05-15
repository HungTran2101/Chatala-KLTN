import Image from 'next/image';
import * as S from './ChatAreaHead.styled';
import { useSelector } from 'react-redux';
import { selectRoomInfoState } from '../../../../features/redux/slices/roomInfoSlice';
import { useEffect, useState } from 'react';
import { selectRoomListState } from '../../../../features/redux/slices/roomListSlice';
import { useRouter } from 'next/router';

interface IChatAreaHead {
  setToggleOption: (value: boolean) => void;
}

const ChatAreaHead = ({ setToggleOption }: IChatAreaHead) => {
  const roomInfo = useSelector(selectRoomInfoState);
  const roomList = useSelector(selectRoomListState);
  const [status, setStatus] = useState(1);
  const router = useRouter();

  //Handle status
  const handleStatus = () => {
    const roomSelectedIndex = roomList.list.findIndex(
      (room) => room.roomInfo._id === roomInfo.info?.roomInfo._id
    );
    setStatus(roomList.activeList[roomSelectedIndex]);
  };
  useEffect(() => {
    handleStatus();
  }, [roomList.activeList]);

  return (
    <S.ChatAreaHead>
      <S.ChatAreaHeadInfo>
        {roomInfo.info?.roomInfo.isGroup ? (
          <S.ChatAreaHeadAvatar isGroup={1}>
            {roomInfo.info.roomInfo.users.map(
              (user, index) =>
                index <= 3 && (
                  <S.ChatAvatarGroup key={index}>
                    <Image src={user.avatar} alt='avatar' layout='fill' />
                  </S.ChatAvatarGroup>
                )
            )}
          </S.ChatAreaHeadAvatar>
        ) : (
          <S.ChatAreaHeadAvatar>
            <Image
              src={roomInfo.info!.roomAvatar}
              alt='avatar'
              layout='fill'
              objectFit='cover'
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
            router.push({
              pathname: '/video-call',
              query: { action: 'create' },
            })
          }
        />
        <S.ChatAreaHeadOption onClick={() => setToggleOption(true)} />
      </S.RightWrap>
    </S.ChatAreaHead>
  );
};

export default ChatAreaHead;
