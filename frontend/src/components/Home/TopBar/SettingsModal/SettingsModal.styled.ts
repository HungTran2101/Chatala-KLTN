import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';
import { fadeIn, zoomIn } from 'react-animations';
const fadeInAnimate = keyframes`${fadeIn}`;
const zoomInAnimate = keyframes`${zoomIn}`;

export const SettingsModal = styled.div`
  ${tw`fixed z-[999] top-0 left-0 h-screen w-screen flex justify-center items-center flex-col bg-[rgb(0, 0, 0, 0.5)]`}
  animation: 0.25s ${fadeInAnimate};
`;

export const Overlay = styled.div`
  ${tw`absolute top-0 left-0 w-full h-full bg-[rgb(0, 0, 0, 0.5)]`}
`;

export const SettingsModalInner = styled.div`
  animation: 0.25s ${zoomInAnimate};
  ${tw`relative z-[9999] max-w-[768px] w-full min-h-[500px] bg-[#C9D9E5] rounded-[20px] shadow-sm overflow-hidden flex`}
  @media only screen and (max-width: 1024px) {
    ${tw`flex-col`}
  }
`;

export const SettingContentWrap = styled.div`
  ${tw`bg-white rounded-[20px] h-full w-full`}
`;

export const SettingTabWrap = styled.div`
  ${tw`max-w-[240px] w-full p-5`}
  @media only screen and (max-width: 1024px) {
    ${tw`flex`}
  }
`;

export const TabLink = styled.div<{ active: boolean }>`
  ${tw`shadow text-center text-quaternary bg-primary rounded-xl text-base font-semibold cursor-pointer hover:bg-quaternary hover:text-white hover:opacity-70 px-5 py-[10px] mb-[10px] duration-100 whitespace-nowrap`}
  ${({ active }) => active && tw`bg-quaternary text-white`}

  @media only screen and (max-width: 1024px) {
    ${tw`mr-2 mb-0`}
  }
`;
