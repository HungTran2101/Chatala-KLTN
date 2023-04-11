import styled, { keyframes } from "styled-components";
import tw from "twin.macro";
import { BsChevronCompactDown, BsEmojiLaughingFill } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import { zoomIn } from "react-animations";
import { Form } from "formik";
import { ClipLoader, PulseLoader } from "react-spinners";
export const ChatArea = styled.div`
  ${tw`relative bg-secondary shadow-md rounded-[20px] flex-grow flex flex-col overflow-hidden`}
`;

export const ChatAreaMain = styled.div`
  ${tw`relative flex flex-col flex-grow bg-tertiary px-6 pb-4 pt-0 rounded-[20px] shadow-inner items-center`}
`;

export const ChatAreaMainMsg = styled.div`
  ${tw`relative flex-grow w-full flex flex-col items-center`}
  }
`;

export const ChatAreaMainMsgOuter = styled.div`
  ${tw`relative flex-grow w-full overflow-y-auto overflow-x-hidden h-0 mb-3 pt-5 pr-1.5 flex flex-col-reverse`}

  &::-webkit-scrollbar-track {
    ${tw`rounded-[10px] bg-transparent`}
  }

  &::-webkit-scrollbar {
    ${tw`w-[5px]`}
  }

  &::-webkit-scrollbar-thumb {
    ${tw`rounded-[50px] bg-quaternary`}
  }
`;

export const ChatAreaMainMsgInner = styled.div`
  ${tw`flex flex-col-reverse pb-2`}
`;

export const ChatAreaMainMsgInnerBottom = styled.div``;

const msgNewNotiAnimation = keyframes`
  0% {
    transform: translateY(0)
  }
  90% {
    transform: translateY(0)
  }
  100% {
    transform: translateY(3px)
  }
`;

export const ChatAreaMainNewNoti = styled.div`
  ${tw`absolute bg-secondary top-3 pl-2 pr-1.5 py-1 shadow-md rounded-[10px] opacity-80 flex items-center z-20 hover:cursor-pointer hover:opacity-100`}
  animation: ${msgNewNotiAnimation} 1.5s linear infinite alternate;
`;

export const ChatAreaMainTyping = styled(PulseLoader)`
  ${tw`absolute bg-primary p-1 bottom-0 mb-[5px] rounded-[10px] shadow-md z-20`}
`;

export const ChatAreaMainMsgLoading = styled(ClipLoader)`
  ${tw`absolute bottom-2 right-[10px]`}
`;

export const ChatAreaMainScrollBottom = styled(BsChevronCompactDown)`
  ${tw`absolute transition-all text-[25px] rounded-full bottom-[-3px] hover:cursor-pointer hover:bottom-[-5px]`}
`;

export const ChatChatAreaFilePreview = styled.div`
  ${tw`flex w-full rounded-[10px] pb-1 bg-[#E6E9EA] mb-1.5 overflow-hidden`}
`;

export const ChatChatAreaFilePreviewInner = styled.div`
  ${tw`flex flex-grow p-2 pt-3.5 w-0 overflow-x-auto pb-2 z-0`}

  &::-webkit-scrollbar-track {
    ${tw`rounded-[10px] bg-transparent`}
  }

  &::-webkit-scrollbar {
    ${tw`h-[5px]`}
  }

  &::-webkit-scrollbar-thumb {
    ${tw`rounded-[50px] bg-tertiary`}
  }
  &::-webkit-scrollbar-thumb:hover {
    ${tw`bg-quaternary`}
  }
`;

export const ChatAreaMainForm = styled(Form)`
  ${tw`w-full`}
`;

export const ChatAreaMainInput = styled.div`
  ${tw`relative flex items-center`}
`;

export const ChatAreaMainInputFile = styled.label`
  ${tw`flex flex-shrink-0 shadow text-quaternary bg-primary rounded-full w-12 h-12 items-center justify-center text-4xl hover:cursor-pointer hover:opacity-80`}
`;

export const ChatAreaMainInputMsg = styled.div`
  ${tw`flex flex-grow shadow items-center p-1.5 bg-[#DFE2E2] ml-2.5 rounded-[20px] relative`}
`;

export const ChatAreaMainInputEmoji = styled(BsEmojiLaughingFill)`
  ${tw`text-quaternary text-4xl hover:cursor-pointer hover:text-[#003BD2] transition-colors`}
`;

const ZoomInAnimation = keyframes`${zoomIn}`;

export const ChatAreaMainInputEmojiPicker = styled.div`
  ${tw`absolute rounded-[30px] overflow-hidden`}
  border: 2px solid gray;
  transform: translate(55px, -230px);
  animation: 0.1s ${ZoomInAnimation};
`;

export const ChatAreaMainInputText = styled.span<{ username: string }>`
  ${tw`flex-grow outline-none bg-transparent text-lg ml-2.5 w-1 overflow-auto max-h-24 whitespace-normal hover:cursor-text`}

  &:empty::before {
    content: "Write something to ${({ username }) => username}...";
    ${tw`cursor-text text-gray-400`}
  }
  &::-webkit-scrollbar-track {
    ${tw`rounded-[10px] bg-transparent`}
  }

  &::-webkit-scrollbar {
    ${tw`w-[2px]`}
  }

  &::-webkit-scrollbar-thumb {
    ${tw`rounded-[50px] bg-quaternary`}
  }
`;

export const ChatAreaMainInputButtonSend = styled.button`
  ${tw`bg-quaternary text-primary hover:text-secondary p-2 rounded-full ml-2.5 outline-none`}
`;

export const ChatAreaMainInputSendIcon = styled(RiSendPlaneFill)`
  ${tw`text-[20px]`}
`;

export const ChatAreaMainDropZone = styled.div`
  ${tw`absolute flex items-center justify-center text-gray-200 text-2xl tracking-wide font-medium h-full w-full bg-[#00000099] left-0 top-0 z-10`}
`;
