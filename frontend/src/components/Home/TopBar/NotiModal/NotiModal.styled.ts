import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';
import { merge, zoomIn, slideInRight, slideInDown } from 'react-animations';

const cbAnimate1 = merge(slideInRight, slideInDown);
const NotiAnimate = keyframes`${merge(zoomIn, cbAnimate1)}`;

export const Noti = styled.div`
  ${tw`bg-secondary flex flex-col py-2.5 px-3.5 rounded-[20px] absolute shadow-md right-[140px] top-[55px] z-10 border-quaternary border-2`}
  animation: 0.2s ${NotiAnimate};
`;

export const NotiTitles = styled.div`
  ${tw`rounded-[20px] text-primary text-lg font-semibold bg-tertiary px-8 py-1.5 mb-1.5`}
  text-shadow: 0 0 5px #AAC4FF;
  width: fit-content;
`;

export const NotiList = styled.div`
  ${tw`max-h-[50vh] overflow-y-auto pr-1`}
  &::-webkit-scrollbar-track {
    ${tw`bg-transparent rounded-[10px]`}
  }

  &::-webkit-scrollbar {
    ${tw`w-[5px]`}
  }

  &::-webkit-scrollbar-thumb {
    ${tw`bg-tertiary rounded-[50px]`}
  }
`;

export const NotiText = styled.div`
  ${tw`text-base italic p-3 text-center rounded-[10px] bg-secondary text-black`}
`;

export const NotiItem = styled.div<{isUnread: boolean}>`
  ${tw`flex p-2 rounded-[10px] my-1.5 items-center relative w-full hover:bg-secondary`}
  ${({isUnread}) => isUnread && tw`bg-primary`}
`;

export const NotiInfo = styled.div`
  ${tw`flex items-center`}
`;

export const NotiAvatar = styled.figure`
  ${tw`relative w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0`}
  border: 1px solid gray;
`;
export const NotiNameWrapper = styled.div`
  ${tw`ml-3.5`}
`;

export const NotiName = styled.span`
  ${tw`text-[16px] font-semibold`}
`;

export const NotiTime = styled.div`
  ${tw`text-[12px] text-gray-600`}
`;
