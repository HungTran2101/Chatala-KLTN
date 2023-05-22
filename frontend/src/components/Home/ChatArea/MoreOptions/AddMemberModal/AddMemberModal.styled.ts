import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';
import { zoomIn } from 'react-animations';
import { BiSearchAlt } from 'react-icons/bi';

export const AddMemberModal = styled.div`
  ${tw`flex fixed top-0 left-0 bottom-0 right-0 z-30`}
`;

export const AddMemberOverlay = styled.div`
  ${tw`absolute bg-[#00000080] h-full w-full`}
`;

const zoomInAnimate = keyframes`${zoomIn}`;

export const AddMemberBody = styled.div`
  ${tw`m-auto bg-quaternary py-2.5 px-3.5 rounded-[25px] z-10 min-w-[700px]`}
  border: 2px solid #ECF2F7;
  animation: 0.25s ${zoomInAnimate};
`;

export const AddMemberTitle = styled.div`
  ${tw`text-2xl font-semibold mb-3 ml-1 text-white`}
`;

export const AddMemberSearch = styled.div`
  ${tw`relative w-full flex items-center mb-4`}
`;
export const AddMemberSearchInput = styled.input`
  ${tw`bg-secondary text-lg rounded-[50px] pr-2 pl-9 py-2 w-full`}
  outline: none;
`;

export const AddMemberSearchIcon = styled(BiSearchAlt)`
  ${tw`absolute hover:cursor-pointer text-[28px] text-[#002B98] ml-1.5 left-0`}
`;

export const AddMemberList = styled.div`
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

export const AddMemberItem = styled.div`
  ${tw`relative flex flex-grow my-1 p-2 items-center border-b-[2px] justify-between`}
`;

export const AddMemberInfo = styled.div`
  ${tw`flex flex-grow items-center`}
`;

export const AddMemberAvatar = styled.figure`
  ${tw`relative w-[60px] h-[60px] rounded-lg overflow-hidden flex-shrink-0`}
  border: 1px solid #eee;
`;

export const AddMemberName = styled.div`
  ${tw`flex-grow font-semibold text-[18px] overflow-ellipsis ml-3.5`}
`;

export const AddMemberButton = styled.div`
  ${tw`text-primary bg-quaternary rounded-[10px] font-semibold text-sm px-4 py-2 ml-1 hover:opacity-100 hover:cursor-pointer opacity-90`}
`;
