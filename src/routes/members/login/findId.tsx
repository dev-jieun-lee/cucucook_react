import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginSubmitButton, LoginWrapper } from "../login/LoginStyle";
import { Wrapper } from "../../../styles/CommonStyles";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  FormHelperText,
  FormGroup,
  AlertColor,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import { useMutation } from "react-query";

function SignupIntro({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("error");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      verificationCode: "",
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("members.email_invalid"))
        .required(t("members.email_required")),
      verificationCode: Yup.string().required(
        t("members.verification_code_required")
      ),
      agreeTerms: Yup.boolean().oneOf([true], t("members.terms_required")),
      agreePrivacy: Yup.boolean().oneOf([true], t("members.privacy_required")),
      agreeMarketing: Yup.boolean().oneOf(
        [true],
        t("members.marketing_required")
      ),
    }),
    onSubmit: async (values) => {
      if (verificationComplete) {
        navigate("/signup/form", { state: { email: values.email } });
      }
    },
  });

  const sendVerificationCode = async (email: string) => {
    try {
      const response = await axios.post("/api/sendVerificationCode", { email });
      if (response.data.success) {
        setSnackbarOpen(true);
        setSnackbarSeverity("success");
        setSignupError(t("members.verification_code_sent"));
        setVerificationCodeSent(true);
      } else {
        throw new Error(t("members.verification_failed_to_send"));
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarSeverity("error");
      setSignupError(t("members.verification_failed_to_send"));
    }
  };

  const verifyCode = async () => {
    try {
      const response = await axios.post("/api/verifyCode", {
        email: formik.values.email,
        code: formik.values.verificationCode,
      });
      if (response.data.verified) {
        setSnackbarOpen(true);
        setSnackbarSeverity("success");
        setSignupError(t("members.verification_success"));
        setVerificationComplete(true);
      } else {
        throw new Error(t("members.verification_code_invalid"));
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarSeverity("error");
      setSignupError(t("members.verification_code_invalid"));
    }
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <PersonIcon className="title-icon" />
          <span>{t("members.join_email")}</span>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label={t("members.email")}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
          />
          {verificationCodeSent && (
            <TextField
              fullWidth
              id="verificationCode"
              name="verificationCode"
              label={t("members.verification_code")}
              value={formik.values.verificationCode}
              onChange={formik.handleChange}
              error={
                formik.touched.verificationCode &&
                Boolean(formik.errors.verificationCode)
              }
              helperText={
                formik.touched.verificationCode &&
                formik.errors.verificationCode
              }
              margin="normal"
            />
          )}

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

          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => sendVerificationCode(formik.values.email)}
            disabled={!formik.values.email || verificationCodeSent}
          >
            {t("members.send_verification_code")}
          </Button>

          {verificationCodeSent && !verificationComplete && (
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={verifyCode}
              disabled={!formik.values.verificationCode}
            >
              {t("members.verify_code")}
            </Button>
          )}

          {verificationComplete && (
            <LoginSubmitButton
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
            >
              {t("members.verify_email_to_continue")}
            </LoginSubmitButton>
          )}
        </form>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
          >
            {signupError || ""}
          </Alert>
        </Snackbar>
      </LoginWrapper>
    </Wrapper>
  );
}

export default SignupIntro;
