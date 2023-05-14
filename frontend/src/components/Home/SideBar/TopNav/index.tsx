import * as S from './TopNav.styled';
import { useState } from 'react';
import CreateGroup from './CreateGroup';
import ShowFriends from './ShowFriends';

const TopNav = () => {
  const [toggleCreateGroup, setToggleCreateGroup] = useState(false);
  const [toggleShowFriends, setToggleShowFriends] = useState(false);

  return (
    <S.Wrapper>
      <S.Button>
        <S.Options>
          <S.AddGroupOption onClick={() => setToggleCreateGroup(true)} />
        </S.Options>
        {toggleCreateGroup && (
          <CreateGroup setToggleCreateGroup={setToggleCreateGroup} />
        )}
      </S.Button>
      <S.Button>
        <S.Options>
          <S.FriendsOption onClick={() => setToggleShowFriends(true)} />
        </S.Options>
        {toggleShowFriends && (
          <ShowFriends setToggleShowFriends={setToggleShowFriends} />
        )}
      </S.Button>
    </S.Wrapper>
  );
};

export default TopNav;
