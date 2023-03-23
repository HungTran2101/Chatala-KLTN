import { ErrorMessage, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import * as S from "./ChangePassword.styled";
import { useFormik } from "formik";
import { UsersApi } from "../../../../../services/api/users";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("This field is required."),
  password: Yup.string()
    .required("This field is required.")
    .matches(
      //fail special signature validation
      /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/,
      "Password minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number."
    ),
  confirmPassword: Yup.string()
    .required("This field is required.")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const ChangePassword = () => {
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await UsersApi.changePassword(
          values.oldPassword,
          values.password
        );
        alert(res.message);
      } catch (err) {
        alert(err.error);
      }
    },
  });

  const [focus, setFocus] = useState("");

  return (
    <S.ChangePassword>
      <S.Title>Change Password</S.Title>

      <S.Form onSubmit={formik.handleSubmit}>
        <S.InputWrap>
          <S.Input
            type="password"
            name="oldPassword"
            onFocus={(e) => setFocus(e.target.name)}
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            onBlur={(e) => setFocus("")}
          />
          <S.Label
            htmlFor="oldPassword"
            active={focus === "oldPassword" || formik.values.oldPassword !== ""}
          >
            Old Password
          </S.Label>
          {formik.errors.oldPassword && formik.touched.oldPassword && (
            <S.ErrorMsg>{formik.errors.oldPassword}</S.ErrorMsg>
          )}
        </S.InputWrap>
        <S.InputWrap>
          <S.Input
            type="password"
            name="password"
            onFocus={(e) => setFocus(e.target.name)}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={(e) => setFocus("")}
          />
          <S.Label
            htmlFor="password"
            active={focus === "password" || formik.values.password !== ""}
          >
            New Password
          </S.Label>
          {formik.errors.password && formik.touched.password && (
            <S.ErrorMsg>{formik.errors.password}</S.ErrorMsg>
          )}
        </S.InputWrap>
        <S.InputWrap>
          <S.Input
            type="password"
            name="confirmPassword"
            onFocus={(e) => setFocus(e.target.name)}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={() => setFocus("")}
          />
          <S.Label
            htmlFor="confirmPassword"
            active={
              focus === "confirmPassword" ||
              formik.values.confirmPassword !== ""
            }
          >
            Confirm Password
          </S.Label>
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <S.ErrorMsg>{formik.errors.confirmPassword}</S.ErrorMsg>
          )}
        </S.InputWrap>
        <S.ButtonWrap>
          <S.Button type="submit">Update</S.Button>
        </S.ButtonWrap>
      </S.Form>
    </S.ChangePassword>
  );
};

export default ChangePassword;
