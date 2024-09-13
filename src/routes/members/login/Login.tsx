import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // 다국어 지원을 위한 훅 사용
import { useFormik } from "formik"; // 폼 관리 라이브러리
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
} from "@mui/material"; // Material UI 컴포넌트 사용
import { Visibility, VisibilityOff } from "@mui/icons-material"; // 비밀번호 가시성 아이콘
import { Wrapper } from "../../../styles/CommonStyles"; // 스타일 컴포넌트
import { LoginWrapper, ButtonArea, StyledAnchor } from "./LoginStyle"; // 스타일 컴포넌트
import { login } from "../api"; // 로그인 API 함수
import { useNavigate, useLocation } from "react-router-dom"; // 라우팅 관련 훅
import LockOpenIcon from "@mui/icons-material/LockOpen"; // 로그인 아이콘
import Swal from "sweetalert2"; // 알림 라이브러리
import withReactContent from "sweetalert2-react-content"; // React 컴포넌트로 Swal 사용
import Cookies from "js-cookie"; // 쿠키 관리 라이브러리
import { AuthProvider, useAuth } from "../../../auth/AuthContext";

const MySwal = withReactContent(Swal); // React 컨텐츠로 Swal 초기화

function Login({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation(); // 번역 훅
  const { setUser, setLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가시성 상태
  const [saveId, setSaveId] = useState(
    () => localStorage.getItem("saveId") === "true"
  ); // 아이디 저장 체크박스 초기 상태 설정
  const [loginError, setLoginError] = useState<string | null>(null); // 로그인 오류 메시지 상태
  const [loginAttempts, setLoginAttempts] = useState(0); // 로그인 시도 횟수
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null); // 잠금 타이머 상태
  const [lockoutMessage, setLockoutMessage] = useState<string | null>(null); // 잠금 메시지 상태
  const navigate = useNavigate(); // 페이지 이동 함수
  const location = useLocation(); // 현재 위치 정보

  const formik = useFormik({
    initialValues: {
      userId: localStorage.getItem("userId") || "", // 초기 ID 값을 로컬에서 불러오기
      password: "",
    },
    onSubmit: async (values) => {
      if (lockoutTimer && lockoutTimer > 0) {
        MySwal.fire({
          title: t("members.login_failed"),
          text: lockoutMessage || t("alert.locked"),
          icon: "warning",
          confirmButtonText: t("alert.ok"),
        });
        return;
      }
      try {
        const data = await login(values);
        if (data.token) {
          handleSaveId(values.userId, saveId);

          // 토큰 있을 경우 로그인 상태 업데이트
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
          setLockoutMessage(null);
        } else {
          throw new Error(t("members.login_failed"));
        }
      } catch (error) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        let alertMessage = t("alert.attempt");
        if (newAttempts === 3) {
          alertMessage = t("alert.attempt_3");
        } else if (newAttempts === 4) {
          alertMessage = t("alert.attempt_4");
        } else if (newAttempts >= 5) {
          setLockoutTimer(10 * 60); // 10분 동안 잠금
          alertMessage = t("alert.locked");
        }
        setLoginError(alertMessage);
        MySwal.fire({
          title: t("members.login_failed"),
          text: alertMessage,
          icon: "warning",
          confirmButtonText: t("alert.ok"),
        });
      }
    },
  });

  // 아이디 저장 상태가 변경될 때 로컬에 저장
  useEffect(() => {
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

          {lockoutMessage && (
            <Typography color="error" sx={{ mt: 2 }}>
              {lockoutMessage}
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
