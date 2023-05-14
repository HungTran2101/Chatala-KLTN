import styled from 'styled-components';
import tw from 'twin.macro';

export const ChatList = styled.div`
  ${tw`overflow-y-auto flex-grow rounded-2xl mt-2.5 pr-1 h-0`}
  &::-webkit-scrollbar-track {
    ${tw`bg-transparent rounded-[10px]`}
  }

  &::-webkit-scrollbar {
    ${tw`w-[5px]`}
  }

  &::-webkit-scrollbar-thumb {
    ${tw`bg-tertiary rounded-[50px]`}
  }

  @media only screen and (max-width: 1024px) {
    ${tw`h-auto`}
  }
`;

export const Wrapper = styled.div`
  ${tw`text-center`}
  text-align: -webkit-center;

  @media only screen and (max-width: 1024px) {
    ${tw`flex`}
  }
`;
