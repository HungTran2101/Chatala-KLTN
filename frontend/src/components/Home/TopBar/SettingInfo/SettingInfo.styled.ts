import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Form, Field } from 'formik';
import tw from 'twin.macro';

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const growth = keyframes`
    from {
        transform: scale(0.7)
    }
    to {
        transform: scale(1)
    }
`;

export const Modal = styled.div`
  ${tw`fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center z-[999]`}
  animation: ${fadeIn} linear 0.15s;
`;

export const ModalOverlay = styled.div`
  ${tw`w-full h-full absolute bg-[rgba(0, 0, 0, 0.25)] z-0`}
`;

export const ModalBody = styled.div`
  ${tw`w-[400px] rounded-[20px] bg-[#ecf2f7] z-[1] overflow-hidden`}
  box-shadow: 2px 2px 16px rgb(0 0 0 / 15%);
  animation: ${growth} linear 0.15s;
`;

export const Header = styled.div`
  ${tw`relative`}
`;

export const Title = styled.div`
  ${tw`w-full flex justify-between items-center py-4 px-8 text-xl text-white font-bold bg-quaternary`}
  &:nth-child(1) svg {
    ${tw`p-1 text-3xl rounded-[50%] cursor-pointer hover:bg-[rgba(0, 0, 0, 0.2)]`}
  }
`;

export const Banner = styled.figure`
  ${tw`relative w-full h-[220px] cursor-pointer overflow-hidden rounded-[10px]`}
`;

export const Button = styled.button`
  ${tw`flex justify-center items-center w-[60%] text-white text-lg bg-quaternary rounded-[50px] py-1 px-2 hover:opacity-80`}
  & svg {
    ${tw`mr-1`}
  }
`;

export const Content = styled.div`
  ${tw` flex mt-[72px] mb-[32px] mx-auto`}
`;

export const GroupButton = styled.div`
  ${tw`w-3/4 flex mt-[32px] mb-0 mx-auto`}
  > * {
    &:first-child {
      ${tw`mr-1`}
    }
    &:last-child {
      ${tw`ml-1`}
    }
  }
`;

export const NewForm = styled(Form)`
  ${tw`w-full m-auto`}
`;

export const Input = styled(Field)<{ error: boolean }>`
  ${tw`w-full h-12 outline-none mt-2 py-2 px-4 rounded-[20px]`}
  ${({ error }) =>
    error === 1
      ? tw`border border-red-500`
      : tw`border-b border-solid border-[#0154b1]`};
`;

export const SetWidth = styled.div`
  ${tw`w-full relative`}
`;

export const GenderTitle = styled.span`
  ${tw`block`}
`;
export const GenderWrap = styled.span`
  ${tw`flex justify-between items-center my-3`}
`;

export const DOBTitle = styled.span`
  ${tw`block mt-6`}
`;

export const Label = styled.label`
  ${tw`flex items-center mr-6`}
`;

export const GroupLabel = styled.div`
  ${tw`flex mt-2`}
`;

export const Radio = styled(Field)<{ error: boolean }>`
  ${tw`w-[20px] h-[20px] mr-2 outline-none py-2 px-4`}
`;

export const DatePickerWrapperStyles = createGlobalStyle`
    .date_picker input {
        ${tw`w-full h-[50px] outline-none mt-2 py-2 px-4 border-b border-[#0154b1]`}
    }
`;

export const DatePickerElement = styled.div``;

export const ErrorMsg = styled.div`
  ${tw`text-red-500 mt-2`}
`;

export const UpdateAvatar = styled.label`
  ${tw`absolute w-[26px] h-[26px] rounded-[50px] p-1 left-[57%] bottom-[-23%] bg-[#ddd] border border-[#000] cursor-pointer`}
  input {
    ${tw`hidden`}
  }
`;

export const AvatarLabel = styled.label`
  ${tw`absolute w-[150px] h-[150px] top-[50px] left-[50%] bg-[#000] border-[5px] border-[#ecf2f7] cursor-pointer rounded-[50%] overflow-hidden`}
  transform: translate(-50%, 50%);
`;
