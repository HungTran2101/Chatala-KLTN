import * as S from './MoreOptions.styled';
import { getFileIcon, useOutsideClick } from '../../../Global/ProcessFunctions';
import { fileType, roomInfo, userInfo } from '../../../../utils/types';
import Image from 'next/image';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useState } from 'react';
import NicknameModal from './NicknameModal';
import UserInfo from '../../TopBar/UserInfo';
import { selectUserState } from '../../../../features/redux/slices/userSlice';
import { useSelector } from 'react-redux';
import { UsersApi } from '../../../../services/api/users';
import GroupMembers from './GroupMembers';
import { FriendApi } from '../../../../services/api/friend';
import { selectFileState } from '../../../../features/redux/slices/fileSlice';
import GroupNameModal from './GroupNameModal';
import AddMemberModal from './AddMemberModal';
import { Drawer, Modal, Popconfirm, message } from 'antd';
import { useSocketContext } from '../../../../contexts/socket';
import { selectUtilState } from '../../../../features/redux/slices/utilSlice';

interface IMoreOptions {
  setToggleOption: () => void;
  setToggleImageZoom: (toggle: boolean) => void;
  setImageId: (value: string) => void;
  setIsUnfriend: (toggle: boolean) => void;
  toggleOption: boolean;
  roomInfo: roomInfo;
  isUnfriend: boolean;
}

