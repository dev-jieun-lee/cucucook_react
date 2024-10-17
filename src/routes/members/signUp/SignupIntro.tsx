import React, { useState } from "react"; // useState import 추가
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  TextField,
  FormGroup,
  Alert,
  Grid,
  Box,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "../../../styles/CommonStyles";
import {
  StyledSubtitle,
  LeftAlignedFormControlLabel,
  CheckBoxContainer,
  SignupIntroWrapper,
} from "../../../styles/LoginStyle";
import { useEmailVerification } from "../../../hooks/useEmailVerification";
import PersonIcon from "@mui/icons-material/Person";

function SignupIntro({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    verificationCode,
    setVerificationCode,
    isCodeSent,
    isCodeVerified,
    handleSendCode,
    handleVerifyCode,
    verificationResult,
  } = useEmailVerification();

  const [emailError, setEmailError] = useState<string | null>(null); // emailError 상태 변수 정의

  const formik = useFormik({
    initialValues: {
      email: "",
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false,
      allChecked: false,
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
      if (isCodeVerified) {
        navigate("/signup/form", { state: { email: formik.values.email } }); // 인증 성공 후 페이지 이동
      }
    },
  });

  // 개별 약관 체크박스 핸들러
  const handleIndividualCheck = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    formik.setFieldValue(event.target.name, event.target.checked);

    if (
      formik.values.agreeTerms &&
      formik.values.agreePrivacy &&
      formik.values.agreeMarketing
    ) {
      formik.setFieldValue("allChecked", true);
    } else {
      formik.setFieldValue("allChecked", false);
    }
  };

  // 모두 동의 체크박스 핸들러
  const handleAllChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    formik.setFieldValue("allChecked", checked);
    formik.setFieldValue("agreeTerms", checked);
    formik.setFieldValue("agreePrivacy", checked);
    formik.setFieldValue("agreeMarketing", checked);
  };

  // 이메일 핸들링 함수
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // 이메일 주소에 허용된 문자 및 기호 정의
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
      setEmailError(t("members.email_invalid")); // 유효하지 않은 이메일일 경우 오류 메시지 설정
    } else {
      setEmailError(null); // 유효한 이메일일 경우 오류 메시지 제거
    }

    // 허용된 문자와 기호만 남기기 (정규 표현식에 맞는 문자)
    const sanitizedValue = value.replace(/[^a-zA-Z0-9._%+-@]/g, "");
    formik.setFieldValue("email", sanitizedValue); // sanitizedValue로 필드 값 업데이트
  };

  return (
    <Wrapper>
      <SignupIntroWrapper>
        <div className="title">
          <PersonIcon className="title-icon" />
          <span>{t("AgreeContents.terms_title")}</span>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <Box marginBottom={2}>
              <StyledSubtitle>
                {t("AgreeContents.agree_terms_title")}
              </StyledSubtitle>
              <Box
                sx={{
                  maxHeight: 300,
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                  position: "relative",
                }}
              >
                <Typography variant="body2">
                  {t("AgreeContents.terms_content")}
                </Typography>
              </Box>
              <CheckBoxContainer>
                <LeftAlignedFormControlLabel
                  control={
                    <Checkbox
                      name="agreeTerms"
                      checked={formik.values.agreeTerms}
                      onChange={handleIndividualCheck}
                    />
                  }
                  label={t("AgreeContents.agree_terms")}
                />
              </CheckBoxContainer>
              {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                <FormHelperText error>
                  {formik.errors.agreeTerms}
                </FormHelperText>
              )}
            </Box>

            <Box marginBottom={2}>
              <StyledSubtitle>
                {t("AgreeContents.agree_privacy_title")}
              </StyledSubtitle>
              <Box
                sx={{
                  maxHeight: 300,
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                  position: "relative",
                }}
              >
                <Typography variant="body2">
                  {t("AgreeContents.privacy_content")}
                </Typography>
              </Box>
              <CheckBoxContainer>
                <LeftAlignedFormControlLabel
                  control={
                    <Checkbox
                      name="agreePrivacy"
                      checked={formik.values.agreePrivacy}
                      onChange={handleIndividualCheck}
                    />
                  }
                  label={t("AgreeContents.agree_privacy")}
                />
              </CheckBoxContainer>
              {formik.touched.agreePrivacy && formik.errors.agreePrivacy && (
                <FormHelperText error>
                  {formik.errors.agreePrivacy}
                </FormHelperText>
              )}
            </Box>

            <Box marginBottom={2}>
              <StyledSubtitle>
                {t("AgreeContents.agree_marketing_title")}
              </StyledSubtitle>
              <Box
                sx={{
                  maxHeight: 100,
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                  position: "relative",
                  textAlign: "left",
                }}
              >
                <Typography variant="body2">
                  {t("AgreeContents.marketing_content")}
                </Typography>
              </Box>
              <CheckBoxContainer>
                <LeftAlignedFormControlLabel
                  control={
                    <Checkbox
                      name="agreeMarketing"
                      checked={formik.values.agreeMarketing}
                      onChange={handleIndividualCheck}
                    />
                  }
                  label={t("AgreeContents.agree_marketing")}
                />
              </CheckBoxContainer>
            </Box>

            <CheckBoxContainer>
              <LeftAlignedFormControlLabel
                control={
                  <Checkbox
                    name="allChecked"
                    checked={formik.values.allChecked}
                    onChange={handleAllChecked}
                  />
                }
                label={t("AgreeContents.agree_all")}
              />
            </CheckBoxContainer>
          </FormGroup>

          {/* 이메일 인증 섹션 */}
          <Grid container spacing={2} alignItems="center" marginTop={4}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label={t("members.email")}
                value={formik.values.email}
                onChange={handleEmailChange} // 핸들링 함수 사용
                error={
                  (formik.touched.email && Boolean(formik.errors.email)) ||
                  Boolean(emailError)
                }
                helperText={
                  (formik.touched.email && formik.errors.email) || emailError
                } // 이메일 오류 메시지 표시
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                className="email-btn"
                variant="outlined"
                color="secondary"
                onClick={() => handleSendCode(formik.values.email, false)}
                disabled={isCodeSent}
              >
                {t("members.send_code")}
              </Button>
            </Grid>
            {isCodeSent && (
              <Grid
                container
                spacing={2}
                alignItems="center"
                marginTop={1}
                marginLeft={0}
              >
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    id="verificationCode"
                    name="verificationCode"
                    label={t("members.verification_code")}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    className="email-btn"
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      handleVerifyCode(formik.values.email, verificationCode)
                    }
                    disabled={isCodeVerified}
                  >
                    {t("members.verify_code")}
                  </Button>
                </Grid>
                {verificationResult && (
                  <Grid item xs={12}>
                    <Alert severity={isCodeVerified ? "success" : "error"}>
                      {verificationResult}
                    </Alert>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>

          <Button
            className="submit-btn"
            color="primary"
            variant="contained"
            type="submit"
            disabled={!isCodeVerified || !formik.isValid}
          >
            {t("members.register")}
          </Button>
        </form>
      </SignupIntroWrapper>
    </Wrapper>
  );
}

export default SignupIntro;
