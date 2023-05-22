import { ErrorMessage, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import * as S from './ChangePassword.styled';
import { useFormik } from 'formik';
import { UsersApi } from '../../../../../services/api/users';
import { Button, Input, Space, message } from 'antd';

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('This field is required.'),
  password: Yup.string()
    .required('This field is required.')
    .matches(
      //fail special signature validation
      /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/,
      'Password minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number.'
    ),
  confirmPassword: Yup.string()
    .required('This field is required.')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const ChangePassword = () => {
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await UsersApi.changePassword(
          values.oldPassword,
          values.password
        );
        success(res.message);
      } catch (err) {
        error(err.error);
      }
    },
  });
  const [messageApi, contextHolder] = message.useMessage();

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  const warning = () => {
    messageApi.open({
      type: 'warning',
      content: 'This is a warning message',
    });
  };

  return (
    <>
      {contextHolder}
      <S.ChangePassword>
        <S.Title>Change Password</S.Title>

        <S.Form onSubmit={formik.handleSubmit}>
          <Space direction='vertical'>
            <Input.Password
              placeholder='Old password'
              size='large'
              name='oldPassword'
              onChange={formik.handleChange}
              value={formik.values.oldPassword}
            />
            {formik.errors.oldPassword && formik.touched.oldPassword && (
              <S.ErrorMsg>{formik.errors.oldPassword}</S.ErrorMsg>
            )}
            <Input.Password
              placeholder='Password'
              size='large'
              name='password'
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password && formik.touched.password && (
              <S.ErrorMsg>{formik.errors.password}</S.ErrorMsg>
            )}
            <Input.Password
              placeholder='Confirm password'
              size='large'
              name='confirmPassword'
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
            />
            {formik.errors.confirmPassword &&
              formik.touched.confirmPassword && (
                <S.ErrorMsg>{formik.errors.confirmPassword}</S.ErrorMsg>
              )}
            <S.ButtonWrap>
              <Button type='primary' htmlType='submit'>
                Success
              </Button>
              <S.Button>Update</S.Button>
            </S.ButtonWrap>
          </Space>
        </S.Form>
      </S.ChangePassword>
    </>
  );
};

export default ChangePassword;
