import ChatList from './ChatList';
import * as S from './SideBar.styled';
import TopNav from './TopNav';

const SideBar = () => {
  return (
    <S.SideBarContainer>
      <TopNav />
      <ChatList />
    </S.SideBarContainer>
  );
};

export default SideBar;
