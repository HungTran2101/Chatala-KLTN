import styled, { keyframes } from "styled-components";
import tw from "twin.macro";
import { zoomIn } from "react-animations";
import { BiSearchAlt } from "react-icons/bi";
import { MdCancel } from "react-icons/md";

export const CreateGroupModal = styled.div`
  ${tw`flex fixed top-0 left-0 bottom-0 right-0 z-30`}
`;

export const CreateGroupOverlay = styled.div`
  ${tw`absolute bg-[#00000080] h-full w-full`}
`;

const zoomInAnimate = keyframes`${zoomIn}`;

export const CreateGroupBody = styled.div`
  ${tw`m-auto bg-darker py-2.5 px-3.5 rounded-[25px] z-10 min-w-[700px]`}
  border: 2px solid #ECF2F7;
  animation: 0.25s ${zoomInAnimate};
`;

export const CreateGroupTitle = styled.div`
  ${tw`text-2xl font-semibold mb-3 ml-1 text-white`}
`;

export const CreateGroupSearch = styled.div`
  ${tw`relative w-full flex items-center mb-4`}
`;
export const CreateGroupSearchInput = styled.input`
  ${tw`bg-[#F8F8F8] text-lg rounded-[50px] pr-2 pl-9 py-2 w-full`}
  outline: none;
`;

export const CreateGroupSearchIcon = styled(BiSearchAlt)`
  ${tw`absolute hover:cursor-pointer text-[28px] text-[#002B98] ml-1.5 left-0`}
`;

export const CreateGroupAddedUsers = styled.div`
  ${tw`flex overflow-hidden mb-2 items-center`}
`;

export const CreateGroupAddedUsersInner = styled.div`
  ${tw`flex w-0 flex-grow overflow-auto bg-secondary rounded-[20px]`}
  &::-webkit-scrollbar-track {
    ${tw`bg-transparent rounded-[10px]`}
  }

  &::-webkit-scrollbar {
    ${tw`h-[5px]`}
  }

  &::-webkit-scrollbar-thumb {
    ${tw`bg-dark rounded-[50px]`}
  }
`;

export const CreateGroupSubmit = styled.div`
  ${tw`text-primary ml-1 p-2 rounded-[20px] hover:cursor-pointer`}
`;

export const CreateGroupAddedUser = styled.span`
  ${tw`relative ml-1 mr-2 my-1 bg-gray-50 p-1 rounded-[20px] flex items-center`}
`;

export const CreateGroupAddedUserName = styled.span`
  ${tw`ml-2 w-[100px] overflow-ellipsis overflow-hidden whitespace-nowrap mr-1`}
`;

export const CreateGroupAddedUserAvatar = styled.figure`
  ${tw`relative w-[30px] h-[30px] rounded-full overflow-hidden flex-shrink-0`}
  border: 1px solid gray;
`;

export const CreateGroupAddedUserRemove = styled(MdCancel)`
  ${tw`absolute transition-colors bg-gray-200 rounded-full text-[20px] hover:opacity-80 hover:cursor-pointer right-[-5px] top-[-2px]`}
`;

export const GreateGroupList = styled.div`
  ${tw`max-h-[60vh] overflow-y-auto pr-1`}
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

export const CreateGroupItem = styled.div`
  ${tw`flex p-2 rounded-[20px] my-1.5 items-center relative w-full bg-secondary justify-between`}
`;

export const CreateGroupInfo = styled.div`
  ${tw`flex flex-grow items-center hover:cursor-pointer`}
`;

export const CreateGroupAvatar = styled.figure`
  ${tw`relative w-[55px] h-[55px] rounded-full overflow-hidden flex-shrink-0`}
  border: 1px solid gray;
`;

export const CreateGroupName = styled.div`
  ${tw`flex-grow font-semibold text-[18px] overflow-ellipsis ml-3.5`}
`;

export const CreateGroupAdd = styled.div`
  ${tw`text-primary bg-darker rounded-[50px] font-semibold text-sm px-5 py-2.5 ml-1 hover:opacity-100 hover:cursor-pointer opacity-90`}
`;

export const CreateGroupAdded = styled.div`
  ${tw`text-primary bg-gray-500 rounded-[50px] font-semibold text-sm px-5 py-2.5 ml-1 hover:cursor-default`}
`;