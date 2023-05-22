import * as S from './TopNav.styled';
import { useState } from 'react';
import CreateGroup from './CreateGroup';
import ShowFriends from './ShowFriends';

const TopNav = () => {
  const [toggleCreateGroup, setToggleCreateGroup] = useState(false);
  const [toggleShowFriends, setToggleShowFriends] = useState(false);

  const showModalFriend = () => {
    setToggleShowFriends(true);
  };

  const closeModalFriend = () => {
    setToggleShowFriends(false);
  };

  const showModalGroup = () => {
    setToggleCreateGroup(true);
  };

  const closeModalGroup = () => {
    setToggleCreateGroup(false);
  };
  return (
    <S.Wrapper>
      <S.Button onClick={showModalGroup}>
        <S.Options>
          <S.AddGroupOption />
          Create group
        </S.Options>
      </S.Button>
      <S.Button onClick={showModalFriend}>
        <S.Options>
          <S.FriendsOption />
          Friend list
        </S.Options>
      </S.Button>
      <CreateGroup onClose={closeModalGroup} open={toggleCreateGroup} />
      <ShowFriends onClose={closeModalFriend} open={toggleShowFriends} />
    </S.Wrapper>
  );
};

export default TopNav;
