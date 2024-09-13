import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
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
import { AxiosError } from "axios";
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
  const [loginAttempts, setLoginAttempts] = useState(0);
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
      if (lockoutTimer && lockoutTimer > 0) {
        MySwal.fire({
          title: t("members.login_failed"),
          text: t("locked"), // 'locked' 메시지만 출력
          icon: "warning",
          confirmButtonText: t("alert.ok"),
        });

        return;
      }

      try {
        const data = await login(values);
        if (data && data.token) {
          handleSaveId(values.userId, saveId);
          setUser({
            userId: data.userId,
            name: data.name,
            role: data.role,
            memberId: data.memberId,
          });
          setLoggedIn(true);

          const from = location.state?.from || "/";
          navigate(from);
          setLoginAttempts(0);
        } else {
          throw new Error(t("members.login_failed"));
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status >= 500) {
          MySwal.fire({
            title: t("error.server_error"),
            text: t("alert.server_error"),
            icon: "error",
            confirmButtonText: t("alert.ok"),
          });
        } else {
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);

          let alertMessage = t("alert.attempt");
          if (newAttempts === 3) {
            alertMessage = t("alert.attempt_3");
          } else if (newAttempts === 4) {
            alertMessage = t("alert.attempt_4");
          } else if (newAttempts >= 5) {
            const lockoutDuration = 10 * 60; // 10분
            setLockoutTimer(lockoutDuration);
            remainingTimeRef.current = {
              minutes: Math.floor(lockoutDuration / 60),
              seconds: lockoutDuration % 60,
            };
            alertMessage = t("alert.locked_time");
          }

          setLoginError(alertMessage);
          MySwal.fire({
            title: t("members.login_failed"),
            text: alertMessage,
            icon: "warning",
            confirmButtonText: t("alert.ok"),
          });
        }
      }
    },
  });

  // 타이머 줄이기 및 로그인 페이지 업데이트
  useEffect(() => {
    if (lockoutTimer && lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) =>
          prev !== null && prev > 0 ? prev - 1 : null
        );

        // 남은 시간을 Ref로 업데이트, 두 자릿수로 표시
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

  // UI에서 두 자릿수로 포맷된 초를 표시
  const formatSeconds = (seconds: number) =>
    seconds < 10 ? `0${seconds}` : seconds;

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

          <div className="save-id">
            <FormControlLabel
              control={
                <Checkbox
                  checked={saveId}
                  onChange={(e) => setSaveId(e.target.checked)}
                />
              }
              label={t("members.save_id")}
            />
          </div>

          {/* 로그인 버튼 위에 남은 시간 안내 표시 */}
          {lockoutTimer && lockoutTimer > 0 && (
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
          |
          <StyledAnchor to="/login/findPw">
            {t("members.finding_pw")}
          </StyledAnchor>
          |<StyledAnchor to="/signup/intro">{t("members.join")}</StyledAnchor>
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
