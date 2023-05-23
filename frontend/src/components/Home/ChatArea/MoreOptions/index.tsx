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
import { Drawer, Modal, Popconfirm } from 'antd';

interface IMoreOptions {
  setToggleOption: () => void;
  setToggleImageZoom: (toggle: boolean) => void;
  setImageId: (value: string) => void;
  toggleOption: boolean;
  roomInfo: roomInfo;
  blockInput: boolean;
}

const MoreOptions = ({
  setToggleOption,
  setImageId,
  setToggleImageZoom,
  roomInfo,
  toggleOption,
  blockInput,
}: IMoreOptions) => {
  // const handleOutsideClick = () => {
  //   setToggleOption(false);
  // };

  // const moreOptionsRef = useOutsideClick(handleOutsideClick);

  const [photoExtend, setPhotoExtend] = useState(false);
  const [fileExtend, setFileExtend] = useState(false);
  // const [toggleNickname, setToggleNickname] = useState(false);
  // const [toggleFriendProfile, setToggleFriendProfile] = useState(false);
  // const [toggleGroupMembers, setToggleGroupMembers] = useState(false);
  // const [toggleGroupName, setToggleGroupName] = useState(false);
  // const [toggleAddMember, setToggleAddMember] = useState(false);
  // const [toggleKickMember, setToggleKickMember] = useState(false);
  const [friendProfile, setFriendProfile] = useState<userInfo>();

  const user = useSelector(selectUserState);
  const roomfiles = useSelector(selectFileState);

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
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleOk = async (friendRelateId: string) => {
    setConfirmLoading(true);

    await FriendApi.unfriend(friendRelateId);

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
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
                Group Members
              </S.NormalItem>
              <S.NormalItem onClick={() => setModalGroupAdd(true)}>
                Add Members
              </S.NormalItem>
              {/* <S.DeleteItem onClick={() => setToggleKickMember(true)}>
                Kick Members
              </S.DeleteItem> */}
            </>
          )}
          {!roomInfo.roomInfo.isGroup && (
            <>
              <S.NormalItem onClick={() => seeFriendProfile()}>
                Friend&apos;s profile
              </S.NormalItem>
              {!blockInput && (
                <S.NormalItem onClick={() => setModalNickName(true)}>
                  Change Nickname
                </S.NormalItem>
              )}
              {!blockInput && (
                <Popconfirm
                  title={`You're about to unfriend ${userNeedChange.nickname}`}
                  description="Please confirm"
                  open={open}
                  onConfirm={() => handleOk(roomInfo.roomInfo.friendRelateId)}
                  okButtonProps={{ loading: confirmLoading }}
                  onCancel={handleCancel}
                  okType={'danger'}
                >
                  <S.DeleteItem onClick={showPopconfirm}>Unfriend</S.DeleteItem>
                </Popconfirm>
              )}
            </>
          )}
        </S.WhiteBox>
        <S.WhiteBox>
          <S.Title onClick={() => setPhotoExtend(!photoExtend)}>
            Photos
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
            Files
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
