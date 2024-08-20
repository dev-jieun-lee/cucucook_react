import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { activityStyles, profileStyles } from "./myPageStyles";
import { Wrapper } from "../../styles/CommonStyles";

const Profile: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
