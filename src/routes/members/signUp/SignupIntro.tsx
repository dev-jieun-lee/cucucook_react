import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginSubmitButton, LoginWrapper } from "../login/LoginStyle";
import { Wrapper } from "../../../styles/CommonStyles";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  FormHelperText,
  FormGroup,
  Alert,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  useSendEmailVerificationCode,
  useVerifyEmailCode,
  useCheckEmailExists,
} from "../api"; // useCheckEmailExists 훅 추가

function SignupIntro({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState(""); // 인증 코드 입력값
  const [isCodeSent, setIsCodeSent] = useState(false); // 코드 전송 여부
  const [isCodeVerified, setIsCodeVerified] = useState(false); // 코드 검증 여부
  const [timer, setTimer] = useState(60); // 타이머를 60초로 설정
  const [verificationResult, setVerificationResult] = useState<null | string>(
    null
  ); // 인증 결과 메시지
  const [emailSendResult, setEmailSendResult] = useState<null | string>(null); // 이메일 전송 결과 메시지
  const checkEmailExists = useCheckEmailExists(); // 이메일 중복 체크 훅 추가

  let interval: NodeJS.Timeout; // interval 변수를 useEffect 바깥에서 선언

  const sendVerificationCode = useSendEmailVerificationCode(); // 이메일 인증 코드 전송 훅
  const verifyCodeMutation = useVerifyEmailCode(); // 이메일 인증 코드 검증 훅

  // 타이머 업데이트
  useEffect(() => {
    if (isCodeSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setVerificationResult(t("members.verification_code_expired"));
    }
    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 interval을 정리
  }, [isCodeSent, timer]);

  const handleSendCode = async () => {
    if (!formik.values.email) {
      alert(t("members.email_required"));
      return;
    }

    // 이메일 중복 체크
    const emailExists = await checkEmailExists.mutateAsync(formik.values.email);
    if (emailExists) {
      setEmailSendResult(t("members.email_in_use"));
      return;
    }

    sendVerificationCode.mutate(formik.values.email, {
      onSuccess: () => {
        setIsCodeSent(true);
        setTimer(60); // 타이머 시작
        setEmailSendResult(t("members.verification_code_sent"));
      },
      onError: () => {
        setEmailSendResult(t("members.verification_code_error"));
      },
    });
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      setVerificationResult(t("members.verification_code_required"));
      return;
    }

    verifyCodeMutation.mutate(
      { email: formik.values.email, code: verificationCode },
      {
        onSuccess: (data) => {
          if (data.success) {
            setIsCodeVerified(true);
            setVerificationResult(t("members.verification_success")); // 성공 메시지 설정
          } else {
            setVerificationResult(t("members.verification_failed")); // 실패 메시지 설정
          }
        },
        onError: (error) => {
          setVerificationResult(t("members.verification_error")); // 실패 메시지 설정
        },
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("members.email_invalid"))
        .required(t("members.email_required")),
      agreeTerms: Yup.boolean().oneOf([true], t("members.terms_required")),
      agreePrivacy: Yup.boolean().oneOf([true], t("members.privacy_required")),
      agreeMarketing: Yup.boolean(),
    }),
    onSubmit: () => {
      if (isCodeSent && isCodeVerified) {
        navigate("/signup/form", { state: { email: formik.values.email } }); // 인증 성공 후 페이지 이동
      } else {
        alert(t("members.complete_verification"));
      }
    },
  });

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <span>{t("members.join")}</span>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label={t("members.email")}
                value={formik.values.email}
                onChange={(e) => {
                  formik.setFieldValue("email", e.target.value);
                  setEmailSendResult(null); // 이메일이 변경되면 결과 메시지를 초기화
                }}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal"
                inputProps={{ inputMode: "email" }}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendCode}
                disabled={isCodeSent}
              >
                {t("members.send_verification_code")}
              </Button>
            </Grid>
            {emailSendResult && (
              <Grid item xs={12}>
                <Alert
                  severity={
                    emailSendResult.includes("sent") ? "success" : "error"
                  }
                >
                  {emailSendResult}
                </Alert>
              </Grid>
            )}
          </Grid>

          {isCodeSent && (
            <Grid container spacing={2} alignItems="center" marginTop={2}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  id="verificationCode"
                  name="verificationCode"
                  label={t("members.verification_code")}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  margin="normal"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVerifyCode}
                  disabled={isCodeVerified}
                >
                  {t("members.verify_code")}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <div>{`00:${String(timer).padStart(2, "0")}`}</div>
              </Grid>
            </Grid>
          )}

          {verificationResult && (
            <Grid item xs={12}>
              <Alert severity={isCodeVerified ? "success" : "error"}>
                {verificationResult}
              </Alert>
            </Grid>
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
          </FormGroup>

          <LoginSubmitButton
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={!isCodeVerified}
          >
            {t("members.register")}
          </LoginSubmitButton>
        </form>
      </LoginWrapper>
    </Wrapper>
  );
}

export default SignupIntro;
