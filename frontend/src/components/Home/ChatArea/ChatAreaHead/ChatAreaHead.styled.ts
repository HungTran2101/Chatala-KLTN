import { FaCircle } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { IoMenu } from "react-icons/io5";
import styled from "styled-components";
import tw from "twin.macro";

export const ChatAreaHead = styled.div`
  ${tw`relative flex justify-between items-center py-1.5 px-7`}
`;

export const ChatAreaHeadInfo = styled.div`
  ${tw`flex items-center cursor-default`}
`;

export const ChatGroupAvatar = styled(HiUserGroup)`
  ${tw`text-gray-600 text-[50px] rounded-full`}
`;

export const ChatAreaHeadAvatar = styled.figure`
  ${tw`relative w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0`}
  border: 1px solid gray;
`;

export const ChatAreaHeadNameWrapper = styled.div`
  ${tw`ml-3.5`}
`;

export const ChatAreaHeadName = styled.div`
  ${tw`font-semibold text-black text-[18px]`}
`;

export const ChatAreaHeadStatus = styled.div`
  ${tw`text-quaternary text-[16px] flex items-center gap-1.5`}
`;

export const ChatAreaHeadStatusIcon = styled(FaCircle)<{ status: number }>`
  ${tw`mt-[-2px] text-[12px]`}
  ${({ status }) => (status === 1 ? tw`text-green-400` : tw`text-gray-400`)}
`;

export const ChatAreaHeadOption = styled(IoMenu)`
  ${tw`text-[40px] text-quaternary hover:cursor-pointer`}
`;