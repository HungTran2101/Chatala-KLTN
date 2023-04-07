import styled, { keyframes } from "styled-components";
import tw from "twin.macro";
import { merge, zoomIn, slideInRight, slideInDown } from "react-animations";
import { AiOutlineEdit } from "react-icons/ai";
import { HiUserGroup } from "react-icons/hi";

const cbAnimate1 = merge(slideInRight, slideInDown);
const MoreOptionAnimate = keyframes`${slideInRight}`;

export const MoreOptions = styled.div<{ toggleOption: boolean }>`
  ${tw`bg-secondary absolute shadow-md z-30 right-[-320px] h-full w-[320px] duration-300`}
  animation: 0.3s ${MoreOptionAnimate};
  ${({ toggleOption }) => (toggleOption ? tw`right-0` : tw`right-[-320px]`)}
`;

export const RoomInfo = styled.div`
  ${tw`flex flex-col items-center bg-white mb-3`}
`;

export const RoomInfoTitle = styled.div`
  ${tw`font-semibold py-3 text-[22px] border-b-[1px] w-full text-center border-b-quaternary`}
`;

export const RoomInfoAvatar = styled.figure`
  ${tw`relative w-[60px] h-[60px] rounded-full overflow-hidden mt-4 mb-2 border-2 border-quaternary`}
`;

export const RoomInfoGroupAvatar = styled(HiUserGroup)`
  ${tw`text-gray-600 text-[60px] mt-4 mb-2 rounded-full`}
`;

export const RoomInfoNameWrap = styled.div`
  ${tw`relative flex items-center text-[20px] font-semibold mb-4`}
`;

export const RoomInfoName = styled.div`
  ${tw`w-[200px] text-center whitespace-nowrap overflow-ellipsis overflow-hidden`}
`;

export const RoomInfoNameEditIcon = styled(AiOutlineEdit)`
  ${tw`absolute right[-30px] bg-tertiary rounded-full p-[2px] text-[23px] hover:cursor-pointer hover:opacity-80`}
`;

export const OptionItem = styled.div<{ color?: string }>`
  ${tw`text-sm px-3 -mx-3 py-2 rounded-[5px] cursor-pointer duration-200`}
`;

export const NormalItem = styled(OptionItem)`
  ${tw`hover:bg-tertiary flex`}
`;

export const DeleteItem = styled(OptionItem)`
  ${tw`text-red-500 hover:bg-red-100`}
`;

export const OptionWrap = styled.div``;

export const WhiteBox = styled.div`
  ${tw`p-5 py-2 bg-white mb-3`}
`;

export const Title = styled.p`
  ${tw`font-semibold text-base flex justify-between items-center cursor-pointer my-0.5`}
`;

export const ExtendContent = styled.div`
  ${tw`relative flex flex-col justify-between overflow-hidden`}
`;

export const FileWrap = styled.div<{ wraptype?: string, visible: boolean }>`
  ${({ wraptype }) =>
    wraptype === "file" ? tw`flex flex-col` : tw`grid grid-cols-3`}
  ${({visible}) => visible ? tw`h-full` : tw`h-0`}
  ${tw`gap-1`}
`;

export const UploadedMedia = styled.figure`
  ${tw`relative mx-1 rounded-[5px] cursor-pointer overflow-hidden`}
  aspect-ratio: 1;
`;

export const MoreButton = styled.button`
  ${tw`text-sm px-3 py-2 w-full rounded-[5px] cursor-pointer duration-200 bg-secondary font-semibold my-2`}
`;

export const FilePreview = styled.a`
  ${tw`relative flex items-center h-[50px] pl-1.5 pr-3.5 py-1 bg-primary rounded-[5px] shadow-md`}
`;

export const FilePreviewIcon = styled.div`
  ${tw`flex items-center justify-center p-1.5 bg-secondary rounded-full`}
`;

export const FilePreviewName = styled.div`
  ${tw`ml-1.5 w-full text-[16px] font-semibold text-quaternary whitespace-nowrap overflow-ellipsis overflow-hidden`}
`;
