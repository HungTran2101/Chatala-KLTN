import styled from "styled-components";
import tw from "twin.macro";
import { MdGroupAdd } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";

export const Wrapper = styled.div`
  ${tw`bg-secondary rounded-[20px] shadow-md`}
`;

export const Options = styled.div`
  ${tw`flex justify-center text-quaternary text-[35px] py-1`}
`;

export const AddGroupOption = styled(MdGroupAdd)`
  ${tw`hover:cursor-pointer hover:opacity-80 mx-2`}
`;

export const FriendsOption = styled(HiUserGroup)`
  ${tw`hover:cursor-pointer hover:opacity-80 mx-2 text-[30px]`}
`;
