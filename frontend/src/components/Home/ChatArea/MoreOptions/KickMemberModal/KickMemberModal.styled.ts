import styled, { keyframes } from "styled-components";
import tw from "twin.macro";
import { zoomIn } from "react-animations";
import { BiSearchAlt } from "react-icons/bi";

export const KickMemberModal = styled.div`
  ${tw`flex fixed top-0 left-0 bottom-0 right-0 z-30`}
`;

export const KickMemberOverlay = styled.div`
  ${tw`absolute bg-[#00000080] h-full w-full`}
`;

const zoomInAnimate = keyframes`${zoomIn}`;

export const KickMemberBody = styled.div`
  ${tw`m-auto bg-quaternary py-2.5 px-3.5 rounded-[25px] z-10 min-w-[700px]`}
  border: 2px solid #ECF2F7;
  animation: 0.25s ${zoomInAnimate};
`;

export const KickMemberTitle = styled.div`
  ${tw`text-2xl font-semibold mb-3 ml-1 text-white`}
`;

export const KickMemberSearch = styled.div`
  ${tw`relative w-full flex items-center mb-4`}
`;
export const KickMemberSearchInput = styled.input`
  ${tw`bg-[#F8F8F8] text-lg rounded-[50px] pr-2 pl-9 py-2 w-full`}
  outline: none;
`;

export const KickMemberSearchIcon = styled(BiSearchAlt)`
  ${tw`absolute hover:cursor-pointer text-[28px] text-[#002B98] ml-1.5 left-0`}
`;

export const KickMemberList = styled.div`
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

export const KickMemberItem = styled.div`
  ${tw`flex p-2 rounded-[20px] my-1.5 items-center relative w-full bg-secondary justify-between`}
`;

export const KickMemberInfo = styled.div`
  ${tw`flex flex-grow items-center`}
`;

export const KickMemberAvatar = styled.figure`
  ${tw`relative w-[55px] h-[55px] rounded-full overflow-hidden flex-shrink-0`}
  border: 1px solid gray;
`;

export const KickMemberName = styled.div`
  ${tw`flex-grow font-semibold text-[18px] overflow-ellipsis ml-3.5`}
`;

export const KickMemberButton = styled.div`
  ${tw`text-primary bg-red-500 rounded-[50px] font-semibold text-sm px-5 py-2.5 ml-1 hover:opacity-100 hover:cursor-pointer opacity-80`}
`;