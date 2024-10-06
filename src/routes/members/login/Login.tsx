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
import {
  LoginWrapper,
  ButtonArea,
  StyledAnchor,
} from "../../../styles/LoginStyle";
import { login } from "../../../apis/memberApi";
import { kakaoLoginHandler, naverLoginHandler } from "../socialLoginApi";
import { useNavigate, useLocation } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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
      console.log("로그인 페이지 트라이케치 전");
      try {
        const response = await login(values);
        console.log("로그인 성공 후 응답 확인:", response); // 응답 확인 로그

        // 기존 response.token 대신 response.accessToken을 사용하여 조건 확인
        if (response.accessToken && response.refreshToken) {
          console.log("엑세스 토큰 및 리프레시 토큰 확인됨");
          handleSaveId(values.userId, saveId);

          setUser({
            userId: response.userId,
            name: response.name,
            role: response.role,
            memberId: response.memberId,
          });

          setLoggedIn(true);

          // JWT 토큰을 쿠키에 저장
          Cookies.set("access_token", response.accessToken, {
            expires: 7, // 만료 기간 설정
            secure: true,
            sameSite: "Strict",
          });

          Cookies.set("refresh_token", response.refreshToken, {
            expires: 7, // 만료 기간 설정
            secure: true,
            sameSite: "Strict",
          });

          // 로그인 성공 시 메인 페이지 또는 이전 페이지로 이동
          navigate(location.state?.from || "/main"); // 기본적으로 "/main"으로 이동
        } else {
          console.warn("엑세스 토큰이나 리프레시 토큰이 없음");
        }
      } catch (error: unknown) {
        const e = error as ErrorResponse;
        console.log("로그인페이지 서버 응답 데이터:", e.response?.data);

        const failedAttempts = e.response?.data?.failedAttempts ?? 0;
        const remainingTime = e.response?.data?.lockoutTime ?? 0;
        const errorMessage =
          e.response?.data?.message ||
          "로그인에 실패했습니다. 계속 실패할 경우 계정이 잠길 수 있습니다.";

        const swalOptions = {
          title: "로그인 실패",
          text: errorMessage,
          icon: "warning" as SweetAlertIcon,
          confirmButtonText: "확인",
        };

        if (e.response?.status === 403) {
          swalOptions.title = "계정 잠김";
          swalOptions.text = `계정이 잠겼습니다. ${remainingTime}초 후에 다시 시도해주세요.`;
          setLockoutTimer(remainingTime); // 잠금 타이머 설정
        } else if (e.response?.status === 401) {
          if (failedAttempts === 3) {
            swalOptions.text = errorMessage;
          } else if (failedAttempts === 4) {
            swalOptions.text = "네 번 연속 로그인에 실패했습니다.";
          } else if (failedAttempts >= 5) {
            swalOptions.icon = "error";
            swalOptions.text =
              "로그인 시도가 너무 많습니다. 계정이 잠겼습니다.";
            setLockoutTimer(remainingTime); // 잠금 타이머 설정
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
        setLockoutTimer((prev) => {
          if (prev !== null && prev > 0) {
            remainingTimeRef.current = {
              minutes: Math.floor((prev - 1) / 60),
              seconds: (prev - 1) % 60,
            };
            return prev - 1;
          }
          return null;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    handleSaveId(formik.values.userId, saveId);
  }, [saveId, formik.values.userId]);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const alphanumericRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]*$/;

    if (!alphanumericRegex.test(value)) {
      setIdError(t("members.id_alphanumeric_only"));
    } else {
      setIdError(null);
    }

    const sanitizedValue = value.replace(/[^a-zA-Z0-9!@#$%^&*()_+=-]/g, "");
    formik.setFieldValue("userId", sanitizedValue);
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
              onChange={handleUserIdChange}
            />
            {idError && <div style={{ color: "red" }}>{idError}</div>}
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
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label={t("members.password")}
              disabled={!!lockoutTimer && lockoutTimer > 0} // 잠금 타이머가 있을 때 비활성화
            />
          </FormControl>

          <Button
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
            disabled={!!lockoutTimer && lockoutTimer > 0}
          >
            {t("members.login")}
          </Button>

          {/* 로그인 버튼 아래에 남은 시간 표시 */}
          {lockoutTimer !== null && lockoutTimer > 0 && (
            <Typography color="error" sx={{ mt: 2 }}>
              남은 시간: {remainingTimeRef.current.minutes}분{" "}
              {formatSeconds(remainingTimeRef.current.seconds)}초 후에 다시
              시도해주세요.
            </Typography>
          )}
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
        {/* 카카오와 네이버 로그인 버튼 */}
        <button onClick={kakaoLoginHandler}>카카오로 로그인</button>
        <button onClick={naverLoginHandler}>네이버로 로그인</button>
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
