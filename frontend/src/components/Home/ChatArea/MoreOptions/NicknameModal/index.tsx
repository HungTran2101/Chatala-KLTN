import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { roomInfoActions } from '../../../../../features/redux/slices/roomInfoSlice';
import { roomListActions } from '../../../../../features/redux/slices/roomListSlice';
import { RoomApi } from '../../../../../services/api/room';
import { roomInfo, roomUser } from '../../../../../utils/types';
import * as S from './NicknameModal.styled';
import { Modal, message } from 'antd';
import { selectUtilState } from '../../../../../features/redux/slices/utilSlice';

interface INickname {
  closeModal: () => void;
  open: boolean;
  roomInfo: roomInfo;
  userNeedChange: roomUser;
}

const NicknameModal = ({
  closeModal,
  open,
  roomInfo,
  userNeedChange,
}: INickname) => {
  const input = useRef<HTMLInputElement>();

  const dispatch = useDispatch();

  const UIText = useSelector(selectUtilState).UItext.chatArea.moreOptions.nickname

  const saveNickname = async () => {
    if (input.current.value === '') return;
    try {
      await RoomApi.changeNickname(
        roomInfo.roomInfo._id,
        userNeedChange.uid,
        input.current.value
      );
      dispatch(
        roomInfoActions.changeNickname({
          uid: userNeedChange.uid,
          nickname: input.current.value,
        })
      );
      !roomInfo.roomInfo.isGroup &&
        dispatch(
          roomListActions.changeNickname({
            roomId: roomInfo.roomInfo._id,
            nickname: input.current.value,
          })
        );
      message.success(`Change nickname to ${input.current.value} succeed`)
      closeModal();
    } catch (err) {
      console.log(err);
      message.error(err.message);
    }
  };

  return (
    <Modal
      title={`${UIText.title} ${userNeedChange?.nickname}`}
      open={open}
      onOk={saveNickname}
      onCancel={closeModal}
      okType="link"
      cancelText={UIText.cancel}
      destroyOnClose
      centered
    >
      <S.NicknameInput maxLength={50} ref={input} />
    </Modal>
  );
};

export default NicknameModal;
