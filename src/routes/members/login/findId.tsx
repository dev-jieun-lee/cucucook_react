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
  FormHelperText,
  InputAdornment,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useFormik } from "formik";
import { Wrapper } from "../../../styles/CommonStyles";
import { LoginWrapper, ResultBox } from "./LoginStyle";
import { useMutation } from "react-query";
import { useSendVerificationCode, useVerifyCode, findId } from "../api";

// 한글 자모로 변환하는 함수
const convertToHangul = (input: string) => {
  const jamo = /[\u3131-\u3163\uac00-\ud7a3]/; // 자음 및 모음 유니코드 범위
  return input
    .split("")
    .filter((char) => jamo.test(char))
    .join("");
};

function FindId({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [verificationTimeout, setVerificationTimeout] = useState<number | null>(
    null
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [foundId, setFoundId] = useState<string | null>(null);
  const [showVerificationBox, setShowVerificationBox] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [noMemberInfo, setNoMemberInfo] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // 추가된 상태 관리 함수들
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "success">(
    "error"
  );
  const [signupError, setSignupError] = useState<string | null>(null);

  // 인증 코드 전송 mutation
  const sendVerificationCodeMutation = useSendVerificationCode();

  // 인증 코드 검증 mutation
  const verifyCodeMutation = useVerifyCode();

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      verificationCode: "",
      carrier: "SKT", // 통신사 기본값 설정
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.name) errors.name = t("members.name_required");
      if (!values.phone) errors.phone = t("members.phone_number_required");
      if (showVerificationBox && !values.verificationCode)
        errors.verificationCode = t("members.verification_code_required");
      return errors;
    },
    onSubmit: (values) => {},
  });

  const findIdMutation = useMutation(
    () =>
      findId({
        name: formik.values.name,
        phone: formik.values.phone,
        verificationCode: formik.values.verificationCode,
      }),
    {
      onSuccess: (data) => {
        console.log("응답값: 아이디 찾기 성공", data);
        if (data.foundId) {
          setFoundId(data.foundId);
          setNoMemberInfo(false);
        } else {
          console.error("응답값: 아이디 찾기 실패 - 정보 없음", data);
          setFoundId(null);
          setNoMemberInfo(true);
        }
        setShowResult(true);
      },
      onError: (error: Error) => {
        console.error("응답값: 아이디 찾기 실패", error.message);
        setLoginError(t("members.find_id_error"));
      },
    }
  );

  const handleVerifyClick = async () => {
    if (!formik.values.phone) return;

    sendVerificationCodeMutation.mutate(
      {
        phone: formik.values.phone,
        carrier: formik.values.carrier, // 통신사 값을 서버로 전송
      },
      {
        onSuccess: () => {
          setShowVerificationBox(true);
          setVerificationTimeout(Date.now() + 60000);
          setTimer(60);
        },
        onError: (error) => {
          console.error("Failed to send verification code:", error);
          setLoginError("Failed to send verification code");
          setSnackbarOpen(true);
          setSnackbarSeverity("error");
          setSignupError(t("members.verification_error"));
        },
      }
    );
  };

  const handleConfirmClick = async () => {
    if (!formik.values.verificationCode) return;

    verifyCodeMutation.mutate(
      {
        phoneNumber: formik.values.phone,
        code: formik.values.verificationCode,
      },
      {
        onSuccess: (data) => {
          console.log("응답값: 인증 성공", data);
          alert("인증되었습니다"); // 인증 성공 메시지
          setVerificationComplete(true);
        },
        onError: (error) => {
          console.error("Failed to verify code:", error);
          setLoginError("Failed to verify code");
        },
      }
    );
  };

  // 타이머 처리 로직
  useEffect(() => {
    if (verificationTimeout) {
      const interval = setInterval(() => {
        if (Date.now() > verificationTimeout) {
          clearInterval(interval);
          setVerificationTimeout(null);
          setTimer(0);
        } else {
          setTimer(
            Math.max(0, Math.floor((verificationTimeout - Date.now()) / 1000))
          );
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [verificationTimeout]);

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    formik.setFieldValue("phone", value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filteredValue = convertToHangul(value);
    formik.setFieldValue("name", filteredValue);
  };

  const handleCarrierChange = (event: SelectChangeEvent<string>) => {
    formik.setFieldValue("carrier", event.target.value);
  };

  const handleVerificationCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    formik.setFieldValue("verificationCode", value);
  };

  const handleFindIdClick = () => {
    if (verificationComplete) {
      findIdMutation.mutate();
    } else {
      console.error("오류: 인증이 완료되지 않음");
      setLoginError(t("members.verify_first"));
    }
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <Typography variant="h6">{t("members.find_id")}</Typography>
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
              onChange={handleNameChange}
              inputProps={{ maxLength: 50 }}
            />
            {formik.errors.name && (
              <FormHelperText error>{formik.errors.name}</FormHelperText>
            )}
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FormControl
              className="input-form"
              sx={{ m: 1, flexGrow: 1 }}
              variant="outlined"
              error={!!formik.errors.phone}
            >
              <InputLabel htmlFor="phone">
                {t("members.phone_number")}
              </InputLabel>
              <OutlinedInput
                id="phone"
                label={t("members.phone_number")}
                value={formik.values.phone}
                onChange={handlePhoneNumberChange}
                inputProps={{ maxLength: 15 }}
              />
              {formik.errors.phone && (
                <FormHelperText error>{formik.errors.phone}</FormHelperText>
              )}
            </FormControl>

            {/* 통신사 선택 */}
            <FormControl
              sx={{ m: 1, flexGrow: 1 }}
              variant="outlined"
              error={!!formik.errors.carrier}
            >
              <InputLabel id="carrier-select-label">통신사</InputLabel>
              <Select
                labelId="carrier-select-label"
                id="carrier"
                value={formik.values.carrier}
                onChange={handleCarrierChange}
                label="통신사"
              >
                <MenuItem value="SKT">SKT</MenuItem>
                <MenuItem value="KT">KT</MenuItem>
                <MenuItem value="LGU">LG U+</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              sx={{ flexShrink: 0 }}
              onClick={handleVerifyClick}
            >
              {t("members.verify")}
            </Button>
          </Box>

          {showVerificationBox && (
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
                    label={t("members.verification_code")}
                    value={formik.values.verificationCode}
                    onChange={handleVerificationCodeChange}
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
                  onClick={handleConfirmClick}
                >
                  {t("alert.confirmed")}
                </Button>
              </Box>
            </>
          )}

          <Button
            className="submit-button"
            color="primary"
            variant="contained"
            type="button"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleFindIdClick}
            disabled={findIdMutation.isLoading}
          >
            {t("members.find_id")}
          </Button>
        </form>

        {/* QR 코드로 인증하기 버튼 */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => (window.location.href = "/qr-verification")}
          >
            QR 코드로 인증하기
          </Button>
        </Box>

        {/* 결과 및 알림 처리 */}
        {showResult && (
          <ResultBox>
            {foundId && !noMemberInfo && (
              <Typography variant="body1" color="text.primary">
                {t("members.found_id_message", { id: foundId })}
              </Typography>
            )}
            {noMemberInfo && (
              <Typography variant="body1" color="text.primary">
                {t("members.no_member_info")}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: "8px", mt: 2 }}>
              {foundId && !noMemberInfo && (
                <>
                  <Button variant="contained" color="primary" href="/login">
                    {t("members.login")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`/login/FindPw?id=${encodeURIComponent(foundId)}`}
                  >
                    {t("members.find_pw")}
                  </Button>
                </>
              )}
              {noMemberInfo && (
                <Button variant="contained" color="primary" href="/signup">
                  {t("members.join")}
                </Button>
              )}
            </Box>
          </ResultBox>
        )}

        <Snackbar
          open={!!loginError || !!signupError}
          autoHideDuration={6000}
          onClose={() => {
            setLoginError(null);
            setSignupError(null);
          }}
        >
          <Alert
            onClose={() => {
              setLoginError(null);
              setSignupError(null);
            }}
            severity={snackbarSeverity}
          >
            {loginError || signupError}
          </Alert>
        </Snackbar>
      </LoginWrapper>
    </Wrapper>
  );
}

export default FindId;
