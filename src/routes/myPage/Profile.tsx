import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 버튼 클릭 시 호출될 함수
  const handleEditInfoClick = () => {
    navigate('/mypage/UserInfo'); // '/mypage/UserInfo' 경로로 이동
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>

      <Box
        sx={{
          flexGrow: 1,
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
    </Box>
  );
};

export default Profile;
