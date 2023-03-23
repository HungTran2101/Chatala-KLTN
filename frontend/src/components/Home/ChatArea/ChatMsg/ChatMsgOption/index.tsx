import { useOutsideClick } from "../../../../Global/ProcessFunctions";
import * as S from "./ChatMsgOption.styled";
import { MessageApi } from "../../../../../services/api/messages";
import { useDispatch, useSelector } from "react-redux";
import { messageActions } from "../../../../../features/redux/slices/messageSlice";
import { selectRoomInfoState } from "../../../../../features/redux/slices/roomInfoSlice";
import { selectUserState } from "../../../../../features/redux/slices/userSlice";
import { useSocketContext } from "../../../../../contexts/socket";

interface IChatMsgOption {
  msgId: string;
  setToggleOption: (toogle: boolean) => void;
}

const ChatMsgOption = ({ msgId, setToggleOption }: IChatMsgOption) => {
  const dispatch = useDispatch();

  const handleOutsideClick = () => {
    setToggleOption(false);
  };

  const chatMsgOptionRef = useOutsideClick(handleOutsideClick);

  const roomInfo = useSelector(selectRoomInfoState);
  const user = useSelector(selectUserState);
  const friend = roomInfo.info.roomInfo.users.find(
    (it) => it.uid !== user.info._id
  );
  const socket = useSocketContext();

  const unsendMsg = async () => {
    await MessageApi.unsend(msgId);
    dispatch(messageActions.unsend(msgId));
    if (!roomInfo.info.roomInfo.isGroup) {
      socket.emit("unsend msg", friend.uid, msgId);
    }
    setToggleOption(false);
  };

  const deleteMsg = async () => {
    await MessageApi.delete(msgId);
    dispatch(messageActions.delete(msgId));
    if (!roomInfo.info.roomInfo.isGroup) {
      socket.emit("delete msg", friend.uid, msgId);
    }
    setToggleOption(false);
  };

  return (
    <S.ChatMsgOption ref={chatMsgOptionRef}>
      <S.NormalItem onClick={() => unsendMsg()}>Unsend</S.NormalItem>
      <S.DeteleItem onClick={() => deleteMsg()}>Delete</S.DeteleItem>
    </S.ChatMsgOption>
  );
};

export default ChatMsgOption;
