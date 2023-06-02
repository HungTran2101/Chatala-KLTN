import styled from 'styled-components';
import tw from 'twin.macro';
import { BiSearchAlt } from 'react-icons/bi';
import { RiSettings3Fill } from 'react-icons/ri';
import { FiLogOut } from 'react-icons/fi';
import { IoNotificationsCircleSharp } from 'react-icons/io5';
import { ImExit } from 'react-icons/im';

export const Avatar = styled.figure`
  ${tw`w-[60px] h-[60px] rounded-full overflow-hidden absolute shadow-md border-[2px] border-quaternary`}
`;

export const Container = styled.div`
  ${tw`w-full flex items-center mb-4`}
`;

export const Wrapper = styled.div`
  ${tw`bg-secondary w-full rounded-[10px] flex shadow-md`}
`;

export const LeftWrapper = styled.div`
  ${tw`flex items-center relative cursor-pointer`}
`;

export const RightWrapper = styled.div`
  ${tw`flex flex-grow justify-between py-1`}
  @media only screen and (max-width: 1024px) {
    ${tw`justify-end`}
  }
`;

export const UserName = styled.div`
  ${tw`self-stretch flex items-center max-w-[350px] w-full text-black flex-shrink-0 pl-24 pr-8 text-xl font-semibold py-2 rounded-[10px] bg-gradient-to-r from-secondary to-quaternary`}
  @media only screen and (max-width: 1024px) {
    ${tw`max-w-none text-base px-4 pl-[70px]`}
  }
`;

export const LogoContainer = styled.div`
  ${tw`flex items-center justify-center ml-5`}
  @media only screen and (max-width: 1024px) {
    ${tw`hidden`}
  }
`;

export const Logo = styled.figure`
  ${tw`w-[100px] my-1 flex items-center`}
`;

export const SearchInput = styled.input`
  ${tw`text-lg rounded-[10px] pr-10 pl-5 py-1 w-full outline-none`}
`;

export const Search = styled.div<{ mobile?: boolean }>`
  ${tw`relative max-w-[550px] w-full flex mx-auto items-center`}
  ${({ mobile }) => mobile && tw`hidden`}
  @media only screen and (max-width: 1024px) {
    ${({ mobile }) => (!mobile ? tw`hidden` : tw`flex py-2 pt-1`)}
    ${SearchInput} {
      ${tw`border-[1px] border-solid border-quaternary`}
    }
  }
`;
export const SearchIcon = styled(BiSearchAlt)`
  ${tw`absolute hover:cursor-pointer text-[28px] text-quaternary mr-1.5 right-0 z-50`}
`;

export const Option = styled.div`
  ${tw`text-[25px] text-quaternary flex justify-between mr-3 items-center`}
`;

export const OptionSetting = styled(RiSettings3Fill)`
  ${tw`hover:cursor-pointer mx-2 text-[30px]`}
`;

export const OptionLogOut = styled(ImExit)`
  ${tw`hover:cursor-pointer mx-2.5 mb-[-2px] text-[25px] rounded-[4px]`}
`;

export const OptionNotify = styled(IoNotificationsCircleSharp)`
  ${tw`hover:cursor-pointer mx-2 text-[30px]`}
`;

export const NotifyNumber = styled.div`
  ${tw`hover:cursor-pointer text-[18px] w-[30px] h-[30px] text-center leading-[30px] text-red-500 bg-[#769fcd] rounded-[50px] border-[1px] border-solid border-red-500`}
`;

export const OptionNotifyWrapper = styled.div`
  ${tw`relative`}
`;

export const OptionNotifyNumber = styled.div<{ number: number }>`
  ${tw`flex justify-center items-center absolute text-[12px] text-red-500 top-[-2px] right-[9px] font-semibold text-left`}
  text-shadow: 2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff,
              1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
  ${({ number }) => number >= 100 && tw`right-0`}
`;

// Search
export const SearchModalItem = styled.div`
  ${tw`relative flex p-2 rounded-[5px] items-center w-full bg-secondary`}
`;

export const SearchModalInfo = styled.div`
  ${tw`relative flex items-center hover:cursor-pointer flex-grow`}
`;

export const SearchModalAvatar = styled.figure`
  ${tw`relative w-[55px] h-[55px] rounded-full overflow-hidden flex-shrink-0`}
  border: 1px solid gray;
`;
export const SearchModalNameWrapper = styled.div`
  ${tw`relative ml-3.5 w-full`}
`;

export const SearchModalName = styled.div`
  ${tw`text-blue-700 font-semibold text-[18px]`}
`;

export const SearchModalNumFriend = styled.div`
  ${tw`text-[#434343] text-[16px]`}
`;

export const SearchModalOption = styled.div`
  ${tw`text-white text-center rounded-[20px] min-w-[115px] font-semibold text-sm px-5 py-2.5 ml-1 hover:cursor-pointer hover:opacity-80`}
`;

export const SearchModalMessage = styled(SearchModalOption)`
  ${tw`bg-blue-500`}
`;

export const SearchModalAddFriend = styled(SearchModalOption)`
  ${tw`bg-quaternary`}
`;

export const SearchModalPending = styled(SearchModalOption)`
  ${tw`bg-gray-500 opacity-50 hover:opacity-50 hover:cursor-default`}
`;

export const SearchModalAccept = styled(SearchModalOption)`
  ${tw`bg-green-500 mr-1`}
`;

export const SearchModalDecline = styled(SearchModalOption)`
  ${tw`bg-red-500`}
`;

export const FlexWrap = styled.div`
  ${tw`flex`}
`;
