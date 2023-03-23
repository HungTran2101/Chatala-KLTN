import FormTemplate from '../Global/FormTemplate';
import { authentication } from '../Global/Firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { NumberPhoneArea } from '../../utils/dataConfig';
import { Formik, ErrorMessage } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as S from './Register.styled';
import * as Yup from 'yup';
import { ChangeEvent, useEffect, useState } from 'react';
import { UsersApi } from '../../services/api/users';
import { FormValue } from '../../utils/types';
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { ClipLoader } from 'react-spinners';

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

const Register = () => {
  useEffect(() => {
    window.history.replaceState(null, '', `/register`);
  }, [])

  const router = useRouter();

  const [eye, setEye] = useState<boolean>(false);

  const initialValues = {
    name: (router.query.name as string) || "",
    phone: (router.query.phone as string) || "",
    password: "",
    confirmPassword: "",
    phomeNumberCode: "+84",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("This field is required."),

    phone: Yup.string()
      .required("This field is required.")
      .matches(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        "Phone number invalid."
      ),

    password: Yup.string()
      .required('This field is required.')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/,
        'Password minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number.'
      ),

    confirmPassword: Yup.string()
      .required("This field is required.")
      .oneOf([Yup.ref("password"), null], "Passwords must match."),
  });

  const requestOTP = async (newPhoneNumber: string) => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response: string) => {},
      },
      authentication
    );

    let appVerifier = window.recaptchaVerifier;
    await signInWithPhoneNumber(authentication, newPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async (values: FormValue) => {
    try {
      await UsersApi.checkUser(values.phone);
      const newPhoneNumber = values.phomeNumberCode + values.phone.substring(1);
      await requestOTP(newPhoneNumber);

      router.push({
        pathname: "/otp",
        query: {
          name: values.name,
          phone: values.phone,
          password: values.password
        }
      });
    } catch (err: any) {
      console.log(err);
      if (err.error.statusCode === 400) {
        alert("Registration failed, Phone number already exists!");
      }
    }
  };

  return (
    <FormTemplate>
      <S.Suggest>Create your account!</S.Suggest>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => (
          <S.NewForm>
            <S.SetWidth>
              <S.InputGroup
                error={errors.phone && touched.phone ? true : false}
              >
                <S.Select
                  name="phomeNumberCode"
                  onChange={(e: ChangeEvent) => {
                    const input = e.target as HTMLInputElement;
                    setFieldValue("phomeNumberCode", input.value);
                  }}
                >
                  {NumberPhoneArea.map((data, index) => (
                    <option key={index} value={data.dial_code}>
                      {data.dial_code}
                    </option>
                  ))}
                </S.Select>
                <S.ShortInputDiv>
                  <div id="recaptcha-container"></div>
                  <S.ShortInput
                    placeholder="Phone number"
                    name="phone"
                    error={errors.phone && touched.phone ? 1 : 0}
                  />
                  <ErrorMessage name="phone" component={S.ErrorMsg} />
                </S.ShortInputDiv>
              </S.InputGroup>
              <S.Input
                placeholder="Your name"
                name="name"
                error={errors.name && touched.name ? 1 : 0}
              />
              <ErrorMessage name="name" component={S.ErrorMsg} />
              <S.InputPassword>
                <S.Password
                  placeholder="Password"
                  type={eye ? "text" : "password"}
                  name="password"
                  error={errors.password && touched.password ? 1 : 0}
                />
                <S.ButtonEye onClick={() => setEye(!eye)}>
                  {eye ? <BsEyeSlash /> : <BsEye />}
                </S.ButtonEye>
              </S.InputPassword>
              <ErrorMessage name="password" component={S.ErrorMsg} />
              <S.Input
                placeholder="Confirm password"
                type="password"
                name="confirmPassword"
                error={
                  errors.confirmPassword && touched.confirmPassword ? 1 : 0
                }
              />
              <ErrorMessage name='confirmPassword' component={S.ErrorMsg} />
              <S.Button type='submit'>
                {isSubmitting ? (
                  <ClipLoader color='#fff' size={25} />
                ) : (
                  'Continue'
                )}
              </S.Button>
            </S.SetWidth>
          </S.NewForm>
        )}
      </Formik>
      <S.Login>
        <Link href="/login">
          <span>
            <p>Already have one?</p>
            <p>Let&apos;s Sign In!</p>
          </span>
        </Link>
      </S.Login>
    </FormTemplate>
  );
};

export default Register;
