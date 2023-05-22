import FormTemplate from '../Global/FormTemplate';
import { Formik, ErrorMessage } from 'formik';
import * as S from './OTPForm.styled';
import { withRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UsersApi } from '../../services/api/users';
import { UserRegister } from '../../utils/types';
import { ClipLoader } from 'react-spinners';

const OTPCode = () => {
  const router = useRouter();

  const [checkError, setCheckError] = useState('false');
  const [countdown, setCountdown] = useState(120);

  const initialValues = {
    otpCode: '',
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await window.confirmationResult.confirm(values.otpCode);
      setCheckError('false');

      const data: UserRegister = {
        name: router.query.name as string,
        phone: router.query.phone as string,
        password: router.query.password as string
      };
      
      await UsersApi.register(data);
      alert('Registration succeed!');
      router.push('/login');
    } catch {
      setCheckError('true');
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!router.query.name) {
      router.replace('/register');
    }
    window.history.replaceState(null, '', `/otp`);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        setCountdown(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <FormTemplate>
      <span>
        <S.BackIcon
          onClick={() =>
            router.back()
          }
        />
      </span>
      <S.Suggest>Make sure your phone number is real!</S.Suggest>
      <S.Notify>
        Please check verification OTP code sent to your phone and write below
      </S.Notify>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <S.NewForm>
            <S.SetWidth>
              <S.Input
                placeholder='Verification OTP code'
                name='otpCode'
                checkerror={checkError}
              />
              {checkError === 'true' && <S.ErrorMsg>Incorrect otp!</S.ErrorMsg>}
              <S.CountDown>Time Remaining: {countdown}s</S.CountDown>
              {countdown <= 0 && (
                <S.CheckPhoneNumber
                  onClick={() =>
                    router.push({
                      pathname: '/register',
                      query: {
                        name: router.query.name,
                        phone: router.query.phone,
                      },
                    })
                  }
                >
                  <p>Not receive OTP code?</p>
                  <p>Please check your phone number again!</p>
                </S.CheckPhoneNumber>
              )}
              <S.Button type='submit' disabled={isSubmitting ? true : false}>
                {isSubmitting ? (
                  <ClipLoader color='#fff' size={25} />
                ) : (
                  'Verify'
                )}
              </S.Button>
            </S.SetWidth>
          </S.NewForm>
        )}
      </Formik>
    </FormTemplate>
  );
};

export default withRouter(OTPCode);
