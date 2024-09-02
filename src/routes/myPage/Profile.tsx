import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "../../styles/CommonStyles";
import { profileStyles } from "./myPageStyles";

const Profile: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 페이지 로드 시 로그인 상태 확인 로직 제거됨

  const handleEditInfoClick = () => {
    navigate("/mypage/UserInfo");
  };

  return (
    <Wrapper>
      <Box sx={profileStyles?.profileContainer ?? {}}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t("menu.mypage.profile")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditInfoClick}
        >
          {t("menu.mypage.edit_info")}
        </Button>
      </Box>
    </Wrapper>
  );
};

export default Profile;
