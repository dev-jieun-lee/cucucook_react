import React from 'react';
import { useFormik } from 'formik';
import { Button, FormControl, InputLabel, OutlinedInput, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LoginWrapper, ButtonArea } from '../members/login/LoginStyle';
import { Wrapper } from '../../styles/CommonStyles';
import { useNavigate } from 'react-router-dom';

function UserInfo({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      newPassword: '',
    },
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });

  const handleCancelClick = () => {
    const confirmCancel = window.confirm('정말 수정을 취소하시겠습니까?');
    if (confirmCancel) {
      navigate('/mypage/Profile'); // 이동할 경로
    }
    // 취소 버튼 클릭 시 페이지에 머무름
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <span>{t('mypage.edit_info')}</span>
        </div>

        <form className="form" onSubmit={formik.handleSubmit}>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="username">{t('mypage.username')}</InputLabel>
            <OutlinedInput
              id="username"
              label={t('mypage.username')}
              value={formik.values.username}
              onChange={formik.handleChange}
            />
          </FormControl>

          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="email">{t('mypage.email')}</InputLabel>
            <OutlinedInput
              id="email"
              label={t('mypage.email')}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </FormControl>

          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="password">{t('mypage.current_password')}</InputLabel>
            <OutlinedInput
              id="password"
              label={t('mypage.current_password')}
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
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
            />
          </FormControl>

          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="newPassword">{t('mypage.new_password')}</InputLabel>
            <OutlinedInput
              id="newPassword"
              label={t('mypage.new_password')}
              type={showPassword ? 'text' : 'password'}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
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
            />
          </FormControl>

          <Button
            className="submit-button"
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
          >
            {t('mypage.save_changes')}
          </Button>
        </form>

        <ButtonArea>
          <Button
            variant="outlined"
            onClick={handleCancelClick}
          >
            {t('mypage.cancel')}
          </Button>
        </ButtonArea>
      </LoginWrapper>
    </Wrapper>
  );
}

export default UserInfo;
