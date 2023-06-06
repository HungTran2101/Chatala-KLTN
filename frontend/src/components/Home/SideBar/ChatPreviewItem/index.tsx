import Image from 'next/image';
import * as S from './ChatPreviewItem.styled';
import { roomInfo } from '../../../../utils/types';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../../../features/redux/slices/userSlice';
import { FaPhoneAlt } from 'react-icons/fa';

interface IChatPreviewItem {
  active: boolean;
  roomInfo: roomInfo;
  status: number;
  onClick: () => void;
}

const ChatPreviewItem = ({
  active,
  roomInfo,
  status,
  onClick,
}: IChatPreviewItem) => {
  const user = useSelector(selectUserState);

  const activeAvatar = [];
  roomInfo.roomInfo.users.forEach((u) => {
    if (!u.isLeave) activeAvatar.push(u.avatar);
  });

  const unReadMsgNumber = roomInfo.roomInfo.users.find(
    (u) => u.uid === user.info._id
  )?.unReadMsg;

  return (
    <S.ChatPreviewItem
      active={active}
      unReadMsg={unReadMsgNumber || 0}
      onClick={onClick}
    >
      <S.Wrapper>
        <S.ChatAvatarWrapper>
          {roomInfo.roomAvatar ? (
            <>
              <S.ChatAvatar>
                <Image
                  src={roomInfo.roomAvatar}
                  alt='avatar'
                  layout='fill'
                  objectFit='cover'
                />
              </S.ChatAvatar>
              {!roomInfo.roomInfo.isGroup && <S.ChatStatus status={status} />}
            </>
          ) : (
            <S.ChatAvatar isGroup={1}>
              {activeAvatar.map(
                (data, index) =>
                  index <= 3 && (
                    <S.ChatAvatarGroup key={index}>
                      <Image src={data} alt='avatar' layout='fill' />
                    </S.ChatAvatarGroup>
                  )
              )}
            </S.ChatAvatar>
          )}
        </S.ChatAvatarWrapper>
        <S.Content>
          <S.Name>{roomInfo.roomName}</S.Name>
          <S.Msg semibold={unReadMsgNumber >= 1}>
            {roomInfo.roomInfo.lastMsg}
          </S.Msg>
        </S.Content>
      </S.Wrapper>
      {unReadMsgNumber >= 1 && (
        <S.UnReadMsgNoti>
          {unReadMsgNumber < 100 ? unReadMsgNumber : '99+'}
        </S.UnReadMsgNoti>
      )}
      {roomInfo.roomInfo.meetingId !== '' && (
        <FaPhoneAlt color='green' style={{ marginRight: '20px' }} />
      )}
    </S.ChatPreviewItem>
  );
};

export default ChatPreviewItem;
