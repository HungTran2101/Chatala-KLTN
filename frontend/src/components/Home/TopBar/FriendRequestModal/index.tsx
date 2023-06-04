import * as S from './FriendRequestModal.styled';
import * as React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { selectUtilState } from '../../../../features/redux/slices/utilSlice';

interface IFriendRequestModal {
  listFriendRequest: any;
  friendAccept: (notificationId: string, uid: string, nickname: string) => void;
  friendDecline: (notificationId: string, uid: string) => void;
}

const FriendRequestModal = ({ listFriendRequest, friendAccept, friendDecline }: IFriendRequestModal) => {
  const UIText = useSelector(selectUtilState).UIText.topBar.friendRequest;

  return (
    // <S.Noti ref={NotiRef}>
    // <S.NotiTitles>Friend Requests</S.NotiTitles>
    listFriendRequest.length > 0 ? (
      <S.FriendRequestList>
        {listFriendRequest.map((data: any, index: number) => (
          <S.FriendRequestItem key={index}>
            <S.FriendRequestInfo>
              <S.FriendRequestAvatar>
                <Image
                  src={data.avatar}
                  alt="avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </S.FriendRequestAvatar>
              <S.FriendRequestNameWrapper>
                <S.FriendRequestName>{data.name}</S.FriendRequestName>
                {/* <S.FriendRequestNumFriend>{`${data.numFriends} Friends`}</S.FriendRequestNumFriend> */}
              </S.FriendRequestNameWrapper>
            </S.FriendRequestInfo>
            <S.FriendRequestAccept
              onClick={() => friendAccept(data._id, data.uid, data.name)}
            >
              {UIText.accept}
            </S.FriendRequestAccept>
            <S.FriendRequestDecline onClick={() => friendDecline(data._id, data.uid)}>
              {UIText.decline}
            </S.FriendRequestDecline>
          </S.FriendRequestItem>
        ))}
      </S.FriendRequestList>
    ) : (
      <S.FriendRequestText>{UIText.empty}</S.FriendRequestText>
    )
  );
};

export default FriendRequestModal;
