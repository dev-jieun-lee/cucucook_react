import React from 'react';
import { useFormik } from 'formik';
import { Button, FormControl, InputLabel, OutlinedInput, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LoginWrapper, ButtonArea } from '../members/login/LoginStyle';
import { Wrapper } from '../../styles/CommonStyles';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

// Modal 스타일 설정
Modal.setAppElement('#root'); // 앱의 root element 설정

function UserInfo({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      newPassword: '',
      confirmNewPassword: '', // 비밀번호 확인 추가
    },
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });

  const handleCancelClick = () => {
    const confirmCancel = window.confirm(t('sentence.confirm_cancel'));
    if (confirmCancel) {
      navigate('/mypage/profile');
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직을 여기에 추가
    console.log('Kakao login');
  };

  const handleNaverLogin = () => {
    // 네이버 로그인 로직을 여기에 추가
    console.log('Naver login');
  };

  const handleKakaoLogout = () => {
    // 카카오 로그아웃 로직을 여기에 추가
    console.log('Kakao logout');
  };

  const handleNaverLogout = () => {
    // 네이버 로그아웃 로직을 여기에 추가
    console.log('Naver logout');
  };

  const handleAccountDelete = () => {
    if (window.confirm(t('sentence.confirm_delete_account'))) {
      // 회원 탈퇴 로직 추가
      console.log('Account deleted');
    }
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <span>{t('menu.mypage.edit_info')}</span>
        </div>

        <form className="form" onSubmit={formik.handleSubmit}>
          {/* 아이디 입력 필드 */}
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="username">{t('menu.mypage.username')}</InputLabel>
            <OutlinedInput
              id="username"
              label={t('menu.mypage.username')}
              value={formik.values.username}
              onChange={formik.handleChange}
              disabled
            />
          </FormControl>

          {/* 이름 입력 필드 */}
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="name">{t('menu.mypage.name')}</InputLabel>
            <OutlinedInput
              id="name"
              label={t('menu.mypage.name')}
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </FormControl>

          {/* 비밀번호 변경 버튼 */}
          <Button
            variant="outlined"
            onClick={openModal}
            sx={{ m: 1 }}
          >
            {t('menu.mypage.change_password')}
          </Button>

          {/* SNS 연동 버튼 */}
          <Button
            variant="outlined"
            onClick={handleKakaoLogin}
            sx={{ m: 1 }}
          >
            {t('menu.mypage.kakao_login')}
          </Button>
          <Button
            variant="outlined"
            onClick={handleKakaoLogout}
            sx={{ m: 1 }}
          >
            {t('menu.mypage.kakao_disconnect')}
          </Button>
          <Button
            variant="outlined"
            onClick={handleNaverLogin}
            sx={{ m: 1 }}
          >
            {t('menu.mypage.naver_login')}
          </Button>
          <Button
            variant="outlined"
            onClick={handleNaverLogout}
            sx={{ m: 1 }}
          >
            {t('menu.mypage.naver_disconnect')}
          </Button>

          {/* 이메일 입력 필드 */}
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="email">{t('menu.mypage.email')}</InputLabel>
            <OutlinedInput
              id="email"
              label={t('menu.mypage.email')}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </FormControl>

          {/* 전화번호 입력 필드 */}
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="phone">{t('menu.mypage.phone')}</InputLabel>
            <OutlinedInput
              id="phone"
              label={t('menu.mypage.phone')}
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
          </FormControl>

          {/* 수정 버튼 */}
          <Button
            className="submit-button"
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
            sx={{ m: 1 }}
          >
            {t('menu.mypage.save_changes')}
          </Button>

          {/* 회원 탈퇴 버튼 */}
          <Button
            variant="outlined"
            color="error"
            onClick={handleAccountDelete}
            sx={{ m: 1 }}
          >
            {t('menu.mypage.delete_account')}
          </Button>
        </form>

        {/* 비밀번호 변경 모달 */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Change Password"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '90%', // 모달의 너비 조정
              maxWidth: '500px', // 모달의 최대 너비
              padding: '20px', // 패딩 추가
            },
          }}
        >
          <h2>{t('menu.mypage.change_password')}</h2>
          <form>
            {/* 새로운 비밀번호 입력 필드 */}
            <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
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

            {/* 비밀번호 확인 입력 필드 */}
            <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
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
              onClick={() => {
                if (formik.values.newPassword === formik.values.confirmNewPassword) {
                  console.log('Password changed');
                  closeModal();
                } else {
                  alert(t('sentence.password_mismatch'));
                }
              }}
              fullWidth
              sx={{ mb: 2 }}
            >
              {t('menu.mypage.save_changes')}
            </Button>
            <Button
              variant="outlined"
              onClick={closeModal}
              fullWidth
            >
              {t('menu.mypage.cancel')}
            </Button>
          </form>
        </Modal>

      </LoginWrapper>
    </Wrapper>
  );
}

export default UserInfo;
