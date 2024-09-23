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
import { LoginWrapper, ButtonArea, StyledAnchor } from "./LoginStyle";
import { login } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from "sweetalert2";
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

  const formik = useFormik({
    initialValues: {
      userId: localStorage.getItem("userId") || "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await login(values);

        if (response.token) {
          handleSaveId(values.userId, saveId);
          setUser({
            userId: response.userId,
            name: response.name,
            role: response.role,
            memberId: response.memberId,
          });
          setLoggedIn(true);
          const from = location.state?.from || "/";
          navigate(from);
          setLoginError(null);
        }
      } catch (error: any) {
        // 서버 응답의 구조를 로그로 확인
        console.log("서버 응답 데이터:", error);
        console.log("서버 응답 데이터:", error.response?.data);

        const failedAttempts = error.response?.data?.failedAttempts ?? 0;
        const remainingTime = error.response?.data?.remainingTime ?? 0;

        console.error("로그인 에러 발생:", error); // 에러 발생 시 콘솔에 상세 정보 로그 출력
        console.log("현재 실패 횟수: ", failedAttempts); // 디버깅용

        if (error.response && error.response.status === 403) {
          // 계정 잠김 상태 처리
          setLockoutTimer(remainingTime);
          MySwal.fire({
            title: t("members.login_failed"),
            text: `${t("alert.locked")} ${remainingTime}초 남았습니다.`,
            icon: "warning",
            confirmButtonText: t("alert.ok"),
          });
        } else if (error.response && error.response.status === 401) {
          // 비밀번호 오류 처리
          if (failedAttempts === 3) {
            MySwal.fire({
              title: t("members.login_failed"),
              text: t("attempt_3"),
              icon: "warning",
              confirmButtonText: t("alert.ok"),
            });
          } else if (failedAttempts === 4) {
            MySwal.fire({
              title: t("members.login_failed"),
              text: t("attempt_4"),
              icon: "warning",
              confirmButtonText: t("alert.ok"),
            });
          } else if (failedAttempts >= 5) {
            MySwal.fire({
              title: t("members.login_failed"),
              text: t("locked"),
              icon: "error",
              confirmButtonText: t("alert.ok"),
            });
          } else {
            MySwal.fire({
              title: t("members.login_failed"),
              text: t("attempt"),
              icon: "warning",
              confirmButtonText: t("alert.ok"),
            });
          }

          if (remainingTime) {
            setLockoutTimer(remainingTime); // 남은 잠금 시간이 있으면 타이머 설정
          }
        } else {
          MySwal.fire({
            title: t("error.server_error"),
            text: error.message || t("error.unknown_error"),
            icon: "error",
            confirmButtonText: t("alert.ok"),
          });
          setLoginError(
            error.response?.data?.message || t("error.server_error")
          );
        }
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
              onChange={formik.handleChange}
            />
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
