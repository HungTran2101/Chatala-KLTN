import * as S from "./ShowFriends.styled";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useState } from "react";
import { selectFriendListState } from "../../../../../features/redux/slices/friendListSlice";
import UserInfo from "../../../TopBar/UserInfo";
import { userInfo } from "../../../../../utils/types";

interface IShowFriends {
  setToggleShowFriends: (toggle: boolean) => void;
}

const ShowFriends = ({ setToggleShowFriends }: IShowFriends) => {
  const friends = useSelector(selectFriendListState);

  const [toggleFriendProfile, setToggleFriendProfile] = useState(false);
  const [friendProfile, setFriendProfile] = useState<userInfo>();

  const showFriendProfile = (data: userInfo) => {
    setToggleFriendProfile(true);
    setFriendProfile(data);
  };

  return (
    <S.ShowFriendsModal>
      <S.ShowFriendsOverlay onClick={() => setToggleShowFriends(false)} />
      <S.ShowFriendsBody>
        <S.ShowFriendsTitle>Your Friends</S.ShowFriendsTitle>
        <S.ShowFriendsSearch>
          <S.ShowFriendsSearchIcon />
          <S.ShowFriendsSearchInput placeholder="Search with name or phone number..." />
        </S.ShowFriendsSearch>
        <S.FriendList>
          {friends.list.map((data, index) => (
            <S.ShowFriendsInfo
              key={index}
              onClick={() => showFriendProfile(data)}
            >
              <S.ShowFriendsAvatar>
                <Image
                  src={data.avatar}
                  alt="avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </S.ShowFriendsAvatar>
              <S.ShowFriendsName>{data.name}</S.ShowFriendsName>
            </S.ShowFriendsInfo>
          ))}
        </S.FriendList>
        {toggleFriendProfile && (
          <UserInfo
            friendProfile={friendProfile}
            setUserInfoModal={setToggleFriendProfile}
          />
        )}
      </S.ShowFriendsBody>
    </S.ShowFriendsModal>
  );
};

export default ShowFriends;
