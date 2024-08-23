import React from 'react';
import { useFormik } from 'formik';
import { Button, FormControl, InputLabel, OutlinedInput, IconButton, InputAdornment, Box, Accordion, AccordionSummary, AccordionDetails, Typography,Modal } from '@mui/material';
import { userInfoStyles } from './myPageStyles';
import { useNavigate } from 'react-router-dom';
import { Wrapper } from '../../styles/CommonStyles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// 비밀번호 변경 아코디언 컴포넌트
const ChangePasswordAccordion: React.FC = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    onSubmit: (values) => {
      if (values.newPassword === values.confirmNewPassword) {
        console.log('Password changed');
        alert(t('menu.mypage.password_changed'));
        formik.resetForm(); // Reset form after successful submission
      } else {
        alert(t('menu.mypage.password_mismatch'));
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<Visibility />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{t('menu.mypage.change_password')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth sx={userInfoStyles.formControl} variant="outlined">
            <InputLabel htmlFor="newPassword">{t('menu.mypage.new_password')}</InputLabel>
            <OutlinedInput
              id="newPassword"
              label={t('menu.mypage.new_password')}
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

          <FormControl fullWidth sx={userInfoStyles.formControl} variant="outlined">
            <InputLabel htmlFor="confirmNewPassword">{t('menu.mypage.confirm_new_password')}</InputLabel>
            <OutlinedInput
              id="confirmNewPassword"
              label={t('menu.mypage.confirm_new_password')}
              type={showPassword ? 'text' : 'password'}
              value={formik.values.confirmNewPassword}
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
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
            sx={userInfoStyles.button}
          >
            {t('menu.mypage.save_changes')}
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

const UserInfo = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCancelClick = () => {
    const confirmCancel = window.confirm('정말 수정을 취소하시겠습니까?');
    if (confirmCancel) {
      navigate('/mypage/Profile');
    }
  };

  const handleSaveChangesClick = () => {
    const confirmSave = window.confirm('변경사항을 저장하시겠습니까?');
    if (confirmSave) {
      alert(t('alert.requirement_saved'));
      navigate('/mypage/Profile');
    } else {
      alert(t('alert.save_changes'));
      navigate('/mypage/Profile');
    }
  };

  return (
    <Wrapper>
    <Box sx={userInfoStyles.container}>
      <div className="title">
        <span>{t('menu.mypage.edit_info')}</span>
      </div>
      <FormControl fullWidth sx={userInfoStyles.formControl} variant="outlined">
        <InputLabel htmlFor="username">{t('menu.mypage.username')}</InputLabel>
        <OutlinedInput id="username" label={t('menu.mypage.username')} />
      </FormControl>
      <FormControl fullWidth sx={userInfoStyles.formControl} variant="outlined">
        <InputLabel htmlFor="email">{t('menu.mypage.email')}</InputLabel>
        <OutlinedInput id="email" label={t('menu.mypage.email')} />
      </FormControl>

      <ChangePasswordAccordion />

      <Button variant="outlined" fullWidth sx={userInfoStyles.button}>
        {t('menu.mypage.connect_naver')}
      </Button>
      <Button variant="outlined" fullWidth sx={userInfoStyles.button}>
        {t('menu.mypage.connect_kakao')}
      </Button>

      <FormControl fullWidth sx={userInfoStyles.formControl} variant="outlined">
        <InputLabel htmlFor="phoneNumber">{t('menu.mypage.phone_number')}</InputLabel>
        <OutlinedInput id="phoneNumber" label={t('menu.mypage.phone_number')} />
      </FormControl>

      <Button
        color="primary"
        variant="contained"
        fullWidth
        sx={userInfoStyles.button}
        onClick={handleSaveChangesClick}
      >
        {t('menu.mypage.save_changes')}
      </Button>

      <Button
        variant="outlined"
        color="error"
        fullWidth
        onClick={() => window.confirm('정말 회원 탈퇴를 하시겠습니까?') && navigate('/')}
      >
        {t('menu.mypage.delete_account')}
      </Button>
    </Box>
    </Wrapper>
  );
};

export default UserInfo;
