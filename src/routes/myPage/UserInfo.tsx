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
import { activityUserInfoStyles } from "./myPageStyles";

import { useNavigate } from "react-router-dom";
import { Wrapper } from "../../styles/CommonStyles";
import { ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { getMember, deleteAccount } from "../members/membersApi";
import { useAuth } from "../../auth/AuthContext";
import { changePasswordByUser, updateMember } from "./mypageApi";
import Cookies from "js-cookie"; // 쿠키를 삭제하기 위해 필요

// 전화번호 포맷 함수
const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, ""); // 숫자만 추출
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
    7,
    11
  )}`;
};

// 입력된 이름을 한글로 변환하는 함수
const convertToHangul = (input: string) => {
  const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
  return input.match(hangulRegex)?.join("") || "";
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
          sx={activityUserInfoStyles.formControl}
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
          sx={activityUserInfoStyles.formControl}
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
          onClick={() => formik.handleSubmit()} // 비밀번호 변경 함수 호출
          sx={activityUserInfoStyles.button}
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
        await updateMember(memberId!, values.name, values.email, values.phone);
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 이메일에 영문자, 숫자, 특수문자만 허용
    const validEmailRegex = /^[a-zA-Z0-9@._-]*$/;
    if (validEmailRegex.test(value)) {
      formik.setFieldValue("email", value);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const hangulValue = convertToHangul(value); // 한글로 변환
    formik.setFieldValue("name", hangulValue); // 한글 외의 문자는 자동으로 제거됨
  };

  // 이름, 전화번호, 이메일 중 하나라도 변경되었는지 확인
  const isFormModified =
    formik.values.name !== data?.name ||
    formik.values.phone !== data?.phone ||
    formik.values.email !== data?.email;

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

    if (confirmDelete.isConfirmed && memberId) {
      try {
        await deleteAccount(memberId); // 회원 탈퇴 API 호출 (타입 변환 제거)
        Cookies.remove("auth_token"); // 쿠키에 저장된 인증 토큰 삭제 (로그아웃)
        MySwal.fire({
          title: t("mypage.account_deleted"),
          icon: "success",
          confirmButtonText: t("alert.ok"),
        });
        navigate("/"); // 성공 후 홈으로 이동
      } catch (error) {
        MySwal.fire({
          title: t("mypage.delete_failed"),
          text: t("mypage.delete_account_error"),
          icon: "error",
          confirmButtonText: t("alert.ok"),
        });
      }
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div>{t("error.fetch_failed")}</div>;

  return (
    <Wrapper>
      <Box sx={activityUserInfoStyles.container}>
        <div className="title">
          <span>{t("mypage.edit_info")}</span>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <FormControl
            fullWidth
            sx={activityUserInfoStyles.formControl}
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
            sx={activityUserInfoStyles.formControl}
            variant="outlined"
          >
            <InputLabel htmlFor="name">{t("mypage.name")}</InputLabel>
            <OutlinedInput
              id="name"
              label={t("mypage.name")}
              value={formik.values.name}
              onChange={handleNameChange} // 이름 변경 시 한글만 입력되도록 처리
              name="name"
            />
          </FormControl>

          <FormControl
            fullWidth
            sx={activityUserInfoStyles.formControl}
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
            sx={activityUserInfoStyles.formControl}
            variant="outlined"
          >
            <InputLabel htmlFor="email">{t("mypage.email")}</InputLabel>
            <OutlinedInput
              id="email"
              label={t("mypage.email")}
              value={formik.values.email}
              onChange={handleEmailChange} // 이메일에 문자 제한 추가
              name="email"
            />
          </FormControl>

          {/* 비밀번호 변경 아코디언 */}
          <ChangePasswordAccordion memberId={memberId!} />

          <Button
            variant="outlined"
            fullWidth
            sx={activityUserInfoStyles.button}
          >
            {t("mypage.connect_naver")}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={activityUserInfoStyles.button}
          >
            {t("mypage.connect_kakao")}
          </Button>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            sx={activityUserInfoStyles.button}
            onClick={handleSaveChangesClick}
            disabled={!isFormModified || !formik.isValid} // 값이 변경되지 않았거나 유효하지 않으면 비활성화
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
