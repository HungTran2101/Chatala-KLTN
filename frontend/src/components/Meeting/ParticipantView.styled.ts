import styled from 'styled-components';
import tw from 'twin.macro';
import ReactPlayer from 'react-player';
import noAvt from '../../assets/imgs/no-avatar.png';
export const Container = styled.div<{ scr?: boolean }>`
  ${tw`relative p-5 object-contain`}
  ${({ scr }) => scr && `grid-row: 1 / 6; grid-column: 1 / 6;`}
`;

export const Name = styled.div`
  ${tw`absolute right-10 bottom-10 z-10 bg-[rgba(0,0,0,0.6)] text-white px-2 py-2 rounded-2xl capitalize flex`}
`;

export const StatusWrap = styled.div`
  ${tw`flex justify-end ml-3`}
`;

export const Video = styled(ReactPlayer)`
  ${tw`overflow-hidden rounded-lg bg-gray-300`}
`;

export const Status = styled.button<{
  red?: boolean;
}>`
  ${tw`bg-green-600 p-1 rounded-full flex text-white text-base mx-1 duration-[200ms]`}
  ${({ red }) => red && tw`bg-red-600`}
`;
