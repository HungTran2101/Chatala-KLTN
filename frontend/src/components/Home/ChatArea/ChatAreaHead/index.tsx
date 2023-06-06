import Image from 'next/image';
import * as S from './ChatAreaHead.styled';
import { useSelector } from 'react-redux';
import { selectRoomInfoState } from '../../../../features/redux/slices/roomInfoSlice';
import { useEffect, useState } from 'react';
import { selectRoomListState } from '../../../../features/redux/slices/roomListSlice';
import { selectUserState } from '../../../../features/redux/slices/userSlice';
import CallNotiModal from './CallNotiModal';
import { selectUtilState } from '../../../../features/redux/slices/utilSlice';

interface IChatAreaHead {
  setToggleOption: () => void;
  isUnfriend: boolean;
}

const ChatAreaHead = ({ setToggleOption, isUnfriend }: IChatAreaHead) => {
  const roomInfo = useSelector(selectRoomInfoState);
  const roomList = useSelector(selectRoomListState);
  const user = useSelector(selectUserState);
  const UIText = useSelector(selectUtilState).UIText.chatArea;

  const activeAvatar = [];
  roomInfo.info.roomInfo.users.forEach((u) => {
    if (!u.isLeave) activeAvatar.push(u.avatar);
  });

  const [status, setStatus] = useState(1);
  const [makingACall, setMakingACall] = useState(false);
  const [callInfo, setCallInfo] = useState<{
    avatar?: string;
    name?: string;
    receiverIds?: string;
    callerName?: string;
    callerAvatar?: string;
    callerId?: string;
    isCaller: boolean;
    isGroup: boolean;
  }>();

  //Handle status
  useEffect(() => {
    const handleStatus = () => {
      const roomSelectedIndex = roomList.list.findIndex(
        (room) => room.roomInfo._id === roomInfo.info?.roomInfo._id
      );
      setStatus(roomList.activeList[roomSelectedIndex]);
    };
    handleStatus();
  }, [roomList.activeList, roomInfo.info]);

  const getReceiverIds = () => {
    const users = roomInfo.info.roomInfo.users.filter(
      (u) => u.uid !== user.info._id
    );
    const receiverIds = [];
    users.forEach((u) => receiverIds.push(u.uid));
    return receiverIds.toString();
  };

  const makeCall = () => {
    // if (!utils.onCall) {
    if (roomInfo.info.roomInfo.isGroup) {
      setCallInfo({
        name: roomInfo.info.roomName,
        callerName: roomInfo.info.roomName,
        receiverIds: getReceiverIds(),
        callerId: user.info._id,
        isCaller: true,
        isGroup: true,
      });
    } else {
      setCallInfo({
        name: roomInfo.info.roomName,
        avatar: roomInfo.info.roomAvatar,
        receiverIds: getReceiverIds(),
        callerName: user.info.name,
        callerAvatar: user.info.avatar,
        callerId: user.info._id,
        isCaller: true,
        isGroup: false,
      });
    }
    setMakingACall(true);
    // socket.emit('makecall', {})
    // } else {
    //   alert('You are on a call');
    // }
  };

  return (
    <S.ChatAreaHead>
      <S.ChatAreaHeadInfo>
        {roomInfo.info?.roomInfo.isGroup ? (
          <S.ChatAreaHeadAvatar isGroup={1}>
            {activeAvatar.map(
              (url, index) =>
                index <= 3 && (
                  <S.ChatAvatarGroup key={index}>
                    <Image src={url} alt="avatar" layout="fill" />
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
              {status ? UIText.online : UIText.offline}
              <S.ChatAreaHeadStatusIcon status={status} />
            </S.ChatAreaHeadStatus>
          )}
        </S.ChatAreaHeadNameWrapper>
      </S.ChatAreaHeadInfo>
      <S.RightWrap>
        {!isUnfriend && <S.CallButton onClick={() => makeCall()} />}
        <S.ChatAreaHeadOption onClick={() => setToggleOption()} />
      </S.RightWrap>
      {makingACall && (
        <CallNotiModal setCallNotiShow={setMakingACall} callInfo={callInfo} />
      )}
    </S.ChatAreaHead>
  );
};

export default ChatAreaHead;
