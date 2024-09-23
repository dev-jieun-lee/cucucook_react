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
import { ExpandMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { getMember } from "../members/api"; // 회원 정보를 불러오는 API
import { useAuth } from "../../auth/AuthContext";

// SweetAlert 초기화
const MySwal = Swal;

// 비밀번호 변경 아코디언 컴포넌트
const ChangePasswordAccordion: React.FC = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: (values) => {
      if (values.newPassword === values.confirmNewPassword) {
        MySwal.fire({
          title: t("mypage.password_changed"),
          icon: "success",
          confirmButtonText: t("alert.ok"),
        });
        formik.resetForm();
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
              name="newPassword"
              endAdornment={
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <ExpandMore /> : <ExpandMore />}
                </IconButton>
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
              name="confirmNewPassword"
              endAdornment={
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <ExpandMore /> : <ExpandMore />}
                </IconButton>
              }
            />
          </FormControl>

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={userInfoStyles.button}
          >
            {t("mypage.pw_save_changes")}
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

const UserInfo = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberId = user ? user.memberId.toString() : null;

  // useQuery로 회원 정보 불러오기
  const { data, isLoading, error } = useQuery(
    ["member", memberId],
    () => getMember(memberId!),
    { enabled: !!memberId }
  );

  const formik = useFormik({
    initialValues: {
      username: data?.userId || "",
      name: data?.name || "",
      phone: data?.phone || "",
      email: data?.email || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("폼 제출:", values);
    },
  });

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div>{t("error.fetch_failed")}</div>;

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
      formik.handleSubmit();
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

        <form onSubmit={formik.handleSubmit}>
          {/* 사용자 ID */}
          <FormControl
            fullWidth
            sx={userInfoStyles.formControl}
            variant="outlined"
          >
            <InputLabel htmlFor="username">{t("mypage.username")}</InputLabel>
            <OutlinedInput
              id="username"
              label={t("mypage.username")}
              value={formik.values.username}
              disabled
            />
          </FormControl>

          {/* 이름 */}
          <FormControl
            fullWidth
            sx={userInfoStyles.formControl}
            variant="outlined"
          >
            <InputLabel htmlFor="name">{t("mypage.name")}</InputLabel>
            <OutlinedInput
              id="name"
              label={t("mypage.name")}
              value={formik.values.name}
              onChange={formik.handleChange}
              name="name"
            />
          </FormControl>

          {/* 전화번호 */}
          <FormControl
            fullWidth
            sx={userInfoStyles.formControl}
            variant="outlined"
          >
            <InputLabel htmlFor="phone">{t("mypage.phone_number")}</InputLabel>
            <OutlinedInput
              id="phone"
              label={t("mypage.phone_number")}
              value={formik.values.phone}
              onChange={formik.handleChange}
              name="phone"
            />
          </FormControl>

          {/* 이메일 */}
          <FormControl
            fullWidth
            sx={userInfoStyles.formControl}
            variant="outlined"
          >
            <InputLabel htmlFor="email">{t("mypage.email")}</InputLabel>
            <OutlinedInput
              id="email"
              label={t("mypage.email")}
              value={formik.values.email}
              onChange={formik.handleChange}
              name="email"
            />
          </FormControl>

          <ChangePasswordAccordion />

          <Button variant="outlined" fullWidth sx={userInfoStyles.button}>
            {t("mypage.connect_naver")}
          </Button>
          <Button variant="outlined" fullWidth sx={userInfoStyles.button}>
            {t("mypage.connect_kakao")}
          </Button>

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
        </form>
      </Box>
    </Wrapper>
  );
};

export default UserInfo;
