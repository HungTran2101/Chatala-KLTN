import styled, { keyframes } from "styled-components";
import tw from "twin.macro";
import { merge, zoomIn, slideInRight, slideInDown } from "react-animations";

const cbAnimate1 = merge(slideInRight, slideInDown);
const MoreOptionAnimate = keyframes`${merge(zoomIn, slideInDown)}`;

export const ChatMsgOption = styled.div<{ isleft: number }>`
  ${tw` px-1 py-2 bg-white absolute rounded-2xl shadow-md z-30 top-[20px]`}
  ${({ isleft }) => (isleft === 1 ? tw`left-[10px]` : tw`right-[10px]`)}
  animation: 0.2s ${MoreOptionAnimate};
`;

export const optionItem = styled.div<{ color?: string }>`
  ${tw`text-sm px-6 py-1 rounded-2xl cursor-pointer text-center`}
`;

export const NormalItem = styled(optionItem)`
  ${tw`hover:bg-blue-200`}
`;

export const DeteleItem = styled(optionItem)`
  ${tw`text-red-500 hover:bg-red-100 font-semibold`}
`;
