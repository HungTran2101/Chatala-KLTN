import * as S from "./MoreOptions.styled";
import { useOutsideClick } from "../../../Global/ProcessFunctions";
import { roomInfo, userInfo } from "../../../../utils/types";
import Image from "next/image";
import { UserAvatar } from "../../../../utils/dataConfig";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState } from "react";
import NicknameModal from "./NicknameModal";
import UserInfo from "../../TopBar/UserInfo";
import { selectUserState } from "../../../../features/redux/slices/userSlice";
import { useSelector } from "react-redux";
import { UsersApi } from "../../../../services/api/users";
import GroupMembers from "./GroupMembers";

interface IMoreOptions {
  setToggleOption: (toggle: boolean) => void;
  toggleOption: boolean;
  roomInfo: roomInfo;
}

const MoreOptions = ({
  setToggleOption,
  roomInfo,
  toggleOption,
}: IMoreOptions) => {
  const handleOutsideClick = () => {
    setToggleOption(false);
  };

  const moreOptionsRef = useOutsideClick(handleOutsideClick);

  const [mediaExtend, setMediaExtend] = useState(false);
  const [toggleNickname, setToggleNickname] = useState(false);
  const [toggleFriendProfile, setToggleFriendProfile] = useState(false);
  const [toggleGroupMembers, setToggleGroupMembers] = useState(false);
  const [friendProfile, setFriendProfile] = useState<userInfo>();

  const user = useSelector(selectUserState);

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

  return (
    <S.MoreOptions ref={moreOptionsRef} toggleOption={toggleOption}>
      <S.RoomInfo>
        {roomInfo.roomInfo.isGroup ? (
          <S.RoomInfoGroupAvatar />
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
          {roomInfo.roomInfo.isGroup && <S.RoomInfoNameEditIcon />}
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
          {!roomInfo.roomInfo.isGroup && <S.DeleteItem>Block</S.DeleteItem>}
          <S.DeleteItem>Delete this chat</S.DeleteItem>
        </S.WhiteBox>
        <S.WhiteBox>
          <S.Title>
            Photos/Videos
            <IoMdArrowDropdown
              style={{
                fontSize: "24px",
                transition: "300ms",
                cursor: "pointer",
                transform: !mediaExtend ? "rotate(-90deg)" : "none",
              }}
              onClick={() => setMediaExtend(!mediaExtend)}
            />
          </S.Title>
          <S.ExtendContent visible={mediaExtend}>
            <S.PhotoWrap>
              <S.UploadedMedia>
                <Image
                  src={roomInfo.roomInfo.users[0].avatar}
                  alt="avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </S.UploadedMedia>
              <S.UploadedMedia>
                <Image
                  src={roomInfo.roomInfo.users[0].avatar}
                  alt="avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </S.UploadedMedia>
              <S.UploadedMedia>
                <Image
                  src={roomInfo.roomInfo.users[0].avatar}
                  alt="avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </S.UploadedMedia>
            </S.PhotoWrap>
            <S.MoreButton>View More</S.MoreButton>
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
        <GroupMembers setToggleGroupMembers={setToggleGroupMembers} />
      )}
    </S.MoreOptions>
  );
};

export default MoreOptions;
