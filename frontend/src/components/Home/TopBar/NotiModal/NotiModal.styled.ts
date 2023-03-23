import styled, { keyframes } from "styled-components";
import tw from "twin.macro";
import { merge, zoomIn, slideInRight, slideInDown } from "react-animations";

const cbAnimate1 = merge(slideInRight, slideInDown);
const NotiAnimate = keyframes`${merge(zoomIn, cbAnimate1)}`;

export const Noti = styled.div`
  ${tw`bg-secondary flex flex-col py-2.5 px-3.5 rounded-[20px] absolute shadow-md right-[140px] top-[55px] z-10 border-darker border-2`}
  animation: 0.2s ${NotiAnimate};
`;

export const NotiTitles = styled.div`
  ${tw`rounded-[20px] text-primary text-lg font-semibold bg-dark px-8 py-1.5 mb-1.5`}
  text-shadow: 0 0 5px #AAC4FF;
  width: fit-content;
`;

export const NotiList = styled.div`
  ${tw`max-h-[70vh] overflow-y-auto pr-1`}
  &::-webkit-scrollbar-track {
    ${tw`bg-transparent rounded-[10px]`}
  }

  &::-webkit-scrollbar {
    ${tw`w-[5px]`}
  }

  &::-webkit-scrollbar-thumb {
    ${tw`bg-dark rounded-[50px]`}
  }
`;

export const NotiText = styled.div`
  ${tw`text-base italic p-3 text-center rounded-[50px] bg-[#bedee7] text-black`}
`;

export const NotiItem = styled.div`
  ${tw`flex p-2 rounded-[20px] my-1.5 items-center relative w-full bg-dark`}
`;

export const NotiInfo = styled.div`
  ${tw`flex items-center hover:cursor-pointer`}
`;

export const NotiAvatar = styled.figure`
  ${tw`relative w-[55px] h-[55px] rounded-full overflow-hidden flex-shrink-0`}
  border: 1px solid gray;
`;
export const NotiNameWrapper = styled.div`
  ${tw`ml-3.5`}
`;

export const NotiName = styled.div`
  ${tw`text-primary font-semibold text-[18px] w-[175px]`}
`;

export const NotiNumFriend = styled.div`
  ${tw`text-[#434343] text-[16px]`}
`;

export const NotiOption = styled.div`
  ${tw`text-white rounded-[20px] font-semibold text-sm px-5 py-2.5 ml-1 hover:cursor-pointer hover:opacity-80`}
`;

export const NotiAccept = styled(NotiOption)`
  ${tw`bg-green-500`}
`;

export const NotiDecline = styled(NotiOption)`
  ${tw`bg-red-500`}
`;
