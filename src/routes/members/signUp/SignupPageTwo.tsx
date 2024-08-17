import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, Navigate } from 'react-router-dom';
import { LoginWrapper } from "../login/LoginStyle";
import { Wrapper } from "../../../styles/CommonStyles";

const SignupPageTwo = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;

  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const [customDomain, setCustomDomain] = useState('');

  const emailDomains = [
    { value: 'gmail.com', label: 'gmail.com' },
    { value: 'naver.com', label: 'naver.com' },
    { value: 'daum.net', label: 'daum.net' },
    { value: 'custom', label: t('members.custom_input') }
  ];

  const checkIdAvailability = async (id: string) => {
    try {
      const response = await axios.get(`/api/check-id/${id}`);
      setIsIdAvailable(response.data.isAvailable);
      return response.data.isAvailable;
    } catch (error) {
      console.error('ID availability check failed:', error);
      setIsIdAvailable(false);
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      password: '',
      confirmPassword: '',
      name: '',
      emailLocalPart: '',
      emailDomain: 'gmail.com',
    },
    validationSchema: Yup.object({
      id: Yup.string()
        .required(t('members.id_required'))
        .min(4, t('members.id_min'))
        .test('id-availability', t('members.id_availability'), async (value) => {
          const available = await checkIdAvailability(value || '');
          return available || t('members.id_already_in_use');
        }),
      password: Yup.string()
        .required(t('members.password_required'))
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,15}$/, t('members.password_rules')),
      confirmPassword: Yup.string()
        .required(t('members.confirm_password_required'))
        .oneOf([Yup.ref('password')], t('members.passwords_match')),
      name: Yup.string()
        .required(t('members.name_required'))
        .matches(/^[가-힣]+$/, t('members.name_korean_only')),
      emailLocalPart: Yup.string()
        .email(t('members.email_invalid'))
        .required(t('members.email_required')),
      emailDomain: Yup.string()
        .required(t('members.email_domain_required'))
    }),
    onSubmit: (values) => {
      const fullEmail = values.emailLocalPart + '@' + (values.emailDomain === 'custom' ? customDomain : values.emailDomain);
      alert(`Registered with email: ${fullEmail}`);
    }
  });

  useEffect(() => {
    if (isIdAvailable === false) {
      formik.setFieldError('id', t('members.id_in_use'));
    }
  }, [isIdAvailable, formik, t]);

  if (!phoneNumber) {
    console.error('Phone number is required but not provided');
    return <Navigate to="/signup/signupPageOne" replace />;
  }

  return (
    <Wrapper>
      <LoginWrapper>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>{t('members.signup')}</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="id"
            name="id"
            label={t('members.id')}
            value={formik.values.id}
            onChange={formik.handleChange}
            error={formik.touched.id && Boolean(formik.errors.id)}
            helperText={formik.touched.id && (formik.errors.id || (isIdAvailable === false ? t('members.id_in_use') : null))}
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
            id="phone"
            name="phone"
            label={t('menu.mypage.phone_number')}
            value={phoneNumber}
            disabled
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <TextField
              id="emailLocalPart"
              name="emailLocalPart"
              label={t('Email ID')}
              value={formik.values.emailLocalPart}
              onChange={formik.handleChange}
              error={formik.touched.emailLocalPart && Boolean(formik.errors.emailLocalPart)}
              helperText={formik.touched.emailLocalPart && formik.errors.emailLocalPart}
              InputProps={{
                endAdornment: <InputAdornment position="end">@</InputAdornment>,
              }}
            />
            <Select
              id="emailDomain"
              name="emailDomain"
              value={formik.values.emailDomain}
              onChange={formik.handleChange}
              displayEmpty
            >
              {emailDomains.map(domain => (
                <MenuItem key={domain.value} value={domain.value}>{domain.label}</MenuItem>
              ))}
              {formik.values.emailDomain === 'custom' && (
                <TextField
                  id="customDomain"
                  name="customDomain"
                  label={t('Custom Domain')}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  fullWidth
                />
              )}
            </Select>
            {formik.touched.emailDomain && <FormHelperText>{formik.errors.emailDomain}</FormHelperText>}
          </FormControl>
          <Button color="primary" variant="contained" fullWidth type="submit">
            {t('members.signup')}
          </Button>
        </form>
      </LoginWrapper>
    </Wrapper>
  );
};

export default SignupPageTwo;
