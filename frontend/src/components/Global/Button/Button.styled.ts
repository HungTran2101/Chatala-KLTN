import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';

export const Button = styled.button<{ variant: string }>`
  ${tw`bg-transparent rounded-[5px] font-semibold text-sm px-2 py-1 ml-1 cursor-pointer duration-200`}
  ${({ variant }) =>
    variant === 'red'
      ? tw`border-red-500 border-[1px] text-red-500`
      : tw`border-blue-500 border-[1px] text-blue-500`}
  ${({ disabled, variant }) =>
    disabled
      ? tw`border-gray-400 text-gray-400 cursor-not-allowed`
      : variant === 'red'
      ? tw`hover:bg-red-500 hover:text-white`
      : tw`hover:bg-blue-500 hover:text-white`}
`;
