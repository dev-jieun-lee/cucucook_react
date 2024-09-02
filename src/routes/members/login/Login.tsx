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
import { login, increaseFailedAttempts } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { setCookie, getCookie, eraseCookie } from "../../../utils/cookies"; // 쿠키 유틸리티 함수

const MySwal = withReactContent(Swal);

function Login({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [saveId, setSaveId] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);
  const [lockoutMessage, setLockoutMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedId = getCookie("saveId") === "true"; // 쿠키에서 저장된 값 읽기
    setSaveId(savedId);
  }, []);

  useEffect(() => {
    if (saveId) {
      setCookie("saveId", "true", 7); // 7일 동안 저장
    } else {
      eraseCookie("saveId"); // 체크 해제 시 쿠키 삭제
    }
  }, [saveId]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (lockoutTimer && lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            setLockoutMessage(null); // 타이머가 끝났을 때 메시지 초기화
            console.log("타이머 종료");
            return null;
          }
          console.log("타이머 감소: ", prev);
          return prev - 1;
        });
      }, 1000); // 1초마다 감소
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [lockoutTimer]);

  useEffect(() => {
    if (lockoutTimer !== null && lockoutTimer > 0) {
      // 남은 시간 계산
      const minutes = Math.floor(lockoutTimer / 60);
      const seconds = lockoutTimer % 60;

      // 메시지 구성
      const timeMessage =
        t("alert.locked", { minutes, seconds }) + " " + t("alert.try_again");
      setLockoutMessage(timeMessage); // 메시지 상태 업데이트
      console.log("타이머 메시지 업데이트: ", timeMessage);
    } else {
      setLockoutMessage(null);
    }
  }, [lockoutTimer, t]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 영어와 숫자만 허용
    const value = event.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
    formik.setFieldValue("userId", filteredValue);
  };

  const formik = useFormik({
    initialValues: {
      userId: "",
      password: "",
    },
    onSubmit: async (values, { resetForm }) => {
      if (lockoutTimer && lockoutTimer > 0) {
        // 잠금 상태일 경우
        setLoginError(lockoutMessage || ""); // null일 경우 빈 문자열로 설정
        MySwal.fire({
          title: t("members.login_failed"),
          text: lockoutMessage || "", // null일 경우 빈 문자열로 설정
          icon: "warning",
          confirmButtonText: t("alert.ok"),
        });
        console.log("로그인 실패 - 잠금 상태");
        return;
      }

      try {
        const data = await login(values);
        if (data.token) {
          localStorage.setItem("token", data.token);
          const from = location.state?.from || "/";
          navigate(from);
          setLoginAttempts(0); // 성공 시 실패 횟수 초기화
          setLockoutMessage(null); // 로그인 성공 시 메시지 초기화
          console.log("로그인 성공");
        } else {
          throw new Error("로그인 실패");
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
          setLockoutTimer(10 * 60); // 10분을 초 단위로 설정
          alertMessage = t("alert.locked");
        }

        increaseFailedAttempts(values.userId); // 실패 횟수 증가 API 호출
        console.error("로그인 오류: ", error);

        MySwal.fire({
          title: t("members.login_failed"),
          text: alertMessage,
          icon: "warning",
          confirmButtonText: t("alert.ok"),
        });

        setLoginError(alertMessage);
        console.log("로그인 실패 - 시도 횟수: ", newAttempts);
      }
    },
  });

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
              onChange={handleInputChange} // 필터링된 입력값을 설정
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
                    onClick={() => setShowPassword((show) => !show)}
                    onMouseDown={(event) => event.preventDefault()}
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
              className="id-chk"
              control={
                <Checkbox
                  checked={saveId}
                  onChange={(event) => setSaveId(event.target.checked)}
                />
              }
              label={t("members.save_id")}
            />
          </div>

          {/* 잠금 안내 문구 추가 */}
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
            disabled={!!lockoutTimer && lockoutTimer > 0} // 잠금 상태에서 버튼 비활성화
          >
            {t("members.login")}
          </Button>
        </form>

        <ButtonArea>
          <StyledAnchor onClick={() => navigate("/login/findId")}>
            {t("members.finding_id") + "     "}
          </StyledAnchor>
          |
          <StyledAnchor onClick={() => navigate("/login/findPw")}>
            {"     " + t("members.finding_pw") + "     "}
          </StyledAnchor>
          |
          <StyledAnchor onClick={() => navigate("/signup/intro")}>
            {"     " + t("members.join")}
          </StyledAnchor>
        </ButtonArea>
      </LoginWrapper>
    </Wrapper>
  );
}

export default Login;
