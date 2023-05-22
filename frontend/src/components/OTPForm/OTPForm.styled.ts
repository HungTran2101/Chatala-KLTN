import styled from 'styled-components';
import tw from 'twin.macro';
import { Form, Field } from 'formik';
import { HiChevronLeft } from 'react-icons/hi';

export const Suggest = styled.span`
  ${tw`text-lg mt-6`}
`;

export const NewForm = styled(Form)`
  ${tw`w-4/5`}
`;

export const Notify = styled.span`
  ${tw`w-[56%] italic text-base mt-6 text-center opacity-80`}
`;

export const Input = styled(Field)<{ checkerror: boolean }>`
  ${tw`w-full h-12 outline-none mt-6 py-2 px-4 border-b border-[#0154b1]`}
  ${({ checkerror }) => checkerror === 'true' && tw`border border-red-500`};
`;

export const ErrorMsg = styled.span`
  ${tw`block text-red-500 mt-2`}
`;

export const Button = styled.button`
  ${tw`w-1/3 h-11 bg-[#0154b1] text-[#fff] block rounded-md py-2 px-4 font-bold mb-11 mt-[18px] mx-auto hover:opacity-80`}
`;

export const SetWidth = styled.div`
  ${tw`w-full`}
`;

export const BackIcon = styled(HiChevronLeft)`
  ${tw`absolute text-4xl text-[#0154b1] left-7 top-7 cursor-pointer hover:opacity-80`}
`;

export const CheckPhoneNumber = styled.span`
  ${tw`block text-base mt-[6px] mb-0 mx-auto text-center cursor-pointer text-red-600`}
`;

export const CountDown = styled.span`
  ${tw`block text-center mt-9 text-lg`}
`;

export const InputPassword = styled.div`
  ${tw`w-full mt-6 flex items-center justify-between relative`}
`;

export const Password = styled(Field)<{ error: boolean }>`
  ${tw`w-full py-2 px-4 h-12 outline-none border-b`}
  ${({ error }) =>
    error === 1 ? tw`border-red-500` : tw`border-solid border-[#0154b1]`};
  ::-ms-reveal,
  ::-ms-clear {
    display: none;
  }
`;

export const ButtonEye = styled.div`
  ${tw`text-xl py-2 pl-2 cursor-pointer absolute right-0`}
`;
