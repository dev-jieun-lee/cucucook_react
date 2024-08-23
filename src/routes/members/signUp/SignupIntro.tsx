import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginSubmitButton, LoginWrapper } from "../login/LoginStyle";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  FormHelperText,
  FormGroup,
  AlertColor,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import { useMutation } from "react-query";
import { phoneCheck } from "../api";
import { error } from "console";
import SnackbarCustom from "../../../components/SnackbarCustom";

function SignupIntro({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); //스낵바
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("error"); // 스낵바 색깔, 기본은 'error'
  const [signupError, setSignupError] = useState<string | null>(null); // 오류 메시지 상태

  //폰 번호 중복체크
  const mutation = useMutation(phoneCheck, {
    onSuccess: (data) => {
      if (!data) {
        navigate("/signup/form", { state: { phone: data.phone } });
      } else {
        setSignupError(t("members.phone_number_invalid"));
        setSnackbarSeverity("error"); // 실패 시 빨간색
        setSnackbarOpen(true); // 스낵바 열기
      }
    },
    onError: (error) => {
      console.error(error);
      setSignupError(t("members.phone_number_error"));
      setSnackbarSeverity("error"); // 실패 시 빨간색
      setSnackbarOpen(true); // 스낵바 열기
    },
  });
  const formik = useFormik({
    initialValues: {
      phone: "",
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false,
    },
    validationSchema: Yup.object({
      phone: Yup.string().required(t("members.phone_number_required")),
      agreeTerms: Yup.boolean().oneOf([true], t("members.terms_required")),
      agreePrivacy: Yup.boolean().oneOf([true], t("members.privacy_required")),
      agreeMarketing: Yup.boolean().oneOf(
        [true],
        t("members.marketing_required")
      ),
    }),
    onSubmit: (values) => {
      // phone 값을 객체로 전달
      mutation.mutate({ phone: values.phone });
    },
  });

  //스낵바 닫기
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <PersonIcon className="title-icon" />
          <span>{t("members.join")}</span>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label={t("members.phone_number")}
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            margin="normal"
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeTerms"
                  checked={formik.values.agreeTerms}
                  onChange={formik.handleChange}
                />
              }
              label={t("members.agree_terms")}
            />
            {formik.touched.agreeTerms && formik.errors.agreeTerms && (
              <FormHelperText error>{formik.errors.agreeTerms}</FormHelperText>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  name="agreePrivacy"
                  checked={formik.values.agreePrivacy}
                  onChange={formik.handleChange}
                />
              }
              label={t("members.agree_privacy")}
            />
            {formik.touched.agreePrivacy && formik.errors.agreePrivacy && (
              <FormHelperText error>
                {formik.errors.agreePrivacy}
              </FormHelperText>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeMarketing"
                  checked={formik.values.agreeMarketing}
                  onChange={formik.handleChange}
                />
              }
              label={t("members.agree_marketing")}
            />
            {formik.touched.agreeMarketing && formik.errors.agreeMarketing && (
              <FormHelperText error>
                {formik.errors.agreeMarketing}
              </FormHelperText>
            )}
          </FormGroup>

          <LoginSubmitButton
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
          >
            {t("members.verify_continue")}
          </LoginSubmitButton>
        </form>

        <SnackbarCustom
          open={snackbarOpen}
          message={signupError || ""}
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        />
      </LoginWrapper>
    </Wrapper>
  );
}

export default SignupIntro;
