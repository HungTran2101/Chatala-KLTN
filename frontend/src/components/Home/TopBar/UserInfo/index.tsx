import { useState } from 'react';
import { HiOutlineX, HiPencil } from 'react-icons/hi';
import { UserAvatar, UserName } from '../../../../utils/dataConfig';

import * as S from './UserInfo.styled';
import SettingInfo from '../SettingInfo';
import { formatDate } from '../../../Global/ProcessFunctions';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../../../features/redux/slices/userSlice';
import { userInfo } from '../../../../utils/types';
import { Modal, Image } from 'antd';
import bgWave from '../../../../assets/imgs/wage_bg.png';
import { selectUtilState } from '../../../../features/redux/slices/utilSlice';

interface IUserInfo {
  friendProfile?: userInfo;
  open: boolean;
  closeModal: () => void;
}

const UserInfo = ({ friendProfile, open, closeModal }: IUserInfo) => {
  const user = useSelector(selectUserState);
  const UIText = useSelector(selectUtilState).UItext.topBar.info;

  const { phone, avatar, banner, name, gender, dob } =
    friendProfile || user.info || {};

  const [editInfo, setEditInfo] = useState(false);

  return (
    <Modal
      open={open}
      closeIcon={<></>}
      onOk={closeModal}
      onCancel={closeModal}
      footer={<></>}
      destroyOnClose
      centered
      style={{ backgroundColor: 'transparent' }}
      bodyStyle={{ backgroundColor: 'transparent' }}
    >
      <S.Header>
        {/* <S.Title>Account information</S.Title> */}
        <S.Banner>
          <Image src={banner} width={'100%'} height={'100%'} />
        </S.Banner>
        <S.Avatar>
          <Image
            width={'100%'}
            src={avatar}
            height={'100%'}
            preview={{ wrapStyle: { img: { 'object-fit': 'contain' } } }}
          />
        </S.Avatar>
      </S.Header>
      <S.Content>
        <S.Description>
          <span>{UIText.phoneLable}</span>
          <span>{UIText.fullnameLabel}</span>
          <span>{UIText.genderLabel}</span>
          <span>{UIText.dobLabel}</span>
        </S.Description>
        <S.Info>
          <span>{phone}</span>
          <span>{name}</span>
          <span>
            {gender === 'male'
              ? UIText.update.maleLabel
              : UIText.update.femaleLabel}
          </span>
          <span>{formatDate(dob)}</span>
        </S.Info>
      </S.Content>
      {!friendProfile && (
        <S.Button>
          <HiPencil />
          <span onClick={() => setEditInfo(true)}>
            {UIText.update.updateConfirm}
          </span>
        </S.Button>
      )}
      <SettingInfo
        id={user.info._id}
        name={name}
        gender={gender}
        dob={dob}
        avatar={avatar}
        closeModal={() => setEditInfo(false)}
        open={editInfo}
      />
    </Modal>
  );
};

export default UserInfo;
