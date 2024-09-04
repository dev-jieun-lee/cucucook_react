import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Alert,
  Box,
  Typography,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import { useFetchPassword } from "../api"; // 비밀번호 찾기 API 훅 사용
import { Wrapper } from "../../../styles/CommonStyles";
import { LoginWrapper } from "./LoginStyle";
import { useSearchParams, Link } from "react-router-dom";
import { useEmailVerification } from "../../../hooks/useEmailVerification"; // 인증 관련 훅 가져오기

function FindPw({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const {
    verificationCode,
    setVerificationCode,
    isCodeSent,
    isCodeVerified, // 여기서 isCodeVerified 사용
    handleSendCode,
    handleVerifyCode,
    verificationResult,
    timer,
  } = useEmailVerification();

  const [resultVisible, setResultVisible] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const fetchPasswordMutation = useFetchPassword(); // 비밀번호 찾기 API 훅 사용

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      userId: initialId,
      verificationCode: "",
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.name) errors.name = t("members.name_required");
      if (!values.email) errors.email = t("members.email_required");
      if (!values.userId) errors.userId = t("members.id_required");
      if (isCodeSent && !values.verificationCode)
        errors.verificationCode = t("members.verification_code_required");
      return errors;
    },
    onSubmit: (values) => {
      fetchPasswordMutation.mutate(values, {
        onSuccess: (data) => {
          if (data.success) {
            setResultVisible(true);
            setLoginError(null);
          } else {
            setResultVisible(true);
            setLoginError(data.message || t("members.unexpected_error"));
          }
        },
        onError: (error) => {
          setResultVisible(true);
          // error 타입을 명시적으로 any로 캐스팅하여 사용
          const errorMessage =
            (error as any).response?.data?.message ||
            t("members.no_member_info");
          setLoginError(errorMessage);
        },
      });
    },
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <Typography variant="h6">{t("members.find_pw")}</Typography>
        </div>

        <form className="form" onSubmit={formik.handleSubmit}>
          <FormControl
            className="input-form"
            sx={{ m: 1 }}
            variant="outlined"
            error={!!formik.errors.name}
          >
            <InputLabel htmlFor="name">{t("members.name")}</InputLabel>
            <OutlinedInput
              id="name"
              name="name"
              label={t("members.name")}
              value={formik.values.name}
              onChange={formik.handleChange}
              inputProps={{ maxLength: 50 }}
            />
            {formik.errors.name && (
              <FormHelperText error>{formik.errors.name}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            className="input-form"
            sx={{ m: 1 }}
            variant="outlined"
            error={!!formik.errors.userId}
          >
            <InputLabel htmlFor="userId">{t("members.id")}</InputLabel>
            <OutlinedInput
              id="userId"
              name="userId"
              label={t("members.id")}
              value={formik.values.userId}
              onChange={formik.handleChange}
              inputProps={{ maxLength: 50 }}
            />
            {formik.errors.userId && (
              <FormHelperText error>{formik.errors.userId}</FormHelperText>
            )}
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FormControl
              className="input-form"
              sx={{ m: 1, flexGrow: 1 }}
              variant="outlined"
              error={!!formik.errors.email}
            >
              <InputLabel htmlFor="email">{t("members.email")}</InputLabel>
              <OutlinedInput
                id="email"
                name="email"
                label={t("members.email")}
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email && (
                <FormHelperText error>{formik.errors.email}</FormHelperText>
              )}
            </FormControl>
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleSendCode(formik.values.email)}
              fullWidth
              disabled={
                !formik.values.name ||
                !formik.values.email ||
                !formik.values.userId ||
                isCodeSent
              } // 이름, 이메일, ID가 모두 입력되지 않으면 버튼 비활성화
            >
              {t("members.send_code")}
            </Button>
          </Box>

          {isCodeSent && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  mt: 2,
                }}
              >
                <FormControl
                  className="input-form"
                  sx={{ m: 1, flexGrow: 1 }}
                  variant="outlined"
                  error={!!formik.errors.verificationCode}
                >
                  <InputLabel htmlFor="verificationCode">
                    {t("members.verification_code")}
                  </InputLabel>
                  <OutlinedInput
                    id="verificationCode"
                    name="verificationCode"
                    label={t("members.verification_code")}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    endAdornment={
                      <InputAdornment position="end">
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(timer)}
                        </Typography>
                      </InputAdornment>
                    }
                  />
                  {formik.errors.verificationCode && (
                    <FormHelperText error>
                      {formik.errors.verificationCode}
                    </FormHelperText>
                  )}
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ flexShrink: 0 }}
                  onClick={() =>
                    handleVerifyCode(formik.values.email, verificationCode)
                  }
                  disabled={isCodeVerified}
                >
                  {t("members.confirmed")}
                </Button>
              </Box>
              {verificationResult && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {verificationResult}
                </Typography>
              )}
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
            disabled={!isCodeVerified || fetchPasswordMutation.isLoading}
          >
            {t("members.find_pw")}
          </Button>
        </form>

        {resultVisible && (
          <Box sx={{ mt: 2 }}>
            {fetchPasswordMutation.isLoading ? (
              <Typography>{t("members.loading")}</Typography>
            ) : (
              <>
                {fetchPasswordMutation.isSuccess &&
                fetchPasswordMutation.data?.foundId ? (
                  <Box>
                    <Typography>{t("members.temp_password_issued")}</Typography>
                    <Typography>
                      <Link to="/login" style={{ textDecoration: "underline" }}>
                        {t("members.login")}
                      </Link>
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {fetchPasswordMutation.isError || loginError ? (
                      <Typography color="error">
                        {loginError || t("members.unexpected_error")}
                      </Typography>
                    ) : (
                      <Typography color="error">
                        {t("members.no_member_info")}
                      </Typography>
                    )}
                    <Typography>
                      <Link
                        to="/find-id"
                        style={{
                          marginRight: "8px",
                          textDecoration: "underline",
                        }}
                      >
                        {t("members.find_id")}
                      </Link>
                      <Link
                        to="/sign-up"
                        style={{ textDecoration: "underline" }}
                      >
                        {t("members.sign_up")}
                      </Link>
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        {loginError && (
          <Snackbar
            open
            autoHideDuration={6000}
            onClose={() => setLoginError(null)}
          >
            <Alert onClose={() => setLoginError(null)} severity="error">
              {loginError}
            </Alert>
          </Snackbar>
        )}
      </LoginWrapper>
    </Wrapper>
  );
}

export default FindPw;
