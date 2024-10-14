import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
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
import { Wrapper } from "../../../styles/CommonStyles";
import {
  LoginWrapper,
  ButtonArea,
  StyledAnchor,
  SnsLogin,
} from "../../../styles/LoginStyle";
import { login } from "../../../apis/memberApi";
import {
  kakaoLoginHandler,
  naverLoginHandler,
} from "../../../apis/socialLoginApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Login() {
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
  const [failedAttempts, setFailedAttempts] = useState(0);

  interface LoginValues {
    userId: string;
    password: string;
    rememberLogin: boolean;
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
      rememberLogin: false,
    },
    onSubmit: async (values) => {
      try {
        const response = await login(values);

        //로그인 잠금시 로그인 시도일 경우
        if (response.lockoutTime && response.lockoutTime > 0) {
          Swal.fire({
            title: "계정 잠김",
            text: `계정이 아직 잠겨 있습니다. ${response.lockoutTime}초 후에 다시 시도해주세요.`,
            icon: "warning" as SweetAlertIcon,
            confirmButtonText: "확인",
          });

          setLockoutTimer(response.lockoutTime);
          return; // 잠금 시간이 남아 있을 경우 로그인 시도 중단
        }

        // 기존 response.token 대신 response.accessToken을 사용하여 조건 확인
        if (response.accessToken && response.refreshToken) {
          handleSaveId(values.userId, saveId);

          setUser({
            userId: response.userId,
            name: response.name,
            role: response.role,
            memberId: response.memberId,
          });

          setLoggedIn(true);

          // 로그인 성공 시 메인 페이지 또는 이전 페이지로 이동
          navigate(location.state?.from || "/main"); // 기본적으로 "/main"으로 이동
        } else {
          console.warn("엑세스 토큰이나 리프레시 토큰이 없음");
        }
      } catch (error: any) {
        // 서버에서 전달된 에러 데이터를 변수에 저장
        const serverData = error.response?.data;

        // 실패 횟수와 잠금 시간을 상태로 업데이트
        setFailedAttempts(serverData?.failedAttempts || 0);
        setLockoutTimer(serverData?.lockoutTime || 0);

        // Swal 메시지 설정
        const swalOptions = {
          title: t("alert.loginfail_title"),
          text: serverData?.message || t("alert.attempt"),
          icon: "warning" as SweetAlertIcon,
          confirmButtonText: t("alert.ok"),
        };

        const remainingTime = serverData?.lockoutTime ?? 0;

        if (error.response?.status === 403) {
          swalOptions.title = t("alert.locked_time");
        } else if (error.response?.status === 401) {
          if (serverData?.failedAttempts === 3) {
            swalOptions.text = t("alert.attempt_3");
          } else if (serverData?.failedAttempts === 4) {
            swalOptions.text = t("alert.attempt_4");
          } else if (serverData?.failedAttempts >= 5) {
            swalOptions.icon = "error";
            t("alert.contact_admin");
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
          <FormControl className="input-form" variant="outlined">
            <InputLabel htmlFor="userId">{t("members.id")}</InputLabel>
            <OutlinedInput
              id="userId"
              label={t("members.id")}
              value={formik.values.userId}
              onChange={handleUserIdChange}
            />
            {idError && <div style={{ color: "red" }}>{idError}</div>}
          </FormControl>

          <FormControl className="input-form" variant="outlined">
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

          <div className="chk-area">
            <FormControlLabel
              className="chk-form"
              control={
                <Checkbox
                  checked={saveId}
                  onChange={() => setSaveId(!saveId)} // 체크박스 상태 토글
                  color="primary"
                />
              }
              label={t("members.save_id")}
            />

            <FormControl className="chk-form" variant="outlined">
              <FormControlLabel
                id="rememberLogin"
                name="rememberLogin"
                control={<Checkbox />}
                label="자동로그인"
                value={formik.values.rememberLogin}
                onChange={formik.handleChange}
              />
            </FormControl>
          </div>

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

          {/* 로그인 버튼 아래에 남은 시간 표시 */}
          {lockoutTimer !== null && lockoutTimer > 0 && (
            <Typography color="error" sx={{ mt: 2 }}>
              {t("alert.locked_time")}{" "}
              {t("alert.try_again", {
                minutes: remainingTimeRef.current.minutes,
                seconds: formatSeconds(remainingTimeRef.current.seconds),
              })}
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
        <SnsLogin>
          <img
            src="image/kakao.png"
            alt="kakao login"
            className="kakao"
            onClick={kakaoLoginHandler}
          />
          <img
            src="image/naver.png"
            alt="naver login"
            className="naver"
            onClick={naverLoginHandler}
          />
        </SnsLogin>
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
