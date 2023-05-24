import styled from 'styled-components';
import tw from 'twin.macro';

export const HomeContainer = styled.div`
  ${tw`p-2 pt-4 flex flex-col h-[100vh] justify-between`}
  @keyframes fadeIn {
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  animation: fadeIn 0.5s linear;
`;

export const Wrapper = styled.div`
  ${tw`flex h-full`}
  @media only screen and (max-width: 1024px) {
    ${tw`flex-col`}
  }
`;
