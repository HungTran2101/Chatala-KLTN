import styled from 'styled-components';
import tw from 'twin.macro';
import ReactPlayer from 'react-player';
import noAvt from '../../assets/imgs/no-avatar.png';
export const Container = styled.div`
  ${tw`relative p-5`}
`;

export const Name = styled.div`
  ${tw`absolute right-10 bottom-10 z-10 bg-[rgba(0,0,0,0.6)] text-white px-4 py-1 rounded-3xl capitalize`}
`;

export const Video = styled(ReactPlayer)`
  background: url(${noAvt.src});
  ${tw`w-[400px] h-[300px] rounded-[20px] overflow-hidden bg-cover bg-no-repeat bg-center`}
  aspect-ratio: 16 / 9;
  video {
    transform: scale(1.1);
  }
`;
