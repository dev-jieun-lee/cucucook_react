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
import Cookies from "js-cookie";

const MySwal = withReactContent(Swal);

// 쿠키 저장 및 삭제 처리 함수
const handleCookies = (userId: string, saveId: boolean) => {
  if (saveId) {
    Cookies.set("userId", userId, { expires: 7 }); // 아이디 저장
    Cookies.set("saveId", "true", { expires: 7 }); // 체크박스 상태 저장
  } else {
    Cookies.remove("userId"); // 아이디 삭제
    Cookies.remove("saveId"); // 체크박스 상태 삭제
  }
};

function Login({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation(); // 번역 훅
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 상태
  const [saveId, setSaveId] = useState(false); // 아이디 저장 체크박스 상태
  const [loginError, setLoginError] = useState<string | null>(null); // 로그인 오류 메시지
  const [loginAttempts, setLoginAttempts] = useState(0); // 로그인 시도 횟수
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null); // 잠금 타이머
  const [lockoutMessage, setLockoutMessage] = useState<string | null>(null); // 잠금 메시지
  const navigate = useNavigate(); // 페이지 이동 훅
  const location = useLocation(); // 현재 위치 훅

  const formik = useFormik({
    initialValues: {
      userId: "",
      password: "",
    },
    onSubmit: async (values, { resetForm }) => {
      if (lockoutTimer && lockoutTimer > 0) {
        // 잠금 상태일 경우
        setLoginError(lockoutMessage || ""); // 잠금 메시지 설정
        MySwal.fire({
          title: t("members.login_failed"),
          text: lockoutMessage || "", // 잠금 메시지
          icon: "warning",
          confirmButtonText: t("alert.ok"),
        });
        console.log("로그인 실패 - 잠금 상태");
        return;
      }

      try {
        const data = await login(values); // 로그인 API 호출
        if (data.token) {
          // 로그인 성공 시
          handleCookies(values.userId, saveId); // 쿠키 설정
          const from = location.state?.from || "/"; // 이전 페이지로 이동
          navigate(from);
          setLoginAttempts(0); // 로그인 성공 시 실패 횟수 초기화
          setLockoutMessage(null); // 메시지 초기화
          console.log("로그인 성공");
        } else {
          throw new Error("로그인 실패"); // 로그인 실패
        }
      } catch (error) {
        const newAttempts = loginAttempts + 1; // 로그인 시도 횟수 증가
        setLoginAttempts(newAttempts);

        let alertMessage = t("alert.attempt");

        if (newAttempts === 3) {
          alertMessage = t("alert.attempt_3");
        } else if (newAttempts === 4) {
          alertMessage = t("alert.attempt_4");
        } else if (newAttempts >= 5) {
          setLockoutTimer(10 * 60); // 10분 잠금
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

        setLoginError(alertMessage); // 로그인 오류 메시지 설정
        console.log("로그인 실패 - 시도 횟수: ", newAttempts);
      }
    },
  });

  // 로그인 시 저장된 아이디 및 체크박스 상태 불러오기
  useEffect(() => {
    const savedId = Cookies.get("userId") || ""; // 저장된 아이디 읽기
    const shouldSaveId = Cookies.get("saveId") === "true"; // 체크박스 상태 읽기
    setSaveId(shouldSaveId);
    if (savedId && shouldSaveId) {
      formik.setFieldValue("userId", savedId); // 저장된 아이디를 폼에 설정
    }
  }, [formik]);

  // 체크박스 상태에 따라 쿠키 저장 및 삭제
  useEffect(() => {
    // 상태가 변할 때만 쿠키를 업데이트하도록 설정
    handleCookies(formik.values.userId, saveId);
  }, [saveId]); // saveId가 변경될 때만 실행

  // 잠금 타이머 처리
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (lockoutTimer && lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            setLockoutMessage(null); // 타이머 종료 시 메시지 초기화
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
        clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
      }
    };
  }, [lockoutTimer]);

  // 잠금 타이머에 따른 메시지 업데이트
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
      setLockoutMessage(null); // 타이머가 없으면 메시지 초기화
    }
  }, [lockoutTimer, t]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 영어와 숫자만 허용
    const value = event.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
    formik.setFieldValue("userId", filteredValue); // 필터링된 값 설정
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
                  onChange={(event) => {
                    // 체크박스 상태가 변경되면, 상태를 업데이트하고 쿠키도 변경함
                    const newSaveId = event.target.checked;
                    setSaveId(newSaveId);
                    handleCookies(formik.values.userId, newSaveId);
                  }}
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
          <StyledAnchor to="/login/findId">
            {t("members.finding_id") + "     "}
          </StyledAnchor>
          |
          <StyledAnchor to="/login/findPw">
            {"     " + t("members.finding_pw") + "     "}
          </StyledAnchor>
          |
          <StyledAnchor to="/signup/intro">
            {"     " + t("members.join")}
          </StyledAnchor>
        </ButtonArea>
      </LoginWrapper>
    </Wrapper>
  );
}

export default Login;
