import styled from "styled-components";
import tw from "twin.macro"
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'

export const ChatImageZoom = styled.div`
${tw`fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center z-[999]`}
`

export const ModalOverlay = styled.div`
  ${tw`w-full h-full absolute bg-[rgba(0, 0, 0, 0.55)] z-0`}
`;

export const ModalBody = styled.figure`
  ${tw`relative max-w-[1000px] flex justify-between items-center z-[1]`}
  width: 90vw;
  height: 90vh;
`;

export const NavigateLeft = styled(IoIosArrowDropleft)`
${tw`text-primary text-[50px] ml-[-50px] hover:text-secondary hover:mt-[-1px] hover:cursor-pointer`}
`

export const NavigateRight = styled(IoIosArrowDropright)`
${tw`text-primary text-[50px] mr-[-50px] hover:text-secondary hover:mt-[-1px] hover:cursor-pointer`}
`