import { useRouter } from 'next/router';
import FormTemplate from '../src/components/Global/FormTemplate';
import OTPCode from '../src/components/OTPForm';
import * as S from '../src/components/OTPForm/OTPForm.styled';
import { useEffect, useState } from 'react';
import { ErrorMessage, Formik } from 'formik';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';
import { UsersApi } from '../src/services/api/users';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

const ResetPassword = () => {
  const router = useRouter();

  const [checkError, setCheckError] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(30);

  const initialValues = {
    otpCode: '',
  };

  const passwordInitialValues = {
    password: '',
    confirmPassword: '',
  };
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('This field is required.')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        'Password minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number.'
      ),

    confirmPassword: Yup.string()
      .required('This field is required.')
      .oneOf([Yup.ref('password'), null], 'Passwords must match.'),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await window.confirmationResult.confirm(values.otpCode);
      setCheckError(false);
      console.log(router.query);
    } catch {
      setCheckError(true);
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async ({ password }) => {
    try {
      await UsersApi.resetPassword(router.query.phone as string, password);
      alert('Reset succeed!');
      router.push('/login');
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!router.query.phone) {
      router.replace('/forgot-password');
    }
    window.history.replaceState(null, '', `/reset-password`);
  }, []);

  useEffect(() => {
    if (checkError === null) {
      const interval = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          setCountdown(0);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown, checkError]);

  const [eye, setEye] = useState<boolean>(false);
  const [confirmEye, setConfirmEye] = useState<boolean>(false);
  return (
    <FormTemplate>
      <span>
        <S.BackIcon
          onClick={() =>
            router.replace({
              pathname: '/forgot-password',
            })
          }
        />
      </span>
      {checkError === null ? (
        <>
          <S.Suggest>Make sure your phone number is real!</S.Suggest>
          <S.Notify>
            Please check verification OTP code sent to your phone and write
            below
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
                  {checkError === true && (
                    <S.ErrorMsg>Incorrect otp!</S.ErrorMsg>
                  )}
                  <S.CountDown>Time Remaining: {countdown}s</S.CountDown>
                  {countdown <= 0 && (
                    <S.CheckPhoneNumber
                      onClick={() =>
                        router.replace({
                          pathname: '/forgot-password',
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
                  <S.Button
                    type='submit'
                    disabled={isSubmitting ? true : false}
                  >
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
        </>
      ) : (
        <>
          <S.Suggest>Lets renew your password!</S.Suggest>
          <Formik
            initialValues={passwordInitialValues}
            validationSchema={validationSchema}
            onSubmit={(data) => handleResetSubmit(data)}
          >
            {({ errors, touched }) => (
              <S.NewForm>
                <S.SetWidth>
                  <S.InputPassword>
                    <S.Password
                      placeholder='Password'
                      type={eye ? 'text' : 'password'}
                      name='password'
                      error={errors.password && touched.password ? 1 : 0}
                    />
                    <S.ButtonEye onClick={() => setEye(!eye)}>
                      {eye ? <BsEyeSlash /> : <BsEye />}
                    </S.ButtonEye>
                  </S.InputPassword>
                  <ErrorMessage name='password' component={S.ErrorMsg} />
                  <S.InputPassword>
                    <S.Password
                      placeholder='Confirm Password'
                      type={confirmEye ? 'text' : 'password'}
                      name='confirmPassword'
                      error={
                        errors.confirmPassword && touched.confirmPassword
                          ? 1
                          : 0
                      }
                    />
                    <S.ButtonEye onClick={() => setConfirmEye(!confirmEye)}>
                      {confirmEye ? <BsEyeSlash /> : <BsEye />}
                    </S.ButtonEye>
                  </S.InputPassword>
                  <ErrorMessage name='confirmPassword' component={S.ErrorMsg} />
                  <S.Button type='submit'>Submit</S.Button>
                </S.SetWidth>
              </S.NewForm>
            )}
          </Formik>
        </>
      )}
    </FormTemplate>
  );
};

export default ResetPassword;
