import styled from "styled-components";
import tw from "twin.macro";

export const ChatAvatarWrapper = styled.div`
  ${tw`relative`}
`;

export const ChatAvatar = styled.figure<{isGroup?: number}>`
  ${tw`relative flex flex-wrap justify-center items-center w-[50px] h-[50px] rounded-full overflow-hidden border border-gray-500`}
  ${({isGroup}) => isGroup === 1 && tw`p-1 bg-tertiary`}
`;

export const ChatAvatarGroup = styled.figure`
  ${tw`relative w-[20px] h-[20px] rounded-full overflow-hidden`}
`

export const ChatStatus = styled.span<{ status: number }>`
  ${tw`absolute w-[13px] h-[13px] rounded-full right-[1px] bottom-[1px]`}
  ${({ status }) => (status === 1 ? tw`bg-green-400` : tw`bg-gray-400`)}
  border: 1px solid white;
`;

export const Content = styled.div`
  ${tw`flex-grow ml-3.5 overflow-hidden`}
`;

export const Name = styled.div`
  ${tw`font-semibold text-black text-[16px] text-left`}
`;

export const Msg = styled.div<{ semibold: boolean }>`
  ${tw`text-[14px] w-full text-left overflow-hidden whitespace-nowrap`}
  text-overflow: ellipsis;
  ${({ semibold }) => semibold && tw`font-semibold italic`}
`;

export const Wrapper = styled.div`
  ${tw`flex px-3 py-2.5 items-center relative w-full`}
`;

export const UnReadMsgNoti = styled.span`
  ${tw`rounded-full bg-red-500 px-1.5 text-white font-bold text-[14px] mr-3`}
`;

export const ChatPreviewItem = styled.div<{
  active: boolean;
  unReadMsg: number;
}>`
  ${tw`flex items-center my-2 relative hover:cursor-pointer hover:bg-tertiary rounded-[20px]`}
  ${({ unReadMsg }) => unReadMsg >= 1 && tw`bg-secondary shadow-sm`}
  ${({ active }) => active && tw`bg-quaternary shadow-md`}
`;
