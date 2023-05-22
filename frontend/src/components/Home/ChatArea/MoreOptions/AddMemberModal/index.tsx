import { useDispatch, useSelector } from 'react-redux';
import * as S from './AddMemberModal.styled';
import { selectFriendListState } from '../../../../../features/redux/slices/friendListSlice';
import Image from 'next/image';
import {
  roomInfoActions,
  selectRoomInfoState,
} from '../../../../../features/redux/slices/roomInfoSlice';
import { roomInfo, userInfo } from '../../../../../utils/types';
import { RoomApi } from '../../../../../services/api/room';
import { roomListActions } from '../../../../../features/redux/slices/roomListSlice';
import { useSocketContext } from '../../../../../contexts/socket';
import { Modal } from 'antd';

interface IAddMemberModal {
  closeModal: () => void;
  open: boolean;
  roomInfo: roomInfo;
}

const AddMemberModal = ({ open, closeModal, roomInfo }: IAddMemberModal) => {
  const friends = useSelector(selectFriendListState);

  const uids = [];
  const unAddMembers = [];

  roomInfo.roomInfo.users.forEach(
    (u) => u.isLeave === false && uids.push(u.uid)
  );

  friends.list.forEach((fr) => {
    if (!uids.includes(fr._id)) unAddMembers.push(fr);
  });

  const dispatch = useDispatch();
  const socket = useSocketContext();

  const addMember = async (data: userInfo) => {
    try {
      const res = await RoomApi.addMember(roomInfo.roomInfo._id, data._id);
      dispatch(
        roomInfoActions.addMember({
          newMember: res.newMember,
          existed: res.existed,
        })
      );
      dispatch(
        roomListActions.updateRoomForNewMember({
          newMember: res.newMember,
          existed: res.existed,
          roomId: roomInfo.roomInfo._id,
        })
      );

      socket.emit('addmember', data._id);

      alert(`Add ${data.name} to group succeed!`);
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <Modal
      title={`Group add`}
      open={open}
      onOk={closeModal}
      onCancel={closeModal}
      cancelButtonProps={{ style: { display: 'none' } }}
      okType='link'
      destroyOnClose
    >
      <S.AddMemberSearch>
        <S.AddMemberSearchIcon />
        <S.AddMemberSearchInput placeholder='Search with name or phone number...' />
      </S.AddMemberSearch>
      <S.AddMemberList>
        {unAddMembers.map((data, index) => (
          <S.AddMemberItem key={index}>
            <S.AddMemberInfo>
              <S.AddMemberAvatar>
                <Image
                  src={data.avatar}
                  alt='avatar'
                  layout='fill'
                  objectFit='cover'
                />
              </S.AddMemberAvatar>
              <S.AddMemberName>{data.name}</S.AddMemberName>
            </S.AddMemberInfo>
            <S.AddMemberButton onClick={() => addMember(data)}>
              + Add member
            </S.AddMemberButton>
          </S.AddMemberItem>
        ))}
      </S.AddMemberList>
    </Modal>
  );
};

export default AddMemberModal;
