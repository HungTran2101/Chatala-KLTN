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
import {
  selectUtilState,
  utilActions,
} from '../../../../../features/redux/slices/utilSlice';
import { message } from 'antd';

interface ICallNoti {
  setCallNotiShow: (toggle: boolean) => void;
  callInfo: {
    meetingId?: string;
    avatar?: string;
    receiverIds?: string;
    name?: string;
    callerId?: string;
    callerName?: string;
    callerAvatar?: string;
    isCaller: boolean;
    isGroup: boolean;
  };
}

const CallNotiModal = ({ setCallNotiShow, callInfo }: ICallNoti) => {
  const friends = useSelector(selectFriendListState);
  const user = useSelector(selectUserState);
  const UIText = useSelector(selectUtilState).UIText;

  const socket = useSocketContext();
  const dispatch = useDispatch();

  const [token, setToken] = useState(null);

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
      callerAvatar: callInfo.callerAvatar,
      receiverIds: callInfo.receiverIds,
      callerName: callInfo.callerName,
      isGroup: callInfo.isGroup,
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
      message.info(`${callInfo.name} ${UIText.messageNoti.declineCall}`);
      setCallNotiShow(false);
    });

    var callingTimeout = null;
    if (callInfo.isCaller) {
      callingTimeout = setTimeout(() => {
        message.info(`${callInfo.name} ${UIText.messageNoti.missedCall}`);
        cancelCall();
      }, 1000 * 45);
    }

    return () => {
      socket.off('callCanceled');
      socket.off('callDeclined');
      clearTimeout(callingTimeout);
    };
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
        <audio src="/ringtone.mp3" loop autoPlay />
        <S.CallNotiInfo>
          <S.CallNotiLabel>
            {callInfo.isCaller
              ? UIText.chatArea.callLabel
              : UIText.chatArea.receiveCallLabel}
          </S.CallNotiLabel>
          {!callInfo.isGroup && (
            <S.CallNotiAvatar>
              <Image
                src={
                  callInfo.isCaller ? callInfo.avatar : callInfo.callerAvatar
                }
                alt="avatar caller"
                layout="fill"
              />
            </S.CallNotiAvatar>
          )}
          <S.CallNotiCallerName>
            {callInfo.isCaller ? callInfo.name : callInfo.callerName}
          </S.CallNotiCallerName>
        </S.CallNotiInfo>
        <S.CallNotiControls>
          {!callInfo.isCaller ? (
            <>
              <S.CallNotiDecline onClick={() => declineCall()}>
                <FaPhoneSlash />
                {UIText.chatArea.callDecline}
              </S.CallNotiDecline>
              <S.CallNotiAccept onClick={() => acceptCall()}>
                <FaPhoneAlt />
                {UIText.chatArea.callAccept}
              </S.CallNotiAccept>
            </>
          ) : (
            <S.CallNotiDecline onClick={() => cancelCall()}>
              <FaPhoneSlash />
              {UIText.chatArea.callCancel}
            </S.CallNotiDecline>
          )}
        </S.CallNotiControls>
      </S.CallNotiBody>
    </S.CallNotiModal>
  );
};

export default CallNotiModal;
