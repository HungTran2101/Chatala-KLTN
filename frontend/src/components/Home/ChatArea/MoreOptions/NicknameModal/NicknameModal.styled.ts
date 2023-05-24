import { zoomIn } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';

export const NicknameModal = styled.div`
  ${tw`flex fixed top-0 left-0 bottom-0 right-0 z-30`}
`;

export const NicknameOverlay = styled.div`
  ${tw`absolute bg-[#00000080] h-full w-full`}
`;

const zoomInAnimate = keyframes`${zoomIn}`;

export const NicknameBody = styled.div`
  ${tw`flex flex-col m-auto bg-quaternary py-2.5 px-3.5 rounded-[15px] z-10 min-w-[500px]`}
  border: 2px solid #ECF2F7;
  animation: 0.25s ${zoomInAnimate};
`;

export const NicknameTitle = styled.div`
  ${tw`mb-2 font-semibold text-[18px] text-primary`}
`;

export const NicknameInput = styled.input`
  ${tw`w-full border-2 border-quaternary rounded-[5px] px-2 py-1 outline-none`}
`;

export const NicknameSave = styled.div`
  ${tw`self-end text-primary rounded-[10px] mt-2 px-2 py-1 hover:cursor-pointer hover:shadow-md transition-all `}
  border: 1px solid white;
  &:hover {
    transform: translateY(-1px);
  }
`;
