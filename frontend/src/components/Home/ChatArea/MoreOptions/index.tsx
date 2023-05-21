import * as S from './MoreOptions.styled';
import { getFileIcon, useOutsideClick } from '../../../Global/ProcessFunctions';
import { fileType, roomInfo, userInfo } from '../../../../utils/types';
import Image from 'next/image';
import { UserAvatar } from '../../../../utils/dataConfig';
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
import GroupNameModal from './GroupNameModel';
import AddMemberModal from './AddMemberModal';
import KickMemberModal from './KickMemberModal';

interface IMoreOptions {
  setToggleOption: (toggle: boolean) => void;
  setToggleImageZoom: (toggle: boolean) => void;
  setImageZoomList: (value: { index: number; list: fileType[] }) => void;
  toggleOption: boolean;
  roomInfo: roomInfo;
}

const MoreOptions = ({
  setToggleOption,
  setImageZoomList,
  setToggleImageZoom,
  roomInfo,
  toggleOption,
}: IMoreOptions) => {
  const handleOutsideClick = () => {
    setToggleOption(false);
  };

  const moreOptionsRef = useOutsideClick(handleOutsideClick);

  const [photoExtend, setPhotoExtend] = useState(false);
  const [fileExtend, setFileExtend] = useState(false);
  const [toggleNickname, setToggleNickname] = useState(false);
  const [toggleFriendProfile, setToggleFriendProfile] = useState(false);
  const [toggleGroupMembers, setToggleGroupMembers] = useState(false);
  const [toggleGroupName, setToggleGroupName] = useState(false);
  const [toggleAddMember, setToggleAddMember] = useState(false);
  const [toggleKickMember, setToggleKickMember] = useState(false);
  const [friendProfile, setFriendProfile] = useState<userInfo>();

  const user = useSelector(selectUserState);
  const roomfiles = useSelector(selectFileState);

  const photos = roomfiles.list.filter((file) => file.type === 'image');
  const files = roomfiles.list.filter((file) => file.type === 'file');

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
    setToggleFriendProfile(true);
  };

  const photosClickHandler = (index: number) => {
    setToggleImageZoom(true);
    setImageZoomList({ index, list: photos });
  };

  return (
    <S.MoreOptions ref={moreOptionsRef} toggleOption={toggleOption}>
      <S.RoomInfo>
        {roomInfo.roomInfo.isGroup ? (
          <S.RoomInfoAvatar isGroup={1}>
            {roomInfo.roomInfo.users.map(
              (user, index) =>
                index <= 3 && (
                  <S.RoomInfoAvatarGroup key={index}>
                    <Image src={user.avatar} alt="avatar" layout="fill" />
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
            <S.RoomInfoNameEditIcon onClick={() => setToggleGroupName(true)} />
          )}
        </S.RoomInfoNameWrap>
      </S.RoomInfo>
      <S.OptionWrap>
        <S.WhiteBox>
          {!roomInfo.roomInfo.isGroup && (
            <S.NormalItem onClick={() => seeFriendProfile()}>
              Friend&apos;s profile
            </S.NormalItem>
          )}
          {!roomInfo.roomInfo.isGroup && (
            <S.NormalItem onClick={() => setToggleNickname(true)}>
              Change Nickname
            </S.NormalItem>
          )}
          {roomInfo.roomInfo.isGroup && (
            <S.NormalItem onClick={() => setToggleGroupMembers(true)}>
              Group Members
            </S.NormalItem>
          )}
          {roomInfo.roomInfo.isGroup && (
            <S.NormalItem onClick={() => setToggleAddMember(true)}>
              Add Members
            </S.NormalItem>
          )}
          {roomInfo.roomInfo.isGroup && (
            <S.DeleteItem onClick={() => setToggleKickMember(true)}>
              Kick Members
            </S.DeleteItem>
          )}
          {!roomInfo.roomInfo.isGroup && (
            <S.DeleteItem onClick={() => FriendApi.block(userNeedChange.uid)}>
              Block
            </S.DeleteItem>
          )}
          {/* <S.DeleteItem>Delete this chat</S.DeleteItem> */}
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
                  onClick={() => photosClickHandler(index)}
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
      {toggleNickname && (
        <NicknameModal
          setToggleNickname={setToggleNickname}
          roomInfo={roomInfo}
          userNeedChange={userNeedChange}
        />
      )}
      {toggleFriendProfile && (
        <UserInfo
          friendProfile={friendProfile}
          setUserInfoModal={setToggleFriendProfile}
        />
      )}
      {toggleGroupMembers && (
        <GroupMembers
          setToggleGroupMembers={setToggleGroupMembers}
          roomInfo={roomInfo}
        />
      )}
      {toggleAddMember && (
        <AddMemberModal
          setToggleAddMember={setToggleAddMember}
          roomInfo={roomInfo}
        />
      )}
      {toggleKickMember && (
        <KickMemberModal
          setToggleKickMember={setToggleKickMember}
          roomInfo={roomInfo}
          user={user.info}
        />
      )}
      {toggleGroupName && (
        <GroupNameModal
          setToggleGroupName={setToggleGroupName}
          roomInfo={roomInfo}
        />
      )}
    </S.MoreOptions>
  );
};

export default MoreOptions;
