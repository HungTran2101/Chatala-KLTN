import { ClipLoader, PulseLoader } from 'react-spinners';
import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';

export const ChatAreaMainMsg = styled.div`
  ${tw`relative flex-grow w-full flex flex-col items-center`}
  }
`;

export const ChatAreaMainMsgOuter = styled.div`
  ${tw`relative flex-grow w-full overflow-y-auto overflow-x-hidden h-0 mb-3.5 pt-5 pr-1.5 flex flex-col-reverse`}

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

export const ChatAreaMainTyping = styled(PulseLoader)`
  ${tw`absolute bg-primary p-1 bottom-0 mb-[5px] rounded-[10px] shadow-md z-20`}
`;

export const ChatAreaMainMsgLoading = styled(ClipLoader)`
  ${tw`absolute bottom-2 right-[10px]`}
`;

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

export const ChatAreaMainMsgInnerBottom = styled.div``;

export const ChatAreaMainMsgInnerTop = styled.div`
  ${tw`flex justify-center`}
  @keyframes zoomOut {
    0%{
      transform: scale(0.5);
    }
    100%{
      transform: scale(1);
    }
  }
  animation: zoomOut 0.3s linear;
`;

export const ChatAreaMainMsgChatLoadEnd = styled.div`
${tw`text-[14px] italic`}
`