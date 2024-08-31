import React, { useState, useEffect } from "react";
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
  Grid,
  Link,
} from "@mui/material";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import {
  useSendEmailVerificationCode,
  useVerifyEmailCode,
  findId,
} from "../api";
import { Wrapper } from "../../../styles/CommonStyles";
import { LoginWrapper } from "./LoginStyle";
import LockOpenIcon from "@mui/icons-material/LockOpen";

function FindId({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [verificationTimeout, setVerificationTimeout] = useState<number | null>(
    null
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "success">(
    "error"
  );
  const [foundId, setFoundId] = useState<string | null>(null);
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false); // 인증 성공 상태

  const sendVerificationCodeMutation = useSendEmailVerificationCode();
  const verifyCodeMutation = useVerifyEmailCode();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      verificationCode: "",
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.name) errors.name = t("members.name_required");
      if (!values.email) errors.email = t("members.email_required");
      if (!values.verificationCode)
        errors.verificationCode = t("members.verification_code_required");
      return errors;
    },
    onSubmit: () => {
      if (verificationComplete) {
        findId({
          name: formik.values.name,
          email: formik.values.email,
          verificationCode: formik.values.verificationCode,
        })
          .then((response) => {
            setShowResult(true);
            setFoundId(response.foundId);
            setLoginError(null);
          })
          .catch((error) => {
            setShowResult(true);
            setLoginError(t("members.find_id_error"));
          });
      }
    },
  });

  const handleVerifyClick = async () => {
    if (!formik.values.email) {
      setLoginError(t("members.email_required"));
      return;
    }
    sendVerificationCodeMutation.mutate(formik.values.email, {
      onSuccess: () => {
        setVerificationTimeout(Date.now() + 60000);
        setVerificationComplete(true);
        setLoginError(null);
      },
      onError: (error) => {
        setLoginError("Failed to send verification code");
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
      },
    });
  };

  const handleConfirmClick = async () => {
    if (!formik.values.verificationCode) {
      setLoginError(t("members.verification_code_required"));
      return;
    }
    verifyCodeMutation.mutate(
      {
        email: formik.values.email,
        code: formik.values.verificationCode,
      },
      {
        onSuccess: () => {
          setVerificationComplete(true);
          setIsVerificationSuccess(true); // 인증 성공으로 상태 업데이트
          setLoginError(null);
        },
        onError: () => {
          setLoginError("Failed to verify code");
          setShowResult(true);
        },
      }
    );
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <LockOpenIcon className="title-icon" />
          <Typography variant="h6">{t("members.find_id")}</Typography>
        </div>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="name">{t("members.name")}</InputLabel>
              <OutlinedInput
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange("name")}
                label={t("members.name")}
              />
            </FormControl>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={9}>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="email">{t("members.email")}</InputLabel>
                  <OutlinedInput
                    id="email"
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    label={t("members.email")}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleVerifyClick}
                  fullWidth
                  sx={{ height: "100%" }}
                >
                  {t("members.verify")}
                </Button>
              </Grid>
            </Grid>
            {verificationComplete && (
              <>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={9}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel htmlFor="verificationCode">
                        {t("members.verification_code")}
                      </InputLabel>
                      <OutlinedInput
                        id="verificationCode"
                        value={formik.values.verificationCode}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "verificationCode",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        label={t("members.verification_code")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleConfirmClick}
                      fullWidth
                      sx={{ height: "100%" }}
                    >
                      {t("alert.confirmed")}
                    </Button>
                  </Grid>
                </Grid>
                {isVerificationSuccess && ( // 인증이 성공했을 때만 문구 표시
                  <Typography variant="body2" color="green" sx={{ mt: 1 }}>
                    {t("members.verification_success")}
                  </Typography>
                )}
              </>
            )}
            <Button
              type="submit"
              color="primary"
              variant="contained"
              sx={{ mt: 2 }}
              disabled={!isVerificationSuccess} // 인증이 성공해야 활성화
            >
              {t("members.find_id")}
            </Button>
          </form>
          {showResult && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: "1px solid gray",
                borderRadius: "4px",
              }}
            >
              {foundId ? (
                <>
                  <Typography>{`${t(
                    "members.id_found"
                  )}: ${foundId}`}</Typography>
                  <Link href="/login" sx={{ mr: 2 }}>
                    {t("members.login")}
                  </Link>
                  <Link href="/login/FindPw">{t("members.find_pw")}</Link>
                </>
              ) : (
                <Typography>{t("members.no_info_found")}</Typography>
              )}
            </Box>
          )}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert severity={snackbarSeverity}>{loginError}</Alert>
          </Snackbar>
        </Box>
      </LoginWrapper>
    </Wrapper>
  );
}

export default FindId;
