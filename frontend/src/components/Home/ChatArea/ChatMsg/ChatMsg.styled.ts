import styled from "styled-components";
import tw from "twin.macro";
import { FiMoreHorizontal } from "react-icons/fi";

export const ChatMsg = styled.div`
  ${tw`flex items-end mb-1.5`}
`;

export const ChatMsgReply = styled.div`
  ${tw`relative cursor-pointer`}
`;

export const ChatReplyLabel = styled.div`
  ${tw`text-[14px] flex items-center gap-1 mt-2`}
`

export const ChatMsgReplyText = styled.div`
  ${tw`flex items-center gap-2 bg-tertiary rounded-2xl px-3 pt-2 pb-5 mb-[-15px] ml-auto shadow-md`}
  filter: contrast(0.7);
  width: fit-content;
`;
export const ChatMsgReplyImage = styled.figure`
  ${tw`relative overflow-hidden max-w-[200px] mb-[-15px] rounded-[5px] shadow-md`}
  filter: contrast(0.5);
`;
export const ChatMsgReplyFileIcon = styled.span`
  ${tw`flex items-center justify-center p-1.5 bg-secondary rounded-full`}
`;

export const ChatMsgText = styled.div`
  ${tw`relative px-3 py-2 shadow-md`}
  width: fit-content;
`;

export const ChatMsgSenderName = styled.div<{ position: string }>`
  ${tw`absolute bottom-[-20px] left-[14px] text-[12px] text-gray-500 whitespace-nowrap invisible`}
  ${({ position }) =>
    (position === "bottom" || position === "alone") && tw`visible`}
`;

export const ChatMsgTextTail = styled.div`
  ${tw`absolute w-[30px] h-[30px] rounded-full`}
  &:before {
    ${tw`bg-tertiary`}
  }
`;

export const ChatMsgAvatar = styled.figure<{ position: string }>`
  ${tw`relative w-[40px] h-[40px] rounded-full shadow-md overflow-hidden flex-shrink-0 mb-[-5px] invisible self-end`}
  ${({ position }) =>
    (position === "bottom" || position === "alone") && tw`visible`}
  border: 1px solid gray;
`;

export const ChatMsgMoreIcon = styled(FiMoreHorizontal)<{ isleft?: number }>`
  ${tw`relative text-[20px] text-gray-600 cursor-pointer invisible`}
  ${({ isleft }) => (isleft === 1 ? tw`ml-3.5` : tw`mr-3.5`)}
`;

export const ChatMsgMoreIconWrapper = styled.div`
  ${tw`relative`}
`;

export const ChatMsgTextWrapper = styled.div`
  ${tw`relative flex items-center w-full`}
`;

export const ChatMsgFileImages = styled.div<{ imgNum: number }>`
  ${tw`relative grid gap-1 mt-1`}
  ${({ imgNum }) =>
    imgNum === 1
      ? tw`grid-cols-1 w-[400px]`
      : imgNum === 2
      ? tw`grid-cols-2 w-[350px]`
      : imgNum >= 3 && tw`grid-cols-3 w-[300px]`}
`;

export const ChatMsgFileImage = styled.figure<{ imgNum: number }>`
  ${tw`relative rounded-[5px] w-full h-full mx-0.5 hover:cursor-pointer overflow-hidden shadow-md`}
  ${({ imgNum }) => imgNum >= 2 && `aspect-ratio: 1`}
`;

export const ChatMsgFiles = styled.div`
  ${tw`flex flex-col w-[220px]`}
`;

export const ChatMsgFileIcon = styled.div`
  ${tw`flex items-center justify-center p-1.5 bg-secondary rounded-full`}
`;

export const ChatMsgFileName = styled.div`
  ${tw`ml-1.5 overflow-hidden text-[16px] font-semibold text-quaternary whitespace-nowrap overflow-ellipsis`}
`;

export const ChatMsgFile = styled.a`
  ${tw`relative flex items-center mt-1 mx-2 h-[50px] pl-1.5 pr-3.5 py-1 bg-primary rounded-[10px] shadow-md`}
`;

