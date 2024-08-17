import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { LoginWrapper } from "../login/LoginStyle";
import { Wrapper } from "../../../styles/CommonStyles";
import { useTranslation } from 'react-i18next'; // 추가

const SignupPageTwo = () => {
  const { t } = useTranslation(); // 번역 훅 사용

  const formik = useFormik({
    initialValues: {
      id: '',
      password: '',
      confirmPassword: '',
      name: '',
      email: '',
    },
    validationSchema: Yup.object({
      id: Yup.string().required(t('members.id_required')).min(4, t('members.id_min')),
      password: Yup.string()
        .required(t('members.password_required'))
        .min(8, t('members.password_min'))
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/, t('members.password_rules')),
      confirmPassword: Yup.string()
        .required(t('members.confirm_password_required'))
        .oneOf([Yup.ref('password')], t('members.passwords_match')),
      name: Yup.string().required(t('members.name_required')),
      email: Yup.string().email(t('members.email_invalid')).required(t('members.email_required')),
    }),

    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
      // 회원가입 처리 로직 구현 필요
    }
  });

  return (
    <Wrapper>
      <LoginWrapper>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="id"
            name="id"
            label={t('members.id')}
            value={formik.values.id}
            onChange={formik.handleChange}
            error={formik.touched.id && Boolean(formik.errors.id)}
            helperText={formik.touched.id && formik.errors.id}
            margin="normal"
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label={t('members.password')}
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
          />
          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label={t('members.password_chk')}
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            margin="normal"
          />
          <TextField
            fullWidth
            id="name"
            name="name"
            label={t('menu.mypage.name')}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
          />
          <TextField
            fullWidth
            id="email"
            name="email"
            label={t('menu.mypage.email')}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
          />
          <Button color="primary" variant="contained" fullWidth type="submit">
            {t('members.signup')}
          </Button>
        </form>
      </LoginWrapper>
    </Wrapper>
  );
};

export default SignupPageTwo;
