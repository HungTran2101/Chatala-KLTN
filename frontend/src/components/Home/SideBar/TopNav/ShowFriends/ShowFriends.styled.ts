import { zoomIn } from 'react-animations';
import { AiOutlineRight } from 'react-icons/ai';
import { BiSearchAlt } from 'react-icons/bi';
import { HiChevronRight } from 'react-icons/hi';
import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';

export const ShowFriendsModal = styled.div`
  ${tw`flex fixed top-0 left-0 bottom-0 right-0 z-30`}
`;

export const ShowFriendsOverlay = styled.div`
  ${tw`absolute bg-[#00000080] h-full w-full`}
`;

const zoomInAnimate = keyframes`${zoomIn}`;

export const ShowFriendsBody = styled.div`
  ${tw`m-auto bg-quaternary py-2.5 px-3.5 rounded-[25px] z-10 max-w-[700px] w-full`}
  border: 2px solid #ECF2F7;
  animation: 0.25s ${zoomInAnimate};
`;

export const ShowFriendsTitle = styled.div`
  ${tw`text-2xl font-semibold mb-3 ml-1 text-white`}
`;

export const ShowFriendsSearch = styled.div`
  ${tw`relative w-full flex items-center mb-4`}
`;
export const ShowFriendsSearchInput = styled.input`
  ${tw`bg-secondary text-lg rounded-[20px] pr-2 pl-9 py-2 w-full`}
  outline: none;
`;

export const ShowFriendsSearchIcon = styled(BiSearchAlt)`
  ${tw`absolute hover:cursor-pointer text-[28px] text-[#002B98] ml-1.5 left-0`}
`;

export const FriendList = styled.div`
  ${tw`max-h-[60vh] overflow-y-auto pr-1`}
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

// export const ShowFriendsItem = styled.div`
//   ${tw`flex p-2 rounded-[20px] my-1.5 items-center relative w-full bg-secondary justify-between`}
// `;

export const ShowFriendsInfo = styled.div`
  ${tw`relative flex flex-grow my-1 p-2 items-center hover:cursor-pointer border-b-[2px] justify-between`}
`;

export const ShowFriendsAvatar = styled.figure`
  ${tw`relative w-[60px] h-[60px] rounded-lg overflow-hidden flex-shrink-0`}
  border: 1px solid #eee;
`;

export const ShowFriendsName = styled.div`
  ${tw`flex-grow font-semibold text-[18px] overflow-ellipsis ml-3.5`}
`;

export const ShowFriendsOption = styled.div`
  ${tw`text-blue-300 bg-gray-500 rounded-[50px] font-semibold text-sm px-5 py-2.5 ml-1 hover:opacity-100 hover:cursor-pointer opacity-90`}
`;

export const LeftWrap = styled.div`
  ${tw`flex items-center`}
`;

export const BackIcon = styled(AiOutlineRight)`
  ${tw`text-xl`}
`;
