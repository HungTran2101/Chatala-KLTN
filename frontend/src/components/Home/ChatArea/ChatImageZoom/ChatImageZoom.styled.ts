import styled from 'styled-components';
import tw from 'twin.macro';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';

export const ChatImageZoom = styled.div`
  ${tw`fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center z-[999]`}
`;

export const ModalOverlay = styled.div`
  ${tw`w-full h-full absolute bg-[rgba(0, 0, 0, 0.55)] z-0`}
`;

export const ModalBody = styled.figure`
  ${tw`relative max-w-[1000px] flex justify-between items-center z-[1] p-2.5 rounded-xl`}
  width: 90vw;
  height: 90vh;
`;

export const ImageWrapper = styled.div`
  ${tw`flex flex-col w-full h-full justify-between gap-3`}
`;

export const ImageCurrent = styled.figure`
  ${tw`relative flex-grow rounded-xl overflow-hidden`}
`;

export const ImageList = styled.div`
  ${tw`flex gap-1.5 overflow-x-auto`}
`;

export const ImageListItem = styled.figure<{ active: boolean }>`
  ${tw`relative w-[75px] h-[75px] rounded-xl overflow-hidden cursor-pointer`}
  filter: brightness(0.6);
  ${({ active }) => active && `filter: brightness(1);`}
`;

export const NavigateLeft = styled(IoIosArrowDropleft)`
  ${tw`text-tertiary text-[50px] transition-all hover:text-quaternary hover:translate-x-[-2px] hover:cursor-pointer`}
`;

export const NavigateRight = styled(IoIosArrowDropright)`
  ${tw`text-tertiary text-[50px] transition-all hover:text-quaternary hover:translate-x-[2px] hover:cursor-pointer`}
`;

export const CloseButton = styled.span`
  ${tw`absolute top-10 right-10 text-white text-4xl cursor-pointer z-[99999999]`}
`;
