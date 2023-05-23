import { Ref } from "react";
import * as S from "./ChatAreaMainMsg.styled";
import ChatMsg from "../ChatMsg";
import { useSelector } from "react-redux";
import { selectMessageState } from "../../../../features/redux/slices/messageSlice";
import { fileType, messageType } from "../../../../utils/types";
import { FiChevronsDown } from "react-icons/fi";

interface IChatAreaMainMsg {
  chatMainMsgOuter: Ref<HTMLDivElement>;
  bottomDiv: Ref<HTMLDivElement>;
  toggleTyping: boolean;
  newMsgNoti: boolean;
  isSubmitting: boolean;
  blockInput: boolean;
  setToggleImageZoom: (toggle: boolean) => void;
  setImageId: (value: string) => void;
  checkChatScrollBottom: () => void;
  newMsgNotiClick: () => void;
}

const ChatAreaMainMsg = ({
  chatMainMsgOuter,
  bottomDiv,
  toggleTyping,
  newMsgNoti,
  isSubmitting,
  blockInput,
  setImageId,
  setToggleImageZoom,
  checkChatScrollBottom,
  newMsgNotiClick,
}: IChatAreaMainMsg) => {
  const messages = useSelector(selectMessageState);

  //Message
  const skipDeletedMessage = (index: number, plus: boolean) => {
    const list = messages.list;

    let i = 1;
    if (plus) {
      while (list[index + i]?.deleted) {
        i++;
      }
    } else {
      while (list[index - i]?.deleted) {
        i++;
      }
    }

    return i;
  };

  const setMessagePosition = (data: messageType, index: number) => {
    const list = messages.list;

    if (
      data.senderId !==
        list[index + skipDeletedMessage(index, true)]?.senderId &&
      data.senderId === list[index - skipDeletedMessage(index, false)]?.senderId
    )
      return "top";
    else if (
      data.senderId ===
        list[index - skipDeletedMessage(index, false)]?.senderId &&
      data.senderId === list[index + skipDeletedMessage(index, true)]?.senderId
    )
      return "middle";
    else if (
      data.senderId !==
        list[index - skipDeletedMessage(index, false)]?.senderId &&
      data.senderId !== list[index + skipDeletedMessage(index, true)]?.senderId
    )
      return "alone";
    else return "bottom";
  };

  return (
    <S.ChatAreaMainMsg>
      <S.ChatAreaMainMsgOuter
        id="ChatAreaMainMsgOuter"
        ref={chatMainMsgOuter}
        onScroll={checkChatScrollBottom}
      >
        <S.ChatAreaMainMsgInner id="ChatAreaMainMsgInner">
          <S.ChatAreaMainMsgInnerBottom
            ref={bottomDiv}
          ></S.ChatAreaMainMsgInnerBottom>
          {messages.list.map((data, index) => (
            <ChatMsg
              data={data}
              position={setMessagePosition(data, index)}
              key={index}
              isLastMsg={index === 0 ? true : false}
              setToggleImageZoom={setToggleImageZoom}
              setImageId={setImageId}
              blockInput={blockInput}
            />
          ))}
        </S.ChatAreaMainMsgInner>
      </S.ChatAreaMainMsgOuter>
      {toggleTyping && (
        <S.ChatAreaMainTyping
          speedMultiplier={0.5}
          size={7}
          color="#769FCD"
          margin={2}
        ></S.ChatAreaMainTyping>
      )}
      {isSubmitting && (
        <S.ChatAreaMainMsgLoading
          size={20}
          speedMultiplier={0.5}
          color="#769FCD"
        ></S.ChatAreaMainMsgLoading>
      )}
      {newMsgNoti && (
        <S.ChatAreaMainNewNoti onClick={() => newMsgNotiClick()}>
          New message
          <FiChevronsDown size={20} />
        </S.ChatAreaMainNewNoti>
      )}
    </S.ChatAreaMainMsg>
  );
};

export default ChatAreaMainMsg;
