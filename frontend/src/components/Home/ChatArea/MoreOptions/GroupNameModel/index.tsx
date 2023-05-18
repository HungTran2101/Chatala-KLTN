import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { roomInfoActions } from '../../../../../features/redux/slices/roomInfoSlice';
import { roomListActions } from '../../../../../features/redux/slices/roomListSlice';
import { RoomApi } from '../../../../../services/api/room';
import { roomInfo, roomUser } from '../../../../../utils/types';
import * as S from './GroupNameModel.styled';
import { useSocketContext } from '../../../../../contexts/socket';

interface IGroupName {
  setToggleGroupName: (toggle: boolean) => void;
  roomInfo: roomInfo;
}

const GroupNameModal = ({ setToggleGroupName, roomInfo }: IGroupName) => {
  const input = useRef<HTMLInputElement>();

  const dispatch = useDispatch();

  const socket = useSocketContext();

  const saveGroupName = async () => {
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

      setToggleGroupName(false);
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <S.GroupNameModal>
      <S.GroupNameOverlay onClick={() => setToggleGroupName(false)} />
      <S.GroupNameBody>
        <S.GroupNameTitle>
          Change name for group <b>{roomInfo.roomInfo.groupName}</b>
        </S.GroupNameTitle>
        <S.GroupNameInput maxLength={50} ref={input} />
        <S.GroupNameSave onClick={saveGroupName}>Save</S.GroupNameSave>
      </S.GroupNameBody>
    </S.GroupNameModal>
  );
};

export default GroupNameModal;