export const ChatMsgUnSend = styled.div`
  ${tw`border-2 py-2 px-2.5`}
  width: fit-content;
`;

export const ChatMsgWrapper = styled.div`
  ${tw`relative flex flex-col max-w-[70%]`}
  width: fit-content;
`;

export const ChatMsgLeft = styled(ChatMsg)<{ position: string }>`
  ${tw`relative items-center`}
  ${({ position }) =>
    (position === "bottom" || position === "alone") && tw`mb-7`}

  &:hover {
    ${ChatMsgMoreIcon} {
      visibility: visible;
    }
  }

  ${ChatMsgUnSend} {
    ${tw`ml-2`}
    ${({ position }) =>
      position === "alone"
        ? tw`rounded-2xl rounded-bl-none`
        : position === "top"
        ? tw`rounded-2xl rounded-bl-none`
        : tw`rounded-r-2xl`}
  }
  ${ChatMsgText} {
    ${tw`bg-primary ml-2`}
    ${({ position }) =>
      position === "alone"
        ? tw`rounded-2xl rounded-bl-none`
        : position === "top"
        ? tw`rounded-2xl rounded-bl-none`
        : tw`rounded-r-2xl`}
  }
  ${ChatReplyLabel}{
    ${tw`ml-2`}
  }
  ${ChatMsgReplyText} {
    ${tw`ml-2`}
  }
  ${ChatMsgReplyImage}{
    ${tw`ml-2`}
  }
  ${ChatMsgFileImages} {
    ${tw`ml-1.5`}
  }
  ${ChatMsgTextTail} {
    ${({ position }) =>
      position !== "bottom" && position !== "alone" && tw`invisible`}
    ${tw`bg-primary bottom-[-5px] left-[-13px]`}
    &::before {
      ${tw`rounded-full absolute h-[50px] w-[50px] left-[-28px] bottom-[-3px]`}
      content: '';
  }
`;

export const ChatMsgRight = styled(ChatMsg)<{ position: string }>`
  ${tw`relative flex-row-reverse items-center`}
  ${({ position }) =>
    (position === "bottom" || position === "alone") && tw`mb-7`}

  ${ChatMsgUnSend} {
    ${tw`mr-2`}
    ${({ position }) =>
      position === "alone"
        ? tw`rounded-2xl rounded-br-none`
        : position === "top"
        ? tw`rounded-2xl rounded-br-none`
        : tw`rounded-l-2xl`}
  }
  ${ChatMsgTextWrapper} {
    ${tw`flex flex-row-reverse`}
  }
  ${ChatReplyLabel}{
    ${tw`mr-2 justify-end`}
  }
  ${ChatMsgReplyText} {
    ${tw`mr-2`}
  }
  ${ChatMsgReplyImage}{
    ${tw`mr-2`}
  }
  ${ChatMsgText} {
    ${tw`bg-quaternary mr-2 rounded-br-[0]`}
    ${({ position }) =>
      position === "alone"
        ? tw`rounded-2xl rounded-br-none`
        : position === "top"
        ? tw`rounded-2xl rounded-br-none`
        : tw`rounded-l-2xl`}
  }
  ${ChatMsgTextTail} {
    ${({ position }) =>
      position !== "bottom" && position !== "alone" && tw`invisible`}
    ${tw`bg-quaternary bottom-[-5px] right-[-8px]`}
    &::before {
      ${tw`rounded-full absolute h-[50px] w-[50px] right-[-28px] bottom-[-3px]`}
      content: '';
    }
  }
  ${ChatMsgWrapper} {
    ${tw`items-end`}
  }
  ${ChatMsgFileImages} {
    ${tw`mr-2.5`}
  }
  ${ChatMsgSenderName} {
    ${tw`text-right left-auto right-[14px]`}
  }

  &:hover {
    ${ChatMsgMoreIcon} {
      visibility: visible;
    }
  }
`;

// sender: 82E8FF
// receiver: DFE2E2
