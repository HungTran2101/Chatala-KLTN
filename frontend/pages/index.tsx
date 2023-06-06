import ChatArea from '../src/components/Home/ChatArea';
import * as S from '../src/components/Home/Home.styled';
import SideBar from '../src/components/Home/SideBar';
import TopBar from '../src/components/Home/TopBar';
import Welcome from '../src/components/Global/Welcome';
import { withRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RoomApi } from '../src/services/api/room';
import { useDispatch, useSelector } from 'react-redux';
import {
  roomListActions,
  selectRoomListState,
} from '../src/features/redux/slices/roomListSlice';
import {
  roomInfoActions,
  selectRoomInfoState,
} from '../src/features/redux/slices/roomInfoSlice';
import { messageActions } from '../src/features/redux/slices/messageSlice';
import { friendListActions } from '../src/features/redux/slices/friendListSlice';
import { FriendApi } from '../src/services/api/friend';
import { useSocketContext } from '../src/contexts/socket';
import CallNotiModel from '../src/components/Home/ChatArea/ChatAreaHead/CallNotiModal';
import { Button, Space, message, notification } from 'antd';

const Home = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const roomInfo = useSelector(selectRoomInfoState);
  const roomList = useSelector(selectRoomListState);

  const [callNotiShow, setCallNotiShow] = useState<boolean>(false);
  const [callInfo, setCallInfo] = useState<{
    meetingId: string;
    callerId: string;
    name?: string;
    avatar?: string;
    callerName?: string;
    callerAvatar?: string;
    isGroup: boolean;
    isCaller: boolean;
    roomId: string;
  }>(undefined);

  //socket client
  const socket = useSocketContext();

  useEffect(() => {
    // @ts-ignore
    socket.on('newLastMsg', (result) => {
      dispatch(roomListActions.setNewLastMsg(result));
    });
    socket.on('new room', () => {
      getRoomList();
      getFriendList();
    });
    socket.on('unfriended', () => {
      getFriendList();
    });
    socket.on('unsend msg', (msgId) => {
      dispatch(messageActions.unsend(msgId));
    });
    socket.on('delete msg', (msgId) => {
      dispatch(messageActions.delete(msgId));
    });
    socket.on('receiveCall', (callInfo) => {
      console.log('receiveCall', callInfo);
      setCallInfo({
        meetingId: callInfo.meetingId,
        callerId: callInfo.callerId,
        callerName: callInfo.callerName,
        callerAvatar: callInfo.callerAvatar,
        isGroup: callInfo.isGroup,
        isCaller: false,
        roomId: callInfo.roomId,
      });
      setCallNotiShow(true);
    });
    socket.on('endCall', async (roomId) => {
      const rooms = await RoomApi.getRoomList();
      dispatch(roomListActions.setRoomList(rooms.result));
      const room = rooms.result.find((r) => r.roomInfo._id === roomId);
      if (room) {
        dispatch(roomInfoActions.setRoomInfo(room));
      }
    });

    return () => {
      socket.off('newLastMsg');
      socket.off('new room');
      socket.off('unfriended');
      socket.off('unsend msg');
      socket.off('delete msg');
      socket.off('receiveCall');
      socket.off('endCall');
    };
  }, []);

  const closeNoti = () => {
    notification.destroy();
    router.replace('/login');
  };

  const openNoti = () => {
    const btn = (
      <Button size="small" type="link" onClick={() => closeNoti()}>
        Redirect me now
      </Button>
    );
    notification.warning({
      message: 'Your session is over, please login.',
      description: `Redirect in 5s...`,
      btn,
      duration: 5,
      placement: 'top',
      onClose: closeNoti,
    });
  };

  const getRoomList = async () => {
    try {
      const rooms = await RoomApi.getRoomList();
      dispatch(roomListActions.setRoomList(rooms.result));
    } catch (err: any) {
      console.log(err);
      if (err?.error.statusCode === 401) {
        if (err.message === 'Unauthorized!') {
          openNoti();
        }
      }
    }
  };

  const getFriendList = async () => {
    try {
      const friends = await FriendApi.friendList();
      dispatch(friendListActions.setFriendList(friends));
    } catch (err: any) {
      if (err?.error.statusCode === 400) {
        message.error(err.error.message);
      }
    }
  };

  useEffect(() => {
    getRoomList();
    getFriendList();
  }, []);

  return (
    <>
      <S.HomeContainer>
        <TopBar />
        <S.Wrapper>
          <SideBar />
          {roomInfo.info.roomName !== '' ? (
            <ChatArea />
          ) : (
            <Welcome home={true} />
          )}
        </S.Wrapper>
        {callNotiShow && callInfo && (
          <CallNotiModel
            setCallNotiShow={setCallNotiShow}
            callInfo={callInfo}
          />
        )}
      </S.HomeContainer>
    </>
  );
};

export default withRouter(Home);
