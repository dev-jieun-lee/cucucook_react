import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Wrapper } from '../../styles/CommonStyles'; // 기존의 Wrapper 스타일을 사용
import { useNavigate } from 'react-router-dom';

function Profile({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 버튼 클릭 시 호출될 함수
  const handleEditInfoClick = () => {
    navigate('/mypage/UserInfo'); // '/mypage/UserInfo' 경로로 이동
  };

  return (
    <Wrapper>
      <Box
        sx={{
          textAlign: 'center',
          margin: '20px auto',
          maxWidth: '600px',
          padding: '20px',
          backgroundColor: 'background.default',
          borderRadius: '8px',
          boxShadow: 1,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {t('menu.mypage.profile')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditInfoClick}
        >
          {t('menu.mypage.edit_info')}
        </Button>
      </Box>
    </Wrapper>
  );
}

export default Profile;
