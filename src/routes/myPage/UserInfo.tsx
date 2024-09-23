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
import { ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material"; // 눈 모양 아이콘 가져오기
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { getMember } from "../members/api"; // 회원 정보 및 비밀번호 변경 API 호출
import { useAuth } from "../../auth/AuthContext";
import { changePasswordByUser, updateUserInfo } from "./api";

// 전화번호 포맷 함수
const formatPhoneNumber = (value: string) => {
  // 숫자만 추출
  const cleaned = value.replace(/\D/g, "");

  // 길이에 따라 하이픈 추가
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
    7,
    11
  )}`;
};

// SweetAlert 초기화
const MySwal = Swal;

// 비밀번호 변경 아코디언 컴포넌트
const ChangePasswordAccordion: React.FC<{ memberId: string }> = ({
  memberId,
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: async (values) => {
      if (values.newPassword === values.confirmNewPassword) {
        try {
          await changePasswordByUser(memberId, values.newPassword);
          MySwal.fire({
            title: t("mypage.password_changed"),
            icon: "success",
            confirmButtonText: t("alert.ok"),
          });
          formik.resetForm();
        } catch (error) {
          MySwal.fire({
            title: t("mypage.password_change_failed"),
            text: t("mypage.password_change_error"),
            icon: "error",
            confirmButtonText: t("alert.ok"),
          });
        }
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
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
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
            name="confirmNewPassword"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
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
          fullWidth
          onClick={() => formik.handleSubmit()}
          sx={userInfoStyles.button}
        >
          {t("mypage.pw_save_changes")}
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

// UserInfo 컴포넌트
const UserInfo = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberId = user ? user.memberId.toString() : null;
  const [phone, setPhone] = useState("");

  // useQuery로 회원 정보 불러오기
  const { data, isLoading, error } = useQuery(
    ["member", memberId],
    () => getMember(memberId!),
    {
      enabled: !!memberId,
      onSuccess: (data) => {
        setPhone(formatPhoneNumber(data.phone)); // 초기 전화번호 설정
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      username: data?.userId || "",
      name: data?.name || "",
      phone: phone || "",
      email: data?.email || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateUserInfo(
          memberId!,
          values.name,
          values.email,
          values.phone
        );
        MySwal.fire({
          title: t("mypage.info_updated"),
          icon: "success",
          confirmButtonText: t("alert.ok"),
        });
      } catch (error) {
        MySwal.fire({
          title: t("mypage.update_failed"),
          icon: "error",
          confirmButtonText: t("alert.ok"),
        });
      }
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.replace(/\D/g, "").length <= 11) {
      setPhone(formatPhoneNumber(value)); // 전화번호 형식 자동 적용
      formik.setFieldValue("phone", value);
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

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div>{t("error.fetch_failed")}</div>;

  return (
    <Wrapper>
      <Box sx={userInfoStyles.container}>
        <div className="title">
          <span>{t("mypage.edit_info")}</span>
        </div>

        <form onSubmit={formik.handleSubmit}>
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

          <FormControl
            fullWidth
            sx={userInfoStyles.formControl}
            variant="outlined"
          >
            <InputLabel htmlFor="phone">{t("mypage.phone_number")}</InputLabel>
            <OutlinedInput
              id="phone"
              label={t("mypage.phone_number")}
              value={phone}
              onChange={handlePhoneChange}
              name="phone"
            />
          </FormControl>

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

          <ChangePasswordAccordion memberId={memberId!} />

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
