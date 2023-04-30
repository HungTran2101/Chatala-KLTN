import * as S from './TopNav.styled';
import { useState } from 'react';
import CreateGroup from './CreateGroup';
import ShowFriends from './ShowFriends';

const TopNav = () => {
  const [toggleCreateGroup, setToggleCreateGroup] = useState(false);
  const [toggleShowFriends, setToggleShowFriends] = useState(false);

  return (
    <S.Wrapper>
      <S.Options>
        <S.FriendsOption onClick={() => setToggleShowFriends(true)} />
        <S.AddGroupOption onClick={() => setToggleCreateGroup(true)} />
      </S.Options>
      {toggleCreateGroup && (
        <CreateGroup setToggleCreateGroup={setToggleCreateGroup} />
      )}
      {toggleShowFriends && (
        <ShowFriends setToggleShowFriends={setToggleShowFriends} />
      )}
    </S.Wrapper>
  );
};

export default TopNav;
