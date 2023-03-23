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
      {/* <ChatPreviewItem
        index={-2}
        active={false}
        msg='Halo halo niece and nephew, today uncle Roger'
        setRoomSelected={setRoomSelected}
        onClick={() => dispatch(roomInfoActions.clearRoomInfo(null))}
      /> */}
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
