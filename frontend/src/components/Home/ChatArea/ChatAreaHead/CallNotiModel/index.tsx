import Image from 'next/image';
import * as S from './CallNotiModel.styled';
import { FaPhoneAlt, FaPhoneSlash } from 'react-icons/fa';
import { popupCallWindow } from '../../../../Global/ProcessFunctions';
import { useSelector } from 'react-redux';
import { selectFriendListState } from '../../../../../features/redux/slices/friendListSlice';
import { selectUserState } from '../../../../../features/redux/slices/userSlice';

interface ICallNoti {
  setReceiveCall: (toggle: boolean) => void;
  callInfo: {
    meetingId: string;
    callerId: string;
  };
}

const CallNotiModel = ({ setReceiveCall, callInfo }: ICallNoti) => {
  const friends = useSelector(selectFriendListState);
  const user = useSelector(selectUserState);

  const caller = friends.list.find((fr) => fr._id === callInfo.callerId);

  return (
    <S.CallNotiModal>
      <S.CallNotiOverlay onClick={() => setReceiveCall(false)} />
      <S.CallNotiBody>
        <S.CallNotiInfo>
          <S.CallNotiLabel>You receiving a call from</S.CallNotiLabel>
          <S.CallNotiAvatar>
            <Image src={caller.avatar} alt="avatar caller" layout="fill" />
          </S.CallNotiAvatar>
          <S.CallNotiCallerName>{caller.name}</S.CallNotiCallerName>
        </S.CallNotiInfo>
        <S.CallNotiControls>
          <S.CallNotiDecline
            onClick={() => {
              setReceiveCall(false);
            }}
          >
            <FaPhoneSlash />
            Decline
          </S.CallNotiDecline>
          <S.CallNotiAccept
            onClick={() => {
              popupCallWindow(
                `${document.URL}/video-call?meetingId=${callInfo.meetingId}&name=${user.info.name}`,
                'Call from Chatala',
                1200,
                700
              );
              setReceiveCall(false);
            }}
          >
            <FaPhoneAlt />
            Accept
          </S.CallNotiAccept>
        </S.CallNotiControls>
      </S.CallNotiBody>
    </S.CallNotiModal>
  );
};

export default CallNotiModel;
