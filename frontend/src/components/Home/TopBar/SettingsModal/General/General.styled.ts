import styled from 'styled-components';
import tw from 'twin.macro';

export const General = styled.div`
  ${tw`min-h-[400px]`}
`;

export const GeneralItem = styled.div`
  ${tw`border-secondary border-2 rounded-[10px] p-2 my-2`}
`;

export const LanguageItem = styled(GeneralItem)`
  ${tw`flex items-center`}
`;

export const GeneralItemLanguageLabel = styled.span`
  ${tw`mr-8`}
`;

export const GeneralItemLanguageButton = styled.span<{ active: number }>`
  ${tw`relative border-[3px] cursor-pointer w-[40px] h-[25px] mx-2`}
  ${({ active }) => (active === 1 ? tw`border-blue-300` : tw`border-transparent`)}
  ${({ active }) => (active === 1 ? "transform: scale(1.1);": "transform: scale(1);")}
`;
