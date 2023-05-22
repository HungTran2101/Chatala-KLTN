import Image from 'next/image';
import * as S from './CallNotiModal.styled';
import { useState, useEffect } from 'react';
import { FaPhoneAlt, FaPhoneSlash } from 'react-icons/fa';
import { popupCallWindow } from '../../../../Global/ProcessFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { selectFriendListState } from '../../../../../features/redux/slices/friendListSlice';
import { selectUserState } from '../../../../../features/redux/slices/userSlice';
import { CallApi } from '../../../../../services/api/call';
import { useSocketContext } from '../../../../../contexts/socket';
import { utilActions } from '../../../../../features/redux/slices/utilSlice';

interface ICallNoti {
  setCallNotiShow: (toggle: boolean) => void;
  callInfo: {
    meetingId?: string;
    callerId?: string;
    avatar?: string;
    receiverIds?: string;
    name?: string;
    isCaller: boolean;
  };
}

const CallNotiModal = ({ setCallNotiShow, callInfo }: ICallNoti) => {
  const friends = useSelector(selectFriendListState);
  const user = useSelector(selectUserState);

  const socket = useSocketContext();
  const dispatch = useDispatch();

  const [token, setToken] = useState(null);

  const caller = friends.list.find((fr) => fr._id === callInfo.callerId);

  const getToken = async () => {
    const callToken = await CallApi.getToken();
    setToken(callToken);
  };

  const getMeetingId = async () => {
    const meetingId = await CallApi.createMeeting(token);
    console.log('makecall', meetingId);
    socket.emit('makecall', {
      meetingId,
      callerId: callInfo.callerId,
      receiverIds: callInfo.receiverIds,
    });
  };

  const joinMeeting = async () => {
    const res = await CallApi.validateMeeting(callInfo.meetingId, token);
  };

  const cancelCall = async () => {
    socket.emit('cancelCall', {
      receiverIds: callInfo.receiverIds,
    });
    setCallNotiShow(false);
  };

  const declineCall = () => {
    socket.emit('declineCall', {
      callerId: callInfo.callerId,
    });
    setCallNotiShow(false);
  };

  const acceptCall = async (meetingId?: string) => {
    if (!callInfo.isCaller) {
      await joinMeeting();

      socket.emit('acceptCall', {
        callerId: callInfo.callerId,
        meetingId: callInfo.meetingId,
      });
    }

    popupCallWindow(
      `${document.URL}/video-call?meetingId=${
        callInfo.isCaller ? meetingId : callInfo.meetingId
      }&name=${user.info.name}&token=${token}`,
      'Call from Chatala',
      1200,
      700
    );
    setCallNotiShow(false);
  };

  useEffect(() => {
    console.log('callInfo', callInfo);
    getToken();
    socket.on('callCanceled', () => {
      setCallNotiShow(false);
    });
    socket.on('callDeclined', () => {
      setCallNotiShow(false);
    })
  }, []);

  useEffect(() => {
    if (token && callInfo.isCaller) {
      getMeetingId();
      socket.on('callaccepted', ({ meetingId }) => {
        console.log('callaccepted', meetingId);
        acceptCall(meetingId);
      });
    }

    return () => {
      socket.off('callaccepted');
    };
  }, [token]);

  return (
    <S.CallNotiModal>
      <S.CallNotiOverlay />
      <S.CallNotiBody makecall={callInfo.isCaller ? 1 : 0}>
        {/* <audio src="/ringtone.mp3" loop autoPlay /> */}
        <S.CallNotiInfo>
          <S.CallNotiLabel>
            {callInfo.isCaller
              ? 'You are calling'
              : 'You receiving a call from'}
          </S.CallNotiLabel>
          {(callInfo.avatar || caller) && (
            <S.CallNotiAvatar>
              <Image
                src={callInfo.isCaller ? callInfo.avatar : caller.avatar}
                alt="avatar caller"
                layout="fill"
              />
            </S.CallNotiAvatar>
          )}
          <S.CallNotiCallerName>
            {callInfo.isCaller ? callInfo.name : caller.name}
          </S.CallNotiCallerName>
        </S.CallNotiInfo>
        <S.CallNotiControls>
          {!callInfo.isCaller ? (
            <>
              <S.CallNotiDecline onClick={() => declineCall()}>
                <FaPhoneSlash />
                Decline
              </S.CallNotiDecline>
              <S.CallNotiAccept onClick={() => acceptCall()}>
                <FaPhoneAlt />
                Accept
              </S.CallNotiAccept>
            </>
          ) : (
            <S.CallNotiDecline onClick={() => cancelCall()}>
              <FaPhoneSlash />
              Cancel
            </S.CallNotiDecline>
          )}
        </S.CallNotiControls>
      </S.CallNotiBody>
    </S.CallNotiModal>
  );
};

export default CallNotiModal;
