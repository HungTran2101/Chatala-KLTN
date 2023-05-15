import styled from 'styled-components';
import tw from 'twin.macro';

export const Container = styled.div`
  ${tw`h-screen w-screen flex justify-center flex-col items-center`}
  background-image: linear-gradient(-20deg, #b721ff 0%, #21d4fd 100%);
`;

export const ParticipantWrap = styled.div`
  ${tw`flex flex-wrap justify-center`}
`;
