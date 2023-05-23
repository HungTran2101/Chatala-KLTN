import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { roomInfoActions } from '../../../../../features/redux/slices/roomInfoSlice';
import { roomListActions } from '../../../../../features/redux/slices/roomListSlice';
import { RoomApi } from '../../../../../services/api/room';
import { roomInfo } from '../../../../../utils/types';
import * as S from './GroupNameModel.styled';
import { useSocketContext } from '../../../../../contexts/socket';
import { Modal, message } from 'antd';

interface IGroupName {
  closeModal: () => void;
  open: boolean;
  roomInfo: roomInfo;
}

const GroupNameModal = ({ closeModal, open, roomInfo }: IGroupName) => {
  const input = useRef<HTMLInputElement>();

  const dispatch = useDispatch();

  const socket = useSocketContext();

  const saveGroupName = async () => {
    if (input.current.value === '') return;
    try {
      const res = await RoomApi.changeGroupName(
        roomInfo.roomInfo._id,
        input.current.value
      );
      dispatch(roomInfoActions.changeGroupName(res.room.groupName));
      dispatch(
        roomListActions.changeGroupName({
          roomId: roomInfo.roomInfo._id,
          groupName: res.room.groupName,
        })
      );

      //socket to others
      const roomUserIds = [];
      roomInfo.roomInfo.users.forEach((u) => roomUserIds.push(u.uid));
      socket.emit(
        'groupname',
        roomInfo.roomInfo._id,
        roomUserIds,
        res.room.groupName
      );
      message.success(`Change group name to ${input.current.value} succeed`);
      closeModal();
    } catch (err) {
      console.log(err);
      message.error(err.message);
    }
  };

  return (
    <Modal
      title={`Group name`}
      open={open}
      onOk={saveGroupName}
      onCancel={closeModal}
      okType="link"
      centered
      destroyOnClose
    >
      <S.GroupNameInput maxLength={50} ref={input} />
    </Modal>
  );
};

export default GroupNameModal;
