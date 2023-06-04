import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';
import { merge, zoomIn, slideInRight, slideInDown } from 'react-animations';

const cbAnimate1 = merge(slideInRight, slideInDown);
const FriendRequestAnimate = keyframes`${merge(zoomIn, cbAnimate1)}`;

export const FriendRequest = styled.div`
  ${tw`bg-secondary flex flex-col py-2.5 px-3.5 rounded-[20px] absolute shadow-md right-[140px] top-[55px] z-10 border-quaternary border-2`}
  animation: 0.2s ${FriendRequestAnimate};
`;

export const FriendRequestTitles = styled.div`
  ${tw`rounded-[20px] text-primary text-lg font-semibold bg-tertiary px-8 py-1.5 mb-1.5`}
  text-shadow: 0 0 5px #AAC4FF;
  width: fit-content;
`;

export const FriendRequestList = styled.div`
  ${tw`max-h-[70vh] overflow-y-auto pr-1`}
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

export const FriendRequestText = styled.div`
  ${tw`text-base italic p-3 text-center rounded-[10px] bg-secondary`}
`;

export const FriendRequestItem = styled.div`
  ${tw`flex p-2 rounded-[10px] my-1.5 items-center relative w-full bg-secondary`}
`;

export const FriendRequestInfo = styled.div`
  ${tw`flex items-center hover:cursor-pointer`}
`;

export const FriendRequestAvatar = styled.figure`
  ${tw`relative w-[55px] h-[55px] rounded-full overflow-hidden flex-shrink-0`}
  border: 1px solid gray;
`;
export const FriendRequestNameWrapper = styled.div`
  ${tw`ml-3.5`}
`;

export const FriendRequestName = styled.div`
  ${tw`font-semibold text-[18px] w-[175px]`}
`;

export const FriendRequestNumFriend = styled.div`
  ${tw`text-[#434343] text-[16px]`}
`;

export const FriendRequestOption = styled.div`
  ${tw`text-white rounded-[20px] font-semibold text-sm px-5 py-2.5 ml-1 hover:cursor-pointer hover:opacity-80`}
`;

export const FriendRequestAccept = styled(FriendRequestOption)`
  ${tw`bg-green-500`}
`;

export const FriendRequestDecline = styled(FriendRequestOption)`
  ${tw`bg-red-500`}
`;
