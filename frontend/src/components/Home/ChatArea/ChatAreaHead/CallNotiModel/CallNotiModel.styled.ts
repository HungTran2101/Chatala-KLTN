import styled from "styled-components";
import tw from "twin.macro";

export const CallNotiModal = styled.div`
  ${tw`flex fixed top-0 left-0 bottom-0 right-0 z-30 justify-center items-center`}
`;

export const CallNotiOverlay = styled.div`
  ${tw`absolute bg-[#00000080] h-full w-full z-0`}
`;

export const CallNotiBody = styled.div`
  ${tw`relative flex flex-col bg-white border-2 border-quaternary rounded-[20px]`}
`;

export const CallNotiInfo = styled.div`
  ${tw`flex flex-col items-center`}
`;

export const CallNotiLabel = styled.div`
  ${tw`mt-10 text-lg`}
`;

export const CallNotiAvatar = styled.figure`
  ${tw`relative overflow-hidden rounded-full w-[80px] h-[80px] border-2 border-quaternary mx-10 my-5`}
`;

export const CallNotiCallerName = styled.div`
  ${tw`font-semibold text-2xl`}
`;

export const CallNotiControls = styled.div`
  ${tw`flex justify-between m-8 mx-14 gap-20`}
`;

export const CallNotiControl = styled.span`
  ${tw`flex flex-col items-center transition-all`}
  &:hover{
    transform: scale(1.05);
  }
`;

export const CallNotiAccept = styled(CallNotiControl)`
  ${tw`font-semibold text-[14px]`}

  svg {
    ${tw`bg-green-600 p-2 text-[50px] text-primary cursor-pointer rounded-full mb-2 shadow-md`}
    animation: wiggle 1s linear infinite;

    @keyframes wiggle {
      70% {
        transform: rotate(0deg);
      }
      80% {
        transform: rotate(-15deg);
      }
      90% {
        transform: rotate(30deg);
      }
      100% {
        transform: rotate(-15deg);
      }
    }
  }
`;

export const CallNotiDecline = styled(CallNotiControl)`
  ${tw`font-semibold text-[14px]`}

  svg {
    ${tw`bg-red-600 p-2 text-[50px] text-primary cursor-pointer rounded-full mb-2 shadow-md`}
  }
`;
