import React from 'react';
import { useTranslation } from "react-i18next";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoginWrapper } from "../login/LoginStyle";
import { Wrapper } from "../../../styles/CommonStyles";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function SignupPageOne() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      phone: '',
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false
    },
    validationSchema: Yup.object({
      phone: Yup.string().required(t('members.phone_number_required')),
      agreeTerms: Yup.boolean().oneOf([true], t('members.terms_required')),
      agreePrivacy: Yup.boolean().oneOf([true], t('members.privacy_required')),
      agreeMarketing: Yup.boolean().oneOf([true], t('members.marketing_required'))
    }),
    onSubmit: (values, { setSubmitting }) => {
      alert(JSON.stringify(values, null, 2)); // 필요에 따라 제거 가능
      setSubmitting(false);
      navigate('/signup/signupPageTwo', { state: { phoneNumber: values.phone } }); // 전화번호와 함께 리다이렉트
    }
  });

  return (
    <Wrapper>
      <LoginWrapper>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>{t('members.terms_title')}</h2>
          <h3>{t('members.phone_verification')}</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label={t('members.phone_number')}
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            margin="normal"
          />
          <FormControlLabel
            control={<Checkbox name="agreeTerms" checked={formik.values.agreeTerms} onChange={formik.handleChange} />}
            label={t('members.agree_terms')}
          />
          <FormControlLabel
            control={<Checkbox name="agreePrivacy" checked={formik.values.agreePrivacy} onChange={formik.handleChange} />}
            label={t('members.agree_privacy')}
          />
          <FormControlLabel
            control={<Checkbox name="agreeMarketing" checked={formik.values.agreeMarketing} onChange={formik.handleChange} />}
            label={t('members.agree_marketing')}
          />
           <Button color="primary" variant="contained" fullWidth type="submit">
            {t('members.verify_continue')}
          </Button>
        </form>
      </LoginWrapper>
    </Wrapper>
  );
}

export default SignupPageOne;
