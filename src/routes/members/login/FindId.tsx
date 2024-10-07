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
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import { findId } from "../../../apis/memberApi";
import { Wrapper } from "../../../styles/CommonStyles";
import {
  LoginWrapper,
  ButtonArea,
  StyledAnchor,
  FindIdBox,
} from "../../../styles/LoginStyle";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useEmailVerification } from "../../../hooks/useEmailVerification"; // Assumed import path

function FindId({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const {
    verificationCode,
    setVerificationCode,
    isCodeSent,
    isCodeVerified,
    handleSendCode,
    handleVerifyCode,
    verificationResult,
    emailSendResult,
    resetVerification,
  } = useEmailVerification();

  const [showResult, setShowResult] = useState(false);
  const [foundId, setFoundId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "success">(
    "error"
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.name) errors.name = t("members.name_required");
      if (!values.email) errors.email = t("members.email_required");
      return errors;
    },
    onSubmit: (values) => {
      if (!isCodeVerified) {
        alert(t("members.verify_email_first"));
        return;
      }
      findId({
        name: values.name,
        email: values.email,
        verificationCode: verificationCode,
      })
        .then((response) => {
          setShowResult(true);
          setFoundId(response.foundId);
        })
        .catch((error) => {
          setShowResult(true);
          setSnackbarOpen(true);
          setSnackbarSeverity("error");
        });
    },
  });

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <PersonSearchIcon className="title-icon" />
          <span>{t("members.find_id")}</span>
        </div>
        <FindIdBox>
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
              <Grid item xs={3}>
                <Button
                  className="find-btn"
                  color="secondary"
                  variant="outlined"
                  onClick={() => handleSendCode(formik.values.email)}
                  fullWidth
                  disabled={
                    !formik.values.name || !formik.values.email || isCodeSent
                  } // 이름과 이메일이 모두 입력되지 않으면 버튼 비활성화
                >
                  {t("members.send_code")}
                </Button>
              </Grid>
            </Grid>
            {isCodeSent && (
              <Grid container spacing={2} alignItems="center" className="email-area">
                <Grid item xs={9}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="verificationCode">
                      {t("members.verification_code")}
                    </InputLabel>
                    <OutlinedInput
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      label={t("members.verification_code")}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    className="find-btn"
                    color="secondary"
                    variant="outlined"
                    onClick={() =>
                      handleVerifyCode(formik.values.email, verificationCode)
                    }
                    fullWidth
                    disabled={isCodeVerified}
                  >
                    {t("members.confirmed")}
                  </Button>
                </Grid>
              </Grid>
            )}
            {verificationResult && (
              <Typography color="error" sx={{ mt: 2 }}>
                {verificationResult}
              </Typography>
            )}
            <Button
              className="submit"
              type="submit"
              color="inherit"
              variant="contained"
              sx={{ mt: 2 }}
              disabled={!isCodeVerified}
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
                  <ButtonArea>
                    <StyledAnchor to="/login">
                      {t("members.login") + "     "}
                    </StyledAnchor>
                    |
                    <StyledAnchor to="/login/FindPw">
                      {"     " + t("members.find_pw")}
                    </StyledAnchor>
                  </ButtonArea>
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
            <Alert severity={snackbarSeverity}>
              {t("members.find_id_error")}
            </Alert>
          </Snackbar>
        </FindIdBox>
      </LoginWrapper>
    </Wrapper>
  );
}

export default FindId;
