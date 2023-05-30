import * as S from './ChatMsgOption.styled';
import { MessageApi } from '../../../../../services/api/messages';
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../../../../../features/redux/slices/messageSlice';
import { selectRoomInfoState } from '../../../../../features/redux/slices/roomInfoSlice';
import { selectUserState } from '../../../../../features/redux/slices/userSlice';
import { useSocketContext } from '../../../../../contexts/socket';
import {
  selectUtilState,
  utilActions,
} from '../../../../../features/redux/slices/utilSlice';
import { useState } from 'react';
import { Popconfirm } from 'antd';

interface IChatMsgOption {
  msgId: string;
  isleft?: number; //mean this component will be in msg for other user
  setToggleOption: (toogle: boolean) => void;
}

const ChatMsgOption = ({
  msgId,
  isleft = 0,
  setToggleOption,
}: IChatMsgOption) => {
  const dispatch = useDispatch();

  const roomInfo = useSelector(selectRoomInfoState);
  const user = useSelector(selectUserState);
  const UIText = useSelector(selectUtilState).UIText.chatArea.chatAreaMain;

  const friend = roomInfo.info.roomInfo.users.find(
    (it) => it.uid !== user.info._id
  );
  const socket = useSocketContext();

  const [unsendConfirm, setUnsendConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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

  return (
    <S.ChatMsgOption>
      <S.NormalItem onClick={() => replyMsg()}>{UIText.reply}</S.NormalItem>
      {!isleft && (
        <>
          <Popconfirm
            title={UIText.unsendConfirm}
            description={UIText.descriptionConfirm}
            open={unsendConfirm}
            onConfirm={() => unsendMsg()}
            onCancel={() => setUnsendConfirm(false)}
            cancelText={UIText.cancelConfirm}
            okType={'danger'}
          >
            <S.DeteleItem onClick={() => setUnsendConfirm(true)}>
              {UIText.unsend}
            </S.DeteleItem>
          </Popconfirm>
          <Popconfirm
            title={UIText.deleteConfirm}
            description={UIText.descriptionConfirm}
            open={deleteConfirm}
            onConfirm={() => deleteMsg()}
            onCancel={() => setDeleteConfirm(false)}
            cancelText={UIText.cancelConfirm}
            okType={'danger'}
          >
            <S.DeteleItem onClick={() => setDeleteConfirm(true)}>
              {UIText.delete}
            </S.DeteleItem>
          </Popconfirm>
        </>
      )}
    </S.ChatMsgOption>
  );
};

export default ChatMsgOption;
