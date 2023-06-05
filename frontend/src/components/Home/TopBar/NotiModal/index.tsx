import * as S from './NotiModal.styled';
import * as React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { selectUtilState } from '../../../../features/redux/slices/utilSlice';
import { formatDate } from '../../../Global/ProcessFunctions';

type NotiItem = {
  _id: string;
  uid: string;
  name: string;
  avatar: string;
  status: string;
  updatedAt: string;
};

interface INotiModal {
  listNoti: NotiItem[];
  unreadNoti: number;
  notiListScroll: (e: any) => void;
}

const NotiModal = ({ listNoti, unreadNoti = 0, notiListScroll }: INotiModal) => {
  const UIText = useSelector(selectUtilState).UIText.topBar.noti;

  const getNotiContent = (data: string) => {
    if (data === 'Accepted') {
      return UIText.friendAccept;
    } else {
      return UIText.friendDecline;
    }
  };

  return (
    // <S.Noti ref={NotiRef}>
    // <S.NotiTitles>Friend Requests</S.NotiTitles>
    listNoti.length > 0 ? (
      <S.NotiList onScroll={notiListScroll} id="notiList">
        {listNoti.map((data, index) => (
          <S.NotiItem key={index} isUnread={index < unreadNoti}>
            <S.NotiInfo>
              <S.NotiAvatar>
                <Image
                  src={data.avatar}
                  alt="avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </S.NotiAvatar>
              <S.NotiNameWrapper>
                <S.NotiName>
                  {data.name + ' ' + getNotiContent(data.status)}
                </S.NotiName>
                <S.NotiTime>{formatDate(data.updatedAt, ".", true)}</S.NotiTime>
              </S.NotiNameWrapper>
            </S.NotiInfo>
          </S.NotiItem>
        ))}
      </S.NotiList>
    ) : (
      <S.NotiText>{UIText.empty}</S.NotiText>
    )
  );
};

export default NotiModal;
