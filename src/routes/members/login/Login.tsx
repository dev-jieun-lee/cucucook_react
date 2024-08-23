import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Checkbox, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, Alert, AlertColor } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Wrapper } from '../../../styles/CommonStyles';
import { LoginWrapper, ButtonArea } from './LoginStyle';
import { login } from '../api';
import SnackbarCustom from '../../../components/SnackbarCustom';
import { useNavigate, useLocation } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen'; // 아이콘 임포트

function Login({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');
  const [saveId, setSaveId] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      userId: '',
      password: '',
    },
    onSubmit: async (form, { resetForm }) => {
      try {
        const data = await login(form);
        alert(JSON.stringify(data, null, 2));

        if (data.token) {
          localStorage.setItem('token', data.token);

          const from = location.state?.from || '/';
          navigate(from);

        } else {
          setLoginError('로그인 실패');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('로그인 오류: ', error);
        setLoginError('정확한 값을 입력해주세요.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    },
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSaveIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaveId(event.target.checked);
  };

  const handleSignup = () => {
    navigate('/signup/intro');
  };

  const handleFindingId = () => {
    navigate('/findId');
  };

  const handleFindingPw = () => {
    navigate('/findPw');
  };

  // 아이디 입력값 검증 함수
  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // 영어와 숫자만 허용
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      formik.setFieldValue('userId', value);
    }
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <LockOpenIcon className="title-icon" />
          <span>{t("members.login")}</span>
        </div>

        <form className="form" onSubmit={formik.handleSubmit}>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="userId">{t('members.id')}</InputLabel>
            <OutlinedInput
              id="userId"
              label={t('members.id')}
              value={formik.values.userId}
              onChange={handleUserIdChange}
            />
          </FormControl>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="password">{t('members.password')}</InputLabel>
            <OutlinedInput
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label={t('members.password')}
            />
          </FormControl>
          <div className="save-id">
            <FormControlLabel
              className="id-chk"
              control={
                <Checkbox
                  checked={saveId}
                  onChange={handleSaveIdChange}
                />
              }
              label={t('members.save_id')}
            />
          </div>
          <Button
            className="submit-button"
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
          >
            {t("members.login")}
          </Button>
        </form>

        <ButtonArea>
          <button type="button" onClick={handleFindingId}>{t("members.finding_id")}</button>
          <span />
          <button type="button" onClick={handleFindingPw}>{t("members.finding_pw")}</button>
          <span />
          <button type="button" onClick={handleSignup}>{t("members.join")}</button>
        </ButtonArea>

        <SnackbarCustom
          open={snackbarOpen}
          message={loginError || ''}
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        />
      </LoginWrapper>
    </Wrapper>
  );
}

export default Login;
