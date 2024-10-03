import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Wrapper } from "../../../styles/CommonStyles";
import { LoginWrapper, ButtonArea, StyledAnchor } from "../../../styles/LoginStyle";
import { login } from "../../../apis/memberApi";
import { useNavigate, useLocation } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "js-cookie";
import { useAuth } from "../../../auth/AuthContext";

const MySwal = withReactContent(Swal);

type LoginProps = {
  isDarkMode: boolean;
};

function Login({ isDarkMode }: LoginProps) {
  const { t } = useTranslation();
  const { setUser, setLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [saveId, setSaveId] = useState(
    () => localStorage.getItem("saveId") === "true"
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);
  const remainingTimeRef = useRef<{ minutes: number; seconds: number }>({
    minutes: 0,
    seconds: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const initialRender = useRef(true);
  const [idError, setIdError] = useState<string | null>(null); // idError 상태 변수 정의
  interface LoginValues {
    userId: string;
    password: string;
  }

  interface ErrorResponse {
    response: {
      data: {
        failedAttempts?: number;
        lockoutTime?: number;
        message?: string;
      };
      status: number;
    };
  }
  const formik = useFormik<LoginValues>({
    initialValues: {
      userId: localStorage.getItem("userId") || "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await login(values);
        if (response.token) {
          handleSaveId(
            values.userId,
            localStorage.getItem("saveId") === "true"
          );
          setUser({
            userId: response.userId,
            name: response.name,
            role: response.role,
            memberId: response.memberId,
          });
          setLoggedIn(true);
          navigate(location.state?.from || "/");
        }
      } catch (error: unknown) {
        const e = error as ErrorResponse;
        console.log("서버 응답 데이터:", e.response?.data);

        const failedAttempts = e.response?.data?.failedAttempts ?? 0;
        const remainingTime = e.response?.data?.lockoutTime ?? 0;
        const errorMessage =
          e.response?.data?.message ||
          "세 번 연속 로그인에 실패했습니다. 계속 실패할 경우 계정이 잠길 수 있습니다.";

        const swalOptions = {
          title: "로그인 실패",
          text: errorMessage,
          icon: "warning" as SweetAlertIcon, // 'warning', 'error', 'success', 'info', 'question'
          confirmButtonText: "확인",
        };

        if (e.response?.status === 403) {
          swalOptions.title = "계정 잠김";
          swalOptions.text = `계정이 잠겼습니다. ${remainingTime}초 후에 다시 시도해주세요.`;
        } else if (e.response?.status === 401) {
          if (failedAttempts === 3) {
            swalOptions.text = errorMessage; // 특정 실패 횟수에 따라 메시지 조정
          } else if (failedAttempts === 4) {
            swalOptions.text = "네 번 연속 로그인에 실패했습니다.";
          } else if (failedAttempts >= 5) {
            swalOptions.icon = "error";
            swalOptions.text =
              "로그인 시도가 너무 많습니다. 계정이 잠겼습니다.";
          }
        }

        Swal.fire(swalOptions);
      }
    },
  });

  // 남은 시간을 두 자릿수로 포맷팅하는 함수
  const formatSeconds = (seconds: number) =>
    seconds < 10 ? `0${seconds}` : seconds;

  // 타이머 감소 및 남은 시간 업데이트
  useEffect(() => {
    if (lockoutTimer && lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) =>
          prev !== null && prev > 0 ? prev - 1 : null
        );
        remainingTimeRef.current = {
          minutes: Math.floor(lockoutTimer! / 60),
          seconds: lockoutTimer! % 60,
        };
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  // 아이디 저장 상태 변경 처리
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    handleSaveId(formik.values.userId, saveId);
  }, [saveId, formik.values.userId]);

  // 입력값 핸들링 함수
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const alphanumericRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]*$/; // 허용할 문자 정의

    if (!alphanumericRegex.test(value)) {
      setIdError(t("members.id_alphanumeric_only")); // 비알파벳 문자가 있을 경우 오류 메시지 설정
    } else {
      setIdError(null); // 입력이 유효할 경우 오류 메시지 제거
    }

    // 유효하지 않은 문자 제거
    const sanitizedValue = value.replace(/[^a-zA-Z0-9!@#$%^&*()_+=-]/g, ""); // 허용된 문자만 남기기
    formik.setFieldValue("userId", sanitizedValue); // sanitizedValue로 필드 값 업데이트
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <LockOpenIcon className="title-icon" />
          <span>{t("members.login")}</span>
        </div>

        <form className="form" onSubmit={formik.handleSubmit}>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="userId">{t("members.id")}</InputLabel>
            <OutlinedInput
              id="userId"
              label={t("members.id")}
              value={formik.values.userId}
              onChange={handleUserIdChange} // 핸들링 함수 사용
            />
            {idError && <div style={{ color: "red" }}>{idError}</div>}{" "}
            {/* 오류 메시지 표시 */}
          </FormControl>

          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="password">{t("members.password")}</InputLabel>
            <OutlinedInput
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label={t("members.password")}
            />
          </FormControl>

          {lockoutTimer && (
            <Typography color="error" sx={{ mb: 2 }}>
              {t("alert.locked_time")}{" "}
              {t("alert.try_again", {
                minutes: remainingTimeRef.current.minutes,
                seconds: formatSeconds(remainingTimeRef.current.seconds),
              })}
            </Typography>
          )}

          <Button
            className="submit-button"
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
            disabled={!!lockoutTimer && lockoutTimer > 0}
          >
            {t("members.login")}
          </Button>
        </form>

        <ButtonArea>
          <StyledAnchor to="/login/findId">
            {t("members.finding_id")}
          </StyledAnchor>
          <span />
          <StyledAnchor to="/login/findPw">
            {t("members.finding_pw")}
          </StyledAnchor>
          <span />
          <StyledAnchor to="/signup/intro">{t("members.join")}</StyledAnchor>
        </ButtonArea>
        <button onClick={() => (window.location.href = "/auth/kakao")}>
          카카오로 로그인
        </button>
      </LoginWrapper>
    </Wrapper>
  );
}

export default Login;

function handleSaveId(userId: string, saveId: boolean) {
  if (saveId) {
    localStorage.setItem("userId", userId);
    localStorage.setItem("saveId", "true");
  } else {
    localStorage.removeItem("userId");
    localStorage.removeItem("saveId");
  }
}
function setIdError(arg0: string) {
  throw new Error("Function not implemented.");
}
