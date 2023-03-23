import Image from "next/image";
import { useState } from "react";
import { HiOutlineX, HiPencil } from "react-icons/hi";
import { UserAvatar, UserName } from "../../../../utils/dataConfig";

import * as S from "./UserInfo.styled";
import SettingInfo from "../SettingInfo";
import { formatDate } from "../../../Global/ProcessFunctions";
import { useSelector } from "react-redux";
import { selectUserState } from "../../../../features/redux/slices/userSlice";
import { userInfo } from "../../../../utils/types";

interface IUserInfo {
  friendProfile?: userInfo;
  setUserInfoModal: (userInfo: boolean) => void;
}

const UserInfo = ({ friendProfile, setUserInfoModal }: IUserInfo) => {
  const user = useSelector(selectUserState);
  const { phone, avatar, banner, name, gender, dob } = friendProfile || user.info;

  const [editInfo, setEditInfo] = useState(false);
  const [seeAvatar, setSeeAvatar] = useState(false);
  return (
    <>
      {seeAvatar && (
        <S.ModalAvatar>
          <S.ModalOverlay onClick={() => setSeeAvatar(false)} />
          <S.ModalAvatarBody>
            <S.Figure>
              <Image src={avatar} layout="fill" objectFit="contain" />
            </S.Figure>
          </S.ModalAvatarBody>
        </S.ModalAvatar>
      )}
      <S.Modal>
        <S.ModalOverlay onClick={() => setUserInfoModal(false)} />
        <S.ModalBody>
          <S.Header>
            <S.Title>
              Account information
              <HiOutlineX onClick={() => setUserInfoModal(false)} />
            </S.Title>
            <S.Banner>
              <Image src={banner} layout="fill" objectFit="cover" />
            </S.Banner>
            <S.Avatar onClick={() => setSeeAvatar(true)}>
              <Image src={avatar} layout="fill" objectFit="cover" />
            </S.Avatar>
          </S.Header>
          <S.Content>
            <S.Description>
              <span>Phone</span>
              <span>Fullname</span>
              <span>Gender</span>
              <span>Date of Birth</span>
            </S.Description>
            <S.Info>
              <span>{phone}</span>
              <span>{name}</span>
              <span>{gender}</span>
              <span>{formatDate(dob)}</span>
            </S.Info>
          </S.Content>
          {!friendProfile && <S.Button>
            <HiPencil />
            <span onClick={() => setEditInfo(true)}>Update information</span>
          </S.Button>}
          {editInfo && (
            <SettingInfo
              id={user.info._id}
              name={name}
              gender={gender}
              dob={dob}
              avatar={avatar}
              setEditInfo={setEditInfo}
            />
          )}
        </S.ModalBody>
      </S.Modal>
    </>
  );
};

export default UserInfo;
