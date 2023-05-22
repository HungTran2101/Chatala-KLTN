import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';
import { zoomIn } from 'react-animations';
import { BiSearchAlt } from 'react-icons/bi';

export const GroupMembersModal = styled.div`
  ${tw`flex fixed top-0 left-0 bottom-0 right-0 z-30`}
`;

export const GroupMembersOverlay = styled.div`
  ${tw`absolute bg-[#00000080] h-full w-full`}
`;

const zoomInAnimate = keyframes`${zoomIn}`;

export const GroupMembersBody = styled.div`
  ${tw`m-auto bg-quaternary py-2.5 px-3.5 rounded-[25px] z-10 min-w-[700px]`}
  border: 2px solid #ECF2F7;
  animation: 0.25s ${zoomInAnimate};
`;

export const GroupMembersTitle = styled.div`
  ${tw`text-2xl font-semibold mb-3 ml-1 text-white`}
`;

export const GroupMembersSearch = styled.div`
  ${tw`relative w-full flex items-center mb-4`}
`;
export const GroupMembersSearchInput = styled.input`
  ${tw`bg-secondary text-lg rounded-[50px] pr-2 pl-9 py-2 w-full`}
  outline: none;
`;

export const GroupMembersSearchIcon = styled(BiSearchAlt)`
  ${tw`absolute hover:cursor-pointer text-[28px] text-[#002B98] ml-1.5 left-0`}
`;

export const GroupMembersList = styled.div`
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

export const GroupMembersItem = styled.div`
  ${tw`relative flex flex-grow my-1 p-2 items-center border-b-[2px] justify-between`}
`;

export const GroupMembersInfo = styled.div`
  ${tw`flex flex-grow justify-between items-center hover:cursor-pointer`}
`;

export const GroupMembersAvatar = styled.figure`
  ${tw`relative w-[60px] h-[60px] rounded-lg overflow-hidden flex-shrink-0`}
  border: 1px solid #eee;
`;

export const GroupMembersName = styled.div`
  ${tw`flex-grow font-semibold text-[18px] overflow-ellipsis ml-3.5`}
`;

export const GroupMembersChangeNickname = styled.div`
  ${tw`text-primary bg-quaternary rounded-[50px] font-semibold text-sm px-5 py-2.5 ml-1 hover:opacity-100 hover:cursor-pointer opacity-90`}
`;

export const KickMemberButton = styled.div`
  ${tw`bg-white hover:bg-red-500 border-red-500 border-[1px] text-red-500 hover:text-white rounded-[5px] font-semibold text-sm px-2 py-1 ml-1 hover:cursor-pointer duration-300`}
`;

export const LeftWrap = styled.div`
  ${tw`flex items-center`}
`;
