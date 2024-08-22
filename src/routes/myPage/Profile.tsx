import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // HTTP 요청 라이브러리
import { activityStyles, profileStyles } from './myPageStyles';
import { Wrapper } from '../../styles/CommonStyles';

const Profile: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/members/check-login', { withCredentials: true }); // 로그인 상태 확인 API 호출
        if (response.status === 200) {
          // 로그인 상태 확인 성공
          console.log('로그인 상태 확인 성공');
        } else {
          // 상태가 200이 아닐 경우 처리 (로그인 필요)
          alert(t('alert.login_required'));
          navigate('/login');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error('로그인 상태 확인 오류: ', error.message);
          alert(t('alert.login_required'));
          navigate('/login');
        } else {
          console.error('알 수 없는 오류: ', error);
          alert(t('alert.login_required'));
          navigate('/login');
        }
      }
    };

    checkLoginStatus();
  }, [navigate, t]);

  const handleEditInfoClick = () => {
    navigate('/mypage/UserInfo');
  };

  return (
    <Wrapper>
      <Box sx={profileStyles?.profileContainer ?? {}}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('menu.mypage.profile')}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleEditInfoClick}>
          {t('menu.mypage.edit_info')}
        </Button>
      </Box>
    </Wrapper>
  );
};

export default Profile;