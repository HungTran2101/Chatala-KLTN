import styled from 'styled-components';
import tw from 'twin.macro';

export const Container = styled.div`
  ${tw`flex justify-center fixed bottom-2 right-0`}
`;

export const Button = styled.button<{ redBg?: boolean }>`
  ${tw`bg-[rgba(0,0,0,0.6)] p-5 rounded-full flex text-white text-xl mx-2 opacity-80 hover:opacity-100 duration-[200ms]`}
  ${({ redBg }) => redBg && tw`bg-red-500`}
`;
