import { useOutsideClick } from '../../../../Global/ProcessFunctions';
import * as S from './ChatMsgOption.styled';
import { MessageApi } from '../../../../../services/api/messages';
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../../../../../features/redux/slices/messageSlice';
import { selectRoomInfoState } from '../../../../../features/redux/slices/roomInfoSlice';
import { selectUserState } from '../../../../../features/redux/slices/userSlice';
import { useSocketContext } from '../../../../../contexts/socket';
import { utilActions } from '../../../../../features/redux/slices/utilSlice';
import { useEffect } from 'react';

interface IChatMsgOption {
  msgId: string;
  isleft?: number; //mean this component will be in msg for other user
  isLastMsg: boolean;
  setToggleOption: (toogle: boolean) => void;
}

const ChatMsgOption = ({
  msgId,
  isleft = 0,
  isLastMsg,
  setToggleOption,
}: IChatMsgOption) => {
  const dispatch = useDispatch();

  const handleOutsideClick = () => {
    setToggleOption(false);
  };

  const chatMsgOptionRef = useOutsideClick(handleOutsideClick);

  const roomInfo = useSelector(selectRoomInfoState);
  const user = useSelector(selectUserState);
  const friend = roomInfo.info.roomInfo.users.find(
    (it) => it.uid !== user.info._id
  );
  const socket = useSocketContext();

  const unsendMsg = async () => {
    await MessageApi.unsend(msgId);
    dispatch(messageActions.unsend(msgId));
    if (!roomInfo.info.roomInfo.isGroup) {
      socket.emit('unsend msg', friend.uid, msgId);
    }
    setToggleOption(false);
  };

  const deleteMsg = async () => {
    await MessageApi.delete(msgId);
    dispatch(messageActions.delete(msgId));
    if (!roomInfo.info.roomInfo.isGroup) {
      socket.emit('delete msg', friend.uid, msgId);
    }
    setToggleOption(false);
  };

  const replyMsg = async () => {
    dispatch(utilActions.setReplyId(msgId));
    setToggleOption(false);
  };

  //check option component overflow
  useEffect(() => {
    const msg = document.getElementById(msgId);
    const ChatAreaMainMsgInner = document.getElementById(
      'ChatAreaMainMsgInner'
    );
    const ChatAreaMainMsgOuter = document.getElementById(
      'ChatAreaMainMsgOuter'
    );

    console.log(msg.offsetTop, 'msg');
    console.log(ChatAreaMainMsgInner.offsetTop, 'inner');
    console.log(ChatAreaMainMsgOuter.offsetHeight, 'outer');

    const offset = Math.abs(msg.offsetTop);
    // console.log(chatMsgOptionRef.current.offsetTop);
  }, []);

  return (
    <S.ChatMsgOption
      ref={chatMsgOptionRef}
      isleft={isleft}
      isLastMsg={isLastMsg ? 1 : 0}
    >
      <S.NormalItem onClick={() => replyMsg()}>Reply</S.NormalItem>
      {!isleft && (
        <>
          <S.NormalItem onClick={() => unsendMsg()}>Unsend</S.NormalItem>
          <S.DeteleItem onClick={() => deleteMsg()}>Delete</S.DeteleItem>
        </>
      )}
    </S.ChatMsgOption>
  );
};

export default ChatMsgOption;
