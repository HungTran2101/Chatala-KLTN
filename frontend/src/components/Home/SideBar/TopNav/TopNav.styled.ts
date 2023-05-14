import styled from 'styled-components';
import tw from 'twin.macro';
import { MdGroup, MdGroupAdd } from 'react-icons/md';

export const Wrapper = styled.div`
  ${tw`flex flex-row -mx-1`}
`;

export const Button = styled.div`
  ${tw`bg-secondary rounded-[20px] shadow-md w-full mx-1`}
`;

export const Options = styled.div`
  ${tw`flex justify-around text-quaternary text-[35px] py-1`}
`;

export const AddGroupOption = styled(MdGroupAdd)`
  ${tw`hover:cursor-pointer hover:opacity-80 mx-2`}
`;

export const FriendsOption = styled(MdGroup)`
  ${tw`hover:cursor-pointer hover:opacity-80 mx-2 text-[30px]`}
`;
