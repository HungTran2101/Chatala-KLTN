import styled, { keyframes, css } from 'styled-components';
import tw from 'twin.macro';
import {
  merge,
  zoomIn,
  slideInRight,
  slideInDown,
  slideInUp,
} from 'react-animations';

const MoreOptionAnimate = keyframes`${merge(zoomIn, slideInDown)}`;
const MoreOptionAnimate2 = keyframes`${merge(zoomIn, slideInUp)}`;

export const ChatMsgOption = styled.div<{ isleft: number; isLastMsg: number }>`
  ${tw` p-1 bg-white absolute rounded-[10px] shadow-md z-30`}
  ${({ isleft }) => (isleft === 1 ? tw`left-[10px]` : tw`right-[10px]`)}
  ${({ isLastMsg }) => (isLastMsg === 1 ? tw`bottom-[20px]` : tw`top-[20px]`)}
  ${({ isLastMsg }) =>
    isLastMsg === 1
      ? css`animation: 0.2s ${MoreOptionAnimate2};`
      : css`animation: 0.2s ${MoreOptionAnimate};`}
`;

export const optionItem = styled.div<{ color?: string }>`
  ${tw`text-sm px-6 py-1 rounded-[5px] cursor-pointer text-center`}
`;

export const NormalItem = styled(optionItem)`
  ${tw`hover:bg-blue-200`}
`;

export const DeteleItem = styled(optionItem)`
  ${tw`text-red-500 hover:bg-red-100 font-semibold`}
`;
