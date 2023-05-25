import * as S from './TopNav.styled';
import { useState } from 'react';
import CreateGroup from './CreateGroup';
import ShowFriends from './ShowFriends';
import { useSelector } from 'react-redux';
import { selectUtilState } from '../../../../features/redux/slices/utilSlice';

const TopNav = () => {
  const [toggleCreateGroup, setToggleCreateGroup] = useState(false);
  const [toggleShowFriends, setToggleShowFriends] = useState(false);

  const UIText = useSelector(selectUtilState).UItext.sideBar.topNav

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
          {UIText.createGroup.title}
        </S.Options>
      </S.Button>
      <S.Button onClick={showModalFriend}>
        <S.Options>
          <S.FriendsOption />
          {UIText.friendList.title}
        </S.Options>
      </S.Button>
      <CreateGroup onClose={closeModalGroup} open={toggleCreateGroup} />
      <ShowFriends onClose={closeModalFriend} open={toggleShowFriends} />
    </S.Wrapper>
  );
};

export default TopNav;
