import React, { useState, useEffect } from "react";
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

const MySwal = withReactContent(Swal);

function Login({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [saveId, setSaveId] = useState(
    () => localStorage.getItem("saveId") === "true"
  );
  const [loginAttempts, setLoginAttempts] = useState(
    () => Number(localStorage.getItem("loginAttempts")) || 0
  );
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(
    () => Number(localStorage.getItem("lockoutTimer")) || null
  );
  const [lockoutMessage, setLockoutMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      userId: localStorage.getItem("userId") || "",
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

          // 로그인 성공 시 초기화
          localStorage.removeItem(`loginAttempts_${values.userId}`);
          setLoginAttempts(0);
          setLockoutMessage(null);
          setLockoutTimer(null);

          const from = location.state?.from || "/";
          navigate(from);
        } else {
          throw new Error(t("members.login_failed"));
        }
      } catch (error) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem("loginAttempts", newAttempts.toString());

        let alertMessage = t("alert.attempt");

        if (newAttempts === 3) {
          alertMessage = t("alert.attempt_3");
        } else if (newAttempts === 4) {
          alertMessage = t("alert.attempt_4");
        } else if (newAttempts >= 5) {
          const lockoutDuration = 10 * 60; // 10분 잠금
          setLockoutTimer(lockoutDuration);
          localStorage.setItem("lockoutTimer", lockoutDuration.toString());
          alertMessage = t("alert.locked", { minutes: 10, seconds: 0 });
        }

        setLockoutMessage(alertMessage);
        MySwal.fire({
          title: t("members.login_failed"),
          text: alertMessage,
          icon: "warning",
          confirmButtonText: t("alert.ok"),
        });
      }
    },
  });

  // 타이머 설정 및 업데이트
  useEffect(() => {
    if (lockoutTimer && lockoutTimer > 0) {
      const timer = setInterval(() => {
        setLockoutTimer((prevTimer) => {
          if (prevTimer && prevTimer > 0) {
            const newTime = prevTimer - 1;
            localStorage.setItem("lockoutTimer", newTime.toString());

            const minutes = Math.floor(newTime / 60);
            const seconds = newTime % 60;

            setLockoutMessage(
              t("alert.locked", { minutes, seconds }) + t("alert.try_again")
            );

            return newTime;
          } else {
            localStorage.removeItem("lockoutTimer");
            setLockoutMessage(null);
            return null;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutTimer, t]);

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
