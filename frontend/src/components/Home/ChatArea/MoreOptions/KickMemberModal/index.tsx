import Image from 'next/image';
import * as S from './KickMemberModal.styled';
import { roomInfo, roomUser, userInfo } from '../../../../../utils/types';
import { RoomApi } from '../../../../../services/api/room';
import { useSocketContext } from '../../../../../contexts/socket';
import { useDispatch } from 'react-redux';
import { roomInfoActions } from '../../../../../features/redux/slices/roomInfoSlice';
import { roomListActions } from '../../../../../features/redux/slices/roomListSlice';

interface IKickMemberModal {
  setToggleKickMember: (toogle: boolean) => void;
  roomInfo: roomInfo;
  user: userInfo;
}

const KickMemberModal = ({
  setToggleKickMember,
  roomInfo,
  user,
}: IKickMemberModal) => {
  const socket = useSocketContext();
  const dispatch = useDispatch();

  const recentUser = [];
  roomInfo.roomInfo.users.forEach((u) => {
    if (!u.isLeave && u.uid !== user._id) recentUser.push(u);
  });

  const kickMember = async (data: roomUser) => {
    try {
      const res = await RoomApi.kickMember(roomInfo.roomInfo._id, data.uid);
      dispatch(roomInfoActions.kickMember({ uid: res.uid }));
      dispatch(
        roomListActions.updateRoomForKickMember({
          uid: res.uid,
          roomId: res.roomId,
        })
      );

      socket.emit('kickmember', data.uid);

      alert(`Kick ${data.nickname} succeed!`)
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };

  return (
    <S.KickMemberModal>
      <S.KickMemberOverlay onClick={() => setToggleKickMember(false)} />
      <S.KickMemberBody>
        <S.KickMemberTitle>Kick Members</S.KickMemberTitle>
        <S.KickMemberSearch>
          <S.KickMemberSearchIcon />
          <S.KickMemberSearchInput placeholder="Search with name or phone number..." />
        </S.KickMemberSearch>
        <S.KickMemberList>
          {recentUser.map((data, index) => (
            <S.KickMemberItem key={index}>
              <S.KickMemberInfo>
                <S.KickMemberAvatar>
                  <Image
                    src={data.avatar}
                    alt="avatar"
                    layout="fill"
                    objectFit="cover"
                  />
                </S.KickMemberAvatar>
                <S.KickMemberName>{data.nickname}</S.KickMemberName>
              </S.KickMemberInfo>
              <S.KickMemberButton onClick={() => kickMember(data)}>
                Kick from group
              </S.KickMemberButton>
            </S.KickMemberItem>
          ))}
        </S.KickMemberList>
      </S.KickMemberBody>
    </S.KickMemberModal>
  );
};

export default KickMemberModal;