const MoreOptions = ({
  setToggleOption,
  setImageId,
  setToggleImageZoom,
  setIsUnfriend,
  roomInfo,
  toggleOption,
  isUnfriend,
}: IMoreOptions) => {
  const socket = useSocketContext();

  const [photoExtend, setPhotoExtend] = useState(false);
  const [fileExtend, setFileExtend] = useState(false);
  const [friendProfile, setFriendProfile] = useState<userInfo>();

  const user = useSelector(selectUserState);
  const roomfiles = useSelector(selectFileState);
  const UIText = useSelector(selectUtilState).UItext.chatArea.moreOptions;

  const photos = roomfiles.list.filter((file) => file.type === 'image');
  const files = roomfiles.list.filter((file) => file.type === 'file');

  const activeAvatar = [];
  roomInfo.roomInfo.users.forEach((u) => {
    if (!u.isLeave) activeAvatar.push(u.avatar);
  });

  // in case change nickname event happend
  const userNeedChange = roomInfo.roomInfo.users.find(
    (it) => it.uid !== user.info._id
  );

  const seeFriendProfile = async () => {
    const friend = roomInfo.roomInfo.users.find(
      (it) => it.uid !== user.info._id
    );
    const _friend = await UsersApi.userFindById(friend.uid);

    setFriendProfile(_friend);
    setModalUser(true);
  };

  const photosClickHandler = (imgId: string) => {
    setToggleImageZoom(true);
    setImageId(imgId);
  };

  const [open, setOpen] = useState(false);
  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleUnfriend = async (friendRelateId: string) => {
    const friend = roomInfo.roomInfo.users.find((u) => u.uid !== user.info._id);

    const res = await FriendApi.unfriend(friendRelateId);
    socket.emit('unfriend', { friendRelateId, receiveId: friend.uid });
    message.success(res.message);
    setIsUnfriend(true);
  };

  const [modalUser, setModalUser] = useState(false);
  const [modalNickName, setModalNickName] = useState(false);
  const [modalGroupMembers, setModalGroupMembers] = useState(false);
  const [modalGroupName, setModalGroupName] = useState(false);
  const [modalGroupAdd, setModalGroupAdd] = useState(false);

  return (
    <Drawer
      // title='Room detail'
      headerStyle={{ display: 'none' }}
      placement="right"
      onClose={() => {
        setToggleOption();
        handleCancel();
      }}
      open={toggleOption}
      getContainer={false}
    >
      {/* <S.MoreOptions ref={moreOptionsRef} toggleOption={toggleOption}> */}
      <S.RoomInfo>
        {roomInfo.roomInfo.isGroup ? (
          <S.RoomInfoAvatar isGroup={1}>
            {activeAvatar.map(
              (url, index) =>
                index <= 3 && (
                  <S.RoomInfoAvatarGroup key={index}>
                    <Image src={url} alt="avatar" layout="fill" />
                  </S.RoomInfoAvatarGroup>
                )
            )}
          </S.RoomInfoAvatar>
        ) : (
          <S.RoomInfoAvatar>
            <Image src={roomInfo.roomAvatar} alt="avatar" layout="fill" />
          </S.RoomInfoAvatar>
        )}
        <S.RoomInfoNameWrap>
          <S.RoomInfoName>
            {roomInfo.roomInfo.isGroup
              ? roomInfo.roomInfo.groupName
              : roomInfo.roomName}
          </S.RoomInfoName>
          {roomInfo.roomInfo.isGroup && (
            <S.RoomInfoNameEditIcon onClick={() => setModalGroupName(true)} />
          )}
        </S.RoomInfoNameWrap>
      </S.RoomInfo>
      <S.OptionWrap>
        <S.WhiteBox>
          {roomInfo.roomInfo.isGroup && (
            <>
              <S.NormalItem onClick={() => setModalGroupMembers(true)}>
                {UIText.groupMembers.label}
              </S.NormalItem>
              <S.NormalItem onClick={() => setModalGroupAdd(true)}>
                {UIText.addMembers.label}
              </S.NormalItem>
              {/* <S.DeleteItem onClick={() => setToggleKickMember(true)}>
                Kick Members
              </S.DeleteItem> */}
            </>
          )}
          {!roomInfo.roomInfo.isGroup && (
            <>
              <S.NormalItem onClick={() => seeFriendProfile()}>
                {UIText.profile}
              </S.NormalItem>
              {!isUnfriend && (
                <S.NormalItem onClick={() => setModalNickName(true)}>
                  {UIText.nickname.label}
                </S.NormalItem>
              )}
              {!isUnfriend && (
                <Popconfirm
                  title={`${UIText.unfriend.titleConfirm} ${userNeedChange.nickname}`}
                  description={UIText.unfriend.descriptionConfirm}
                  open={open}
                  onConfirm={() =>
                    handleUnfriend(roomInfo.roomInfo.friendRelateId)
                  }
                  // okButtonProps={{ loading: confirmLoading }}
                  onCancel={handleCancel}
                  cancelText={UIText.unfriend.cancelConfirm}
                  okType={'danger'}
                >
                  <S.DeleteItem onClick={showPopconfirm}>{UIText.unfriend.label}</S.DeleteItem>
                </Popconfirm>
              )}
            </>
          )}
        </S.WhiteBox>
        <S.WhiteBox>
          <S.Title onClick={() => setPhotoExtend(!photoExtend)}>
            {UIText.photos}
            <IoMdArrowDropdown
              style={{
                fontSize: '24px',
                transition: '300ms',
                transform: !photoExtend ? 'rotate(-90deg)' : 'none',
              }}
            />
          </S.Title>
          <S.ExtendContent>
            <S.FileWrap visible={photoExtend}>
              {photos.map((file, index) => (
                <S.UploadedMedia
                  key={index}
                  onClick={() => photosClickHandler(file._id)}
                >
                  <Image
                    src={file.url}
                    alt="room's file"
                    layout="fill"
                    objectFit="cover"
                  />
                </S.UploadedMedia>
              ))}
            </S.FileWrap>
            {/* <S.MoreButton>View More</S.MoreButton> */}
          </S.ExtendContent>
        </S.WhiteBox>
        <S.WhiteBox>
          <S.Title onClick={() => setFileExtend(!fileExtend)}>
            {UIText.files}
            <IoMdArrowDropdown
              style={{
                fontSize: '24px',
                transition: '300ms',
                transform: !fileExtend ? 'rotate(-90deg)' : 'none',
              }}
            />
          </S.Title>
          <S.ExtendContent>
            <S.FileWrap wraptype={'file'} visible={fileExtend}>
              {files.map((file, index) => (
                <S.FilePreview
                  key={index}
                  target="_blank"
                  download
                  href={file.url}
                >
                  <S.FilePreviewIcon>{getFileIcon(file)}</S.FilePreviewIcon>
                  <S.FilePreviewName>{file.name}</S.FilePreviewName>
                </S.FilePreview>
              ))}
            </S.FileWrap>
            {/* <S.MoreButton>View More</S.MoreButton> */}
          </S.ExtendContent>
        </S.WhiteBox>
      </S.OptionWrap>
      <NicknameModal
        closeModal={() => setModalNickName(false)}
        open={modalNickName}
        roomInfo={roomInfo}
        userNeedChange={userNeedChange}
      />
      <UserInfo
        friendProfile={friendProfile}
        open={modalUser}
        closeModal={() => setModalUser(false)}
      />
      <GroupMembers
        open={modalGroupMembers}
        closeModal={() => setModalGroupMembers(false)}
        roomInfo={roomInfo}
        user={user.info}
      />
      <AddMemberModal
        open={modalGroupAdd}
        closeModal={() => setModalGroupAdd(false)}
        roomInfo={roomInfo}
      />
      <GroupNameModal
        open={modalGroupName}
        closeModal={() => setModalGroupName(false)}
        roomInfo={roomInfo}
      />
    </Drawer>
  );
};

export default MoreOptions;
