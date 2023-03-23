import Image from "next/image";
import { useSelector } from "react-redux";
import { selectRoomListState } from "../../../../features/redux/slices/roomListSlice";
import * as S from "./ChatPreviewItem.styled";

interface IChatPreviewItem {
  avatar?: string;
  active: boolean;
  msg: string;
  name?: string;
  index: number;
  onClick: () => void;
}

const ChatPreviewItem = ({
  avatar,
  msg,
  name = "Chat Bot",
  active,
  index,
  onClick,
}: IChatPreviewItem) => {
  const roomList = useSelector(selectRoomListState);

  return (
    <S.ChatPreviewItem active={active} onClick={onClick}>
      <S.Wrapper>
        <S.ChatAvatarWrapper>
          {avatar ? (
            <>
              <S.ChatAvatar>
                <Image
                  src={avatar}
                  alt="avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </S.ChatAvatar>
              {!roomList.list[index].roomInfo.isGroup && (
                <S.ChatStatus status={roomList.activeList[index]} />
              )}
            </>
          ) : (
            <S.ChatGroupAvatar />
          )}
        </S.ChatAvatarWrapper>
        <S.Content>
          <S.Name>{name}</S.Name>
          <S.Msg>{msg}</S.Msg>
        </S.Content>
      </S.Wrapper>
    </S.ChatPreviewItem>
  );
};

export default ChatPreviewItem;
