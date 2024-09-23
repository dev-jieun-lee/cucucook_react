import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { userInfoStyles } from "./myPageStyles";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "../../styles/CommonStyles";
import { Visibility, VisibilityOff, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// SweetAlert 초기화
const MySwal = withReactContent(Swal);

// 비밀번호 변경 아코디언 컴포넌트
const ChangePasswordAccordion: React.FC = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: (values) => {
      if (values.newPassword === values.confirmNewPassword) {
        console.log("Password changed");
        MySwal.fire({
          title: t("mypage.password_changed"),
          icon: "success",
          confirmButtonText: t("alert.ok"),
        });
        formik.resetForm(); // Reset form after successful submission
      } else {
        MySwal.fire({
          title: t("mypage.password_mismatch"),
          icon: "error",
          confirmButtonText: t("alert.ok"),
        });
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{t("mypage.change_password")}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={formik.handleSubmit}>
          <FormControl
            fullWidth
            sx={userInfoStyles.formControl}
            variant="outlined"
          >
            <InputLabel htmlFor="newPassword">
              {t("mypage.new_password")}
            </InputLabel>
            <OutlinedInput
              id="newPassword"
              label={t("mypage.new_password")}
              type={showPassword ? "text" : "password"}
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

          <FormControl
            fullWidth
            sx={userInfoStyles.formControl}
            variant="outlined"
          >
            <InputLabel htmlFor="confirmNewPassword">
              {t("mypage.confirm_new_password")}
            </InputLabel>
            <OutlinedInput
              id="confirmNewPassword"
              label={t("mypage.confirm_new_password")}
              type={showPassword ? "text" : "password"}
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
            {t("mypage.save_changes")}
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

const UserInfo = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCancelClick = async () => {
    const confirmCancel = await MySwal.fire({
      title: t("mypage.cancel_edit"),
      text: t("mypage.cancel_edit_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("alert.yes"),
      cancelButtonText: t("alert.no"),
    });

    if (confirmCancel.isConfirmed) {
      navigate("/mypage/Profile");
    }
  };

  const handleSaveChangesClick = async () => {
    const confirmSave = await MySwal.fire({
      title: t("mypage.save_changes"),
      text: t("mypage.save_changes_confirm"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("alert.yes"),
      cancelButtonText: t("alert.no"),
    });

    if (confirmSave.isConfirmed) {
      MySwal.fire({
        title: t("alert.requirement_saved"),
        icon: "success",
        confirmButtonText: t("alert.ok"),
      });
      navigate("/mypage/Profile");
    }
  };

  const handleDeleteAccountClick = async () => {
    const confirmDelete = await MySwal.fire({
      title: t("mypage.delete_account"),
      text: t("mypage.delete_account_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("alert.yes"),
      cancelButtonText: t("alert.no"),
    });

    if (confirmDelete.isConfirmed) {
      navigate("/");
    }
  };

  return (
    <Wrapper>
      <Box sx={userInfoStyles.container}>
        <div className="title">
          <span>{t("mypage.edit_info")}</span>
        </div>
        <FormControl
          fullWidth
          sx={userInfoStyles.formControl}
          variant="outlined"
        >
          <InputLabel htmlFor="username">{t("mypage.username")}</InputLabel>
          <OutlinedInput id="username" label={t("mypage.username")} />
        </FormControl>
        <FormControl
          fullWidth
          sx={userInfoStyles.formControl}
          variant="outlined"
        >
          <InputLabel htmlFor="email">{t("mypage.email")}</InputLabel>
          <OutlinedInput id="email" label={t("mypage.email")} />
        </FormControl>

        <ChangePasswordAccordion />

        <Button variant="outlined" fullWidth sx={userInfoStyles.button}>
          {t("mypage.connect_naver")}
        </Button>
        <Button variant="outlined" fullWidth sx={userInfoStyles.button}>
          {t("mypage.connect_kakao")}
        </Button>

        <FormControl
          fullWidth
          sx={userInfoStyles.formControl}
          variant="outlined"
        >
          <InputLabel htmlFor="phoneNumber">
            {t("mypage.phone_number")}
          </InputLabel>
          <OutlinedInput id="phoneNumber" label={t("mypage.phone_number")} />
        </FormControl>

        <Button
          color="primary"
          variant="contained"
          fullWidth
          sx={userInfoStyles.button}
          onClick={handleSaveChangesClick}
        >
          {t("mypage.save_changes")}
        </Button>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleDeleteAccountClick}
        >
          {t("mypage.delete_account")}
        </Button>
      </Box>
    </Wrapper>
  );
};

export default UserInfo;
