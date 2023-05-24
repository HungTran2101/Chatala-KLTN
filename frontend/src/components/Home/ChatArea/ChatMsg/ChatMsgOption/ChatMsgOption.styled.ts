import styled from 'styled-components';
import tw from 'twin.macro';

export const ChatMsgOption = styled.div`
  ${tw``}
`;

export const optionItem = styled.div<{ color?: string }>`
  ${tw`text-sm px-6 py-1 rounded-[5px] cursor-pointer text-center`}
`;

export const NormalItem = styled(optionItem)`
  ${tw`hover:bg-blue-200`}
`;

export const DeteleItem = styled(optionItem)`
  ${tw`text-red-500 hover:bg-red-100 font-semibold`}
`;
