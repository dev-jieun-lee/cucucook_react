import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TitleCenter, Wrapper } from "../../styles/CommonStyles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { verifyPassword } from "../../apis/mypageApi"; // api.tsx에서 가져옴
import { useAuth } from "../../auth/AuthContext"; // useAuth를 가져옴
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 import
import { LoginWrapper } from "../../styles/LoginStyle";
import { PwButtonArea, PwInputArea, SubTitle } from "../../styles/MypageStyle";
import SnackbarCustom from "../../components/SnackbarCustom";

const Profile: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required(t("mypage.Please enter your password")),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      console.log(values);
      
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

          // 모달이 닫힌 후 SweetAlert2로 성공 알림 띄우기
          // setTimeout(() => {
            // Swal.fire({
            //   title: t("mypage.Success"),
            //   text: t("mypage.Password verification successful"),
            //   icon: "success",
            //   confirmButtonText: t("mypage.OK"),
            // }).then(() => {
            //   // 확인 버튼을 누르면 페이지 이동
              navigate("/mypage/UserInfo");
            // });
          // }, 300); // 모달 닫힘을 기다리기 위해 약간의 딜레이 추가
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


  return (
    <LoginWrapper>
      <TitleCenter>{t("mypage.profile")}</TitleCenter>
      <SubTitle>{t("members.password_chk_info")}</SubTitle>
      <PwInputArea>
        <form onSubmit={formik.handleSubmit}>
          <FormControl className="form">
            <TextField
              name="password"
              id="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label={t("members.password_chk")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </FormControl>
          <PwButtonArea>
            <Button
              onClick={() => navigate(-1)}
              color="warning"
              type="button"
              variant="outlined"
            >
              {t("mypage.Cancel")}
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={formik.isSubmitting}
              variant="contained"
            >
              {t("mypage.Verify")}
            </Button>
          </PwButtonArea>
        </form>
      </PwInputArea>
    </LoginWrapper>
  );
};

export default Profile;
