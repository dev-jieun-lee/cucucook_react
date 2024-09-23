import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "../../styles/CommonStyles";
import { profileStyles } from "./myPageStyles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { verifyPassword } from "./api"; // api.tsx에서 가져옴
import { useAuth } from "../../auth/AuthContext"; // useAuth를 가져옴
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 import

const Profile: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required(t("mypage.Please enter your password")),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (!user?.userId) {
        setErrors({ password: t("mypage.User ID not found") });
        setSubmitting(false);
        return;
      }

      try {
        console.log("API 호출 시 전달되는 userId:", user.userId);
        const response = await verifyPassword(user.userId, values.password);

        // 응답을 제대로 받았는지 확인하는 추가 콘솔 로그
        console.log("API 응답 상태 코드:", response?.status);
        console.log("API 응답 데이터:", response);

        // 성공 여부에 따라 처리
        if (response && response.success) {
          console.log("비밀번호 검증 성공");
          // 비밀번호 모달을 먼저 닫음
          setPasswordDialogOpen(false);

          // 모달이 닫힌 후 SweetAlert2로 성공 알림 띄우기
          setTimeout(() => {
            Swal.fire({
              title: t("mypage.Success"),
              text: t("mypage.Password verification successful"),
              icon: "success",
              confirmButtonText: t("mypage.OK"),
            }).then(() => {
              // 확인 버튼을 누르면 페이지 이동
              navigate("/mypage/UserInfo");
            });
          }, 300); // 모달 닫힘을 기다리기 위해 약간의 딜레이 추가
        } else {
          console.log("비밀번호 검증 실패 또는 알 수 없는 오류");
          setErrors({ password: t("mypage.Invalid password") });
        }
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            setErrors({ password: t("mypage.Invalid password") });
          } else {
            setErrors({ password: t("mypage.Password verification error") });
          }
        } else {
          setErrors({ password: t("mypage.An unknown error occurred") });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePasswordDialogToggle = () =>
    setPasswordDialogOpen(!passwordDialogOpen);

  return (
    <Wrapper>
      <Box sx={profileStyles?.profileContainer ?? {}}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t("mypage.profile")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePasswordDialogToggle}
        >
          {t("mypage.edit_info")}
        </Button>

        {/* 비밀번호 확인 다이얼로그 */}
        <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogToggle}>
          <DialogTitle>{t("mypage.Please verify your password")}</DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label={t("mypage.Password")}
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <DialogActions>
                <Button onClick={handlePasswordDialogToggle} color="primary">
                  {t("mypage.Cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={formik.isSubmitting}
                >
                  {t("mypage.Verify")}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </Wrapper>
  );
};

export default Profile;
