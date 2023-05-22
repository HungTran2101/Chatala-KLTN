import * as S from './TopNav.styled';
import { useState } from 'react';
import CreateGroup from './CreateGroup';
import ShowFriends from './ShowFriends';

const TopNav = () => {
  const [toggleCreateGroup, setToggleCreateGroup] = useState(false);
  const [toggleShowFriends, setToggleShowFriends] = useState(false);

  return (
    <S.Wrapper>
      <S.Button onClick={() => setToggleCreateGroup(true)}>
        <S.Options>
          <S.AddGroupOption />
          Create group
        </S.Options>
        {toggleCreateGroup && (
          <CreateGroup setToggleCreateGroup={setToggleCreateGroup} />
        )}
      </S.Button>
      <S.Button onClick={() => setToggleShowFriends(true)}>
        <S.Options>
          <S.FriendsOption />
          Friend list
        </S.Options>
        {toggleShowFriends && (
          <ShowFriends setToggleShowFriends={setToggleShowFriends} />
        )}
      </S.Button>
    </S.Wrapper>
  );
};

export default TopNav;
