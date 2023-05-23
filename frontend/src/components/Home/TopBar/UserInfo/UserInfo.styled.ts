import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const growth = keyframes`
    from {
        transform: scale(0.7)
    }
    to {
        transform: scale(1)
    }
`;

export const ModalAvatar = styled.div`
  ${tw`fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center z-[9999]`}
  animation: ${fadeIn} linear 0.15s;
`;

export const Modal = styled.div`
  ${tw`fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center z-[999]`}
  animation: ${fadeIn} linear 0.15s;
`;

export const ModalOverlay = styled.div`
  ${tw`w-full h-full absolute bg-[rgba(0, 0, 0, 0.25)] z-20`}
`;

export const ModalBody = styled.div`
  ${tw`w-[400px] rounded-[20px] bg-[#ecf2f7] overflow-hidden z-20`}
  box-shadow: 2px 2px 16px rgb(0 0 0 / 15%);
  animation: ${growth} linear 0.15s;
`;

export const ModalAvatarBody = styled.div`
  ${tw`relative rounded-[20px] z-[10] overflow-hidden`}
  animation: ${growth} linear 0.15s;
`;

export const Header = styled.div`
  ${tw``}
`;

export const Title = styled.div`
  ${tw`w-full flex justify-between items-center py-4 px-8 text-xl text-white font-bold bg-quaternary`}
  &:nth-child(1) svg {
    ${tw`p-1 text-3xl rounded-[50%] cursor-pointer hover:bg-[rgba(0, 0, 0, 0.2)]`}
  }
`;

export const Figure = styled.figure`
  ${tw`relative w-full h-full rounded-t-[50px]`}
  aspect-ratio: 16/9;
`;

export const Banner = styled.figure`
  ${tw`relative w-full h-[220px] cursor-pointer overflow-hidden rounded-[10px]`}
`;

export const Avatar = styled.figure`
  ${tw`absolute w-[150px] h-[150px] top-[50px] left-[50%] bg-[#000] border-[5px] border-[#ecf2f7] cursor-pointer rounded-[50%] overflow-hidden`}
  transform: translate(-50%, 50%);
`;

export const Content = styled.div`
  ${tw`bg-secondary flex rounded-[20px] mt-[50px] mb-[32px] mx-auto`}
`;

export const Description = styled.div`
  ${tw`text-[#00317b] flex-1 w-[30%] py-6 pl-8 pr-0`}
  & span {
    ${tw`block text-lg`}
  }
`;

export const Info = styled.div`
  ${tw`py-6 pl-0 pr-8 w-[60%]`}
  & span {
    ${tw`block text-lg`}
  }
`;

export const Button = styled.button`
  ${tw`flex justify-center items-center w-[60%] text-white text-lg bg-quaternary rounded-[20px] py-1 px-2 mt-3 mx-auto mb-3 opacity-100 hover:opacity-80`}
  & svg {
    ${tw`mr-1`}
  }
`;
