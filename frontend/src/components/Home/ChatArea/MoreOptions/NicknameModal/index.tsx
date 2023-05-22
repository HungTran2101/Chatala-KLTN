import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { roomInfoActions } from '../../../../../features/redux/slices/roomInfoSlice';
import { roomListActions } from '../../../../../features/redux/slices/roomListSlice';
import { RoomApi } from '../../../../../services/api/room';
import { roomInfo, roomUser } from '../../../../../utils/types';
import * as S from './NicknameModal.styled';
import { Modal } from 'antd';

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

  const saveNickname = async () => {
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
      closeModal();
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <Modal
      title={`Change nickname for ${userNeedChange?.nickname}`}
      open={open}
      onOk={saveNickname}
      onCancel={closeModal}
      okType='link'
      destroyOnClose
      centered
    >
      <S.NicknameInput maxLength={50} ref={input} />
    </Modal>
  );
};

export default NicknameModal;
