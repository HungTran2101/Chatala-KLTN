import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Router, { useRouter } from 'next/router';
import { ChangeEvent, useEffect } from 'react';
import FormTemplate from '../src/components/Global/FormTemplate';
import { Formik, ErrorMessage } from 'formik';
import Link from 'next/link';
import * as S from '../src/components/ForgotPassword/ForgotPassword.styled';
import * as Yup from 'yup';
import { UsersApi } from '../src/services/api/users';
import { authentication } from '../src/components/Global/Firebase';
import { NumberPhoneArea } from '../src/utils/dataConfig';

const ForgotPassword = () => {
  const router = useRouter();
  const initialValues = {
    phone: '',
    phoneCode: '+84',
  };
  const validationSchema = Yup.object().shape({
    phone: Yup.string()
      .required('This field is required.')
      .matches(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        'Phone number invalid.'
      ),
  });
  // useEffect(() => {
  //   window.history.replaceState(null, '', `/register`);
  // }, []);

  const requestOTP = async (phone: string) => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response: string) => {},
      },
      authentication
    );

    let appVerifier = window.recaptchaVerifier;
    await signInWithPhoneNumber(authentication, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async (phoneCode: string, phone: string) => {
    try {
      await UsersApi.checkUser(phone);
    } catch (err: any) {
      console.log(err);
      if (err.error.statusCode === 400) {
        const newPhoneNumber = phoneCode + phone.substring(1);
        const res = await requestOTP(newPhoneNumber);
        console.log(res);

        router.push({
          pathname: '/reset-password',
          query: {
            phone: phone,
          },
        });
        // alert('Registration failed, Phone number already exists!');
      }
    }
  };
  return (
    <FormTemplate>
      <Link href='/login'>
        <span>
          <S.BackIcon />
        </span>
      </Link>
      <S.Suggest>
        Enter your account&apos;s phone number to renew your password!
      </S.Suggest>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values.phoneCode, values.phone)}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue }) => (
          <S.NewForm>
            <S.SetWidth>
              <S.InputGroup
                error={errors.phone && touched.phone ? true : false}
              >
                <S.Select
                  name='phoneCode'
                  onChange={(e: ChangeEvent) => {
                    const input = e.target as HTMLInputElement;
                    setFieldValue('phoneCode', input.value);
                  }}
                >
                  {NumberPhoneArea.map((data, index) => (
                    <option key={index} value={data.dial_code}>
                      {data.dial_code}
                    </option>
                  ))}
                </S.Select>
                <S.ShortInputDiv>
                  <div id='recaptcha-container'></div>
                  <S.ShortInput
                    placeholder='Phone number'
                    name='phone'
                    error={errors.phone && touched.phone ? 1 : 0}
                  />
                  <ErrorMessage name='phone' component={S.ErrorMsg} />
                </S.ShortInputDiv>
              </S.InputGroup>
              <S.Button type='submit'>Continue</S.Button>
            </S.SetWidth>
          </S.NewForm>
        )}
      </Formik>
      <S.SignUp>
        <Link href='/login'>
          <span>
            <p>Remembered your password?</p>
            <p>Let&apos;s Login!</p>
          </span>
        </Link>
      </S.SignUp>
    </FormTemplate>
  );
};

ForgotPassword.getInitialProps = async ({ req, res }) => {
  if (req?.cookies.token) {
    if (res) {
      // On the server, we'll use an HTTP response to
      // redirect with the status code of our choice.
      // 307 is for temporary redirects.
      res.writeHead(307, { Location: '/' });
      res.end();
    } else {
      // On the client, we'll use the Router-object
      // from the 'next/router' module.
      Router.replace('/');
    }

    return {};
  }

  return {
    data: null,
  };
};

export default ForgotPassword;
