import FormTemplate from '../Global/FormTemplate';
import { Formik, ErrorMessage } from 'formik';
import Link from 'next/link';
import * as S from './Login.styled';
import * as Yup from 'yup';
import { userLogin } from '../../utils/types';
import { useRouter } from 'next/router';
import { UsersApi } from '../../services/api/users';
import { ClipLoader } from 'react-spinners';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { useState } from 'react';
import { message } from 'antd';

const Login = () => {
  const router = useRouter();

  const [eye, setEye] = useState<boolean>(false);

  const initialValues = {
    phone: '',
    password: '',
  };
  const validationSchema = Yup.object().shape({
    phone: Yup.string()
      .required('This field is required.')
      .matches(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        'Phone number invalid.'
      ),

    password: Yup.string()
      .required('This field is required.')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/,
        'Password minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number.'
      ),
  });

  const handleSubmit = async (values: userLogin, { setSubmitting }: any) => {
    try {
      await UsersApi.login(values);

      router.push('/');
    } catch (error: any) {
      if (error?.error?.statusCode === 404) {
        setSubmitting(false);
        message.error('Wrong password or phone number!');
      } else {
        message.error('Login failed');
        console.log(error);
      }
    }
  };
  return (
    <FormTemplate>
      <S.Suggest>Login</S.Suggest>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <S.NewForm>
            <S.SetWidth>
              <S.Input
                placeholder='Phone number'
                name='phone'
                error={errors.phone && touched.phone ? 1 : 0}
              />
              <ErrorMessage name='phone' component={S.ErrorMsg} />

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

              {/* <S.Forgot>
                <Link href='/forgot-password'>Forgot Password?</Link>
              </S.Forgot> */}
              <S.Button type='submit'>
                {isSubmitting ? <ClipLoader color='#fff' size={25} /> : 'Login'}
              </S.Button>
            </S.SetWidth>
          </S.NewForm>
        )}
      </Formik>
      <S.Register>
        <Link href='/register'>New here? Let&apos;s Sign Up!</Link>
        <Link href='/forgot-password'>Forgot password?</Link>
      </S.Register>
    </FormTemplate>
  );
};

export default Login;
