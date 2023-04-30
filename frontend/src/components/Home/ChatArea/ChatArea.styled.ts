import styled from "styled-components";
import tw from "twin.macro";
import { BsChevronCompactDown } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
export const ChatArea = styled.div`
  ${tw`relative bg-secondary shadow-md rounded-[20px] flex-grow flex flex-col overflow-hidden`}
`;

export const ChatAreaMain = styled.div`
  ${tw`relative flex flex-col flex-grow bg-tertiary px-6 pb-4 pt-0 rounded-[20px] shadow-inner items-center`}
`;

export const ChatAreaMainScrollBottom = styled(BsChevronCompactDown)`
  ${tw`absolute transition-all text-[25px] rounded-full bottom-[-3px] hover:cursor-pointer hover:bottom-[-5px]`}
`;

export const ChatChatAreaFilePreview = styled.div`
  ${tw`flex w-full rounded-[10px] pb-1 bg-[#E6E9EA] mb-1 overflow-hidden`}
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

export const ChatAreaReply = styled.div<{ isImg: string }>`
  ${tw`flex items-center justify-between gap-1.5 max-w-full w-full rounded-[10px] mb-1 py-1 px-2.5 z-0 bg-secondary`}
  ${({ isImg }) => isImg === "true" && tw`top-[-53px]`}
`;

export const ChatAreaReplyLabel = styled.span`
  ${tw`flex-shrink-0`}
`;
export const ChatAreaReplyContent = styled.span`
  ${tw`text-gray-500 overflow-hidden overflow-ellipsis flex-grow`}
  width: fit-content;
`;

export const ChatAreaReplyImage = styled.figure`
  ${tw`relative w-[45px] h-[45px] mr-auto`}
  filter: contrast(0.5);
`;

export const ChatAreaReplyCancel = styled(IoCloseSharp)`
  ${tw`hover:bg-tertiary rounded-full p-0.5 text-[20px] cursor-pointer`}
`;