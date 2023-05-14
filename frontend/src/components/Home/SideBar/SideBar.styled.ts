import styled from 'styled-components';
import tw from 'twin.macro';

export const SideBarContainer = styled.div`
  ${tw`max-w-[350px] w-full rounded-[50px] flex-shrink-0 flex flex-col mr-2`}
  @media only screen and (max-width: 1024px) {
    ${tw`max-w-full ml-0`}
  }
`;
