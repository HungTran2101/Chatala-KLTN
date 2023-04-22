import { Form } from "formik";
import { zoomIn } from "react-animations";
import { BsEmojiLaughingFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import styled, { keyframes } from "styled-components";
import tw from "twin.macro";

export const ChatAreaMainForm = styled(Form)`
  ${tw`w-full`}
`;

export const ChatAreaMainInput = styled.div`
  ${tw`relative flex items-center gap-2.5`}
`;

export const ChatAreaMainInputFile = styled.label`
  ${tw`flex flex-shrink-0 shadow text-quaternary bg-primary self-end rounded-full w-12 h-12 items-center justify-center text-4xl hover:cursor-pointer hover:opacity-80`}
`;

export const ChatAreaMainInputMsgOuter = styled.div`
  ${tw`relative flex-grow`}
`;

export const ChatAreaMainInputMsg = styled.div<{ isReplying: string }>`
  ${tw`relative flex flex-grow shadow items-center p-1.5 bg-[#DFE2E2] rounded-[20px]`}
  ${({ isReplying }) =>
    isReplying === "true" && tw`border-t-[1px] border-gray-400`}
`;

export const ChatAreaMainInputReply = styled.div<{ isImg: string }>`
  ${tw`flex items-center justify-between gap-1.5 max-w-full w-[95%] rounded-[10px] mb-[-8px] ml-3 pb-3 pt-1 px-2.5 z-0 bg-secondary`}
  ${({ isImg }) => isImg === "true" && tw`top-[-53px]`}
`;

export const ChatAreaMainInputReplyLabel = styled.span`
  ${tw`flex-shrink-0`}
`;
export const ChatAreaMainInputReplyContent = styled.span`
  ${tw`text-gray-500 overflow-hidden overflow-ellipsis flex-grow`}
  width: fit-content;
`;

export const ChatAreaMainInputReplyImage = styled.figure`
  ${tw`relative w-[45px] h-[45px] mr-auto`}
  filter: contrast(0.5);
`;

export const ChatAreaMainInputReplyCancel = styled(IoCloseSharp)`
  ${tw`hover:bg-tertiary rounded-full p-0.5 text-[20px] cursor-pointer`}
`;

export const ChatAreaMainInputEmoji = styled(BsEmojiLaughingFill)`
  ${tw`text-quaternary text-4xl hover:cursor-pointer hover:text-[#003BD2] transition-colors`}
`;

const ZoomInAnimation = keyframes`${zoomIn}`;

export const ChatAreaMainInputEmojiPicker = styled.div`
  ${tw`absolute rounded-[30px] overflow-hidden z-10`}
  border: 2px solid gray;
  transform: translate(55px, -230px);
  animation: 0.1s ${ZoomInAnimation};
`;

export const ChatAreaMainInputText = styled.span<{ username: string }>`
  ${tw`flex-grow outline-none bg-transparent text-lg ml-2.5 w-1 overflow-auto max-h-24 whitespace-normal hover:cursor-text z-10`}

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
