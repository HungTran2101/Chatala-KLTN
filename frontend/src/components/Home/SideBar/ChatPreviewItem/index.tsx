import Image from "next/image";
import * as S from "./ChatPreviewItem.styled";
import { roomInfo } from "../../../../utils/types";
import { useSelector } from "react-redux";
import { selectUserState } from "../../../../features/redux/slices/userSlice";

interface IChatPreviewItem {
  active: boolean;
  roomInfo: roomInfo;
  status: number;
  onClick: () => void;
}

const ChatPreviewItem = ({
  active,
  roomInfo,
  status,
  onClick,
}: IChatPreviewItem) => {
  const loggeduser = useSelector(selectUserState);

  const unReadMsgNumber = roomInfo.roomInfo.users.find(
    (user) => user.uid === loggeduser.info._id
  ).unReadMsg;

  return (
    <S.ChatPreviewItem
      active={active}
      unReadMsg={unReadMsgNumber}
      onClick={onClick}
    >
      <S.Wrapper>
        <S.ChatAvatarWrapper>
          {roomInfo.roomAvatar ? (
            <>
              <S.ChatAvatar>
                <Image
                  src={roomInfo.roomAvatar}
                  alt="avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </S.ChatAvatar>
              {!roomInfo.roomInfo.isGroup && <S.ChatStatus status={status} />}
            </>
          ) : (
            <S.ChatGroupAvatar />
          )}
        </S.ChatAvatarWrapper>
        <S.Content>
          <S.Name>{roomInfo.roomName}</S.Name>
          <S.Msg semibold={unReadMsgNumber >= 1}>{roomInfo.roomInfo.lastMsg}</S.Msg>
        </S.Content>
      </S.Wrapper>
      {unReadMsgNumber >= 1 && (
        <S.UnReadMsgNoti>{unReadMsgNumber < 100 ? unReadMsgNumber : "99+"}</S.UnReadMsgNoti>
      )}
    </S.ChatPreviewItem>
  );
};

export default ChatPreviewItem;
