import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Button, FormControl, Select, MenuItem, FormHelperText, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginSubmitButton, LoginWrapper } from "../login/LoginStyle";
import { Wrapper } from "../../../styles/CommonStyles";
import PersonIcon from '@mui/icons-material/Person';

const Signup = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.phone;

  console.log(phoneNumber);


  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const [customDomain, setCustomDomain] = useState('');

  const emailDomains = [
    { value: 'gmail.com', label: 'gmail.com' },
    { value: 'naver.com', label: 'naver.com' },
    { value: 'daum.net', label: 'daum.net' },
    { value: 'custom', label: t('members.custom_input') }
  ];

  //아이디 중복검사
  const idDuplicationChk = async (id: string) => {
    try {
      const response = await axios.get(`/api/members/check-id/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('ID availability check failed:', error.message, error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
      return false;
    }
  };

  const validate = async (values: any) => {
    const errors: any = {};
    const { id, password, confirmPassword, name, emailLocalPart, emailDomain, customDomain } = values;

    if (!id) {
      errors.id = t('members.id_required');
    } else if (id.length < 4) {
      errors.id = t('members.id_min');
    } else {
      const isAvailable = await idDuplicationChk(id);
      setIsIdAvailable(isAvailable);
      if (!isAvailable) {
        errors.id = t('members.id_in_use');
      }
    }

    if (!password) {
      errors.password = t('members.password_required');
    } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,15}$/.test(password)) {
      errors.password = t('members.password_rules');
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = t('members.passwords_match');
    }

    if (!name) {
      errors.name = t('members.name_required');
    } else if (!/^[가-힣]+$/.test(name)) {
      errors.name = t('members.name_korean_only');
    }

    if (!emailLocalPart) {
      errors.emailLocalPart = t('members.email_required');
    }

    if (!emailDomain) {
      errors.emailDomain = t('members.email_domain_required');
    } else if (emailDomain === 'custom' && !customDomain) {
      errors.customDomain = t('members.custom_domain_required');
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      password: '',
      confirmPassword: '',
      name: '',
      emailLocalPart: '',
      emailDomain: 'gmail.com',
      customDomain: ''
    },
    validate,
    onSubmit: async (values) => {
      const fullEmail = values.emailLocalPart + '@' + (values.emailDomain === 'custom' ? customDomain : values.emailDomain);
      try {
        await axios.post('/api/members/register', {
          userId: values.id,
          password: values.password,
          name: values.name,
          phone: phoneNumber,
          email: fullEmail,
          smsNoti: true,
          emailNoti: true
        });
        alert('Registration successful!');
        navigate('/login');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert('Registration failed: ' + (error.response?.data || 'Unknown error'));
        } else {
          console.error('Unexpected error:', error);
          alert('An unexpected error occurred');
        }
      }
    }
  });

  return (
    <Wrapper>
      <LoginWrapper>
      <div className="title">
          <PersonIcon className="title-icon" />
          <span>{t("members.join")}</span>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <FormControl className='input-form'>
            <TextField
              id="id"
              name="id"
              label={t('members.id')}
              value={formik.values.id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.id && Boolean(formik.errors.id)}
              helperText={formik.touched.id && formik.errors.id}
              margin="normal"
            />
            {formik.touched.id && isIdAvailable === false && (
              <FormHelperText error>{t('members.id_in_use')}</FormHelperText>
            )}
            {formik.touched.id && isIdAvailable === true && (
              <FormHelperText>{t('members.id_available')}</FormHelperText>
            )}
          </FormControl>

          <FormControl className='input-form'>
            <TextField
              id="password"
              name="password"
              label={t('members.password')}
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
            />
          </FormControl>

          <FormControl className='input-form'>
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label={t('members.password_chk')}
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              margin="normal"
            />
          </FormControl>

          <FormControl className='input-form'>
            <TextField
              id="name"
              name="name"
              label={t('menu.mypage.name')}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
          </FormControl>

          <FormControl className='input-form'>
            <TextField
              id="phone"
              name="phone"
              label={t('menu.mypage.phone_number')}
              value={phoneNumber}
              disabled
              margin="normal"
            />
          </FormControl>

          <FormControl className='input-form' >
            <div className='input-email'>
                <TextField
                  className='email'
                  id="emailLocalPart"
                  name="emailLocalPart"
                  label={t('text.email')}
                  value={formik.values.emailLocalPart}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.emailLocalPart && Boolean(formik.errors.emailLocalPart)}
                  helperText={formik.touched.emailLocalPart && formik.errors.emailLocalPart}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">@</InputAdornment>,
                  }}
                />
                <Select
                  className='email-select'
                  id="emailDomain"
                  name="emailDomain"
                  value={formik.values.emailDomain}
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (e.target.value !== 'custom') {
                      setCustomDomain('');
                    }
                  }}
                >
                  {emailDomains.map(domain => (
                    <MenuItem key={domain.value} value={domain.value}>{domain.label}</MenuItem>
                  ))}
                </Select>
            </div>
            {formik.values.emailDomain === 'custom' && (
              <TextField
                className='custom-domian'
                id="customDomain"
                name="customDomain"
                label={t('sentence.input_domain')}
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                error={formik.touched.customDomain && Boolean(formik.errors.customDomain)}
                helperText={formik.touched.customDomain && formik.errors.customDomain}
                fullWidth
              />
            )}
          </FormControl>

          <LoginSubmitButton color="primary" variant="contained" fullWidth type="submit">
            {t('members.signup')}
          </LoginSubmitButton>
        </form>
      </LoginWrapper>
    </Wrapper>
  );
};

export default Signup;
