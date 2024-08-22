import { useTranslation } from "react-i18next";
import { ButtonArea, LoginWrapper } from "./LoginStyle";
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
  Snackbar,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";
import { useFormik } from "formik";
import { Wrapper } from "../../../styles/CommonStyles";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

function Login({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [saveId, setSaveId] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null); // 로그인 오류 메시지 상태

  const navigate = useNavigate();
  const location = useLocation(); // 이전 페이지 정보

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      password: "",
    },
    onSubmit: async (form, { resetForm }) => {
      try {
        const response = await axios.post('http://localhost:8080/api/members/login', {
          userId: form.id,
          password: form.password,
        });

        if (response.data.token) {
          // JWT 토큰 저장
          localStorage.setItem('token', response.data.token);
          // 로그인 성공 시 이전 페이지로 이동
          const from = location.state?.from || '/'; // 원래 있던 페이지로 이동
          navigate(from);
          alert("로그인 성공: " + JSON.stringify(response.data));//제이슨파싱방식
          console.log("로그인 성공", response.data);//콘솔데이터
        } else {
          // 로그인 실패 처리
          setLoginError(response.data.message || 'Login failed');
          resetForm({
            values: {
              id: form.id,
              password: '', // 비밀번호 초기화
            },
          });
          alert("로그인실패"+response.data);
        }
      } catch (error) {
        console.error('로그인 오류: ', error);
        setLoginError('An unexpected error occurred');
        resetForm({
          values: {
            id: form.id,
            password: '', // 비밀번호 초기화
          },
        });
      }
    },
  });

  const handleSaveIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaveId(event.target.checked);
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleFindingId = () => {
    navigate('findId');
  };

  const handleFindingPw = () => {
    navigate('findPw');
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
            <InputLabel htmlFor="id">{t('members.id')}</InputLabel>
            <OutlinedInput
              id="id"
              label={t('members.id')}
              value={formik.values.id}
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="password">{t('members.password')}</InputLabel>
            <OutlinedInput
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label={t('members.password')}
            />
          </FormControl>
          <div className="save-id">
            <FormControlLabel
              className="id-chk"
              control={
                <Checkbox
                  checked={saveId}
                  onChange={handleSaveIdChange}
                />
              }
              label={t('members.save_id')}
            />
          </div>
          <Button
            className="submit-button"
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
          >
            {t("members.login")}
          </Button>
        </form>

        <ButtonArea>
          <button type="button"onClick={handleFindingId}>{t("members.finding_id")}</button>
          <span />
          <button type="button" onClick={handleFindingPw}>{t("members.finding_pw")}</button>
          <span />
          <button type="button" onClick={handleSignup}>{t("members.join")}</button>
        </ButtonArea>

        {/* 로그인 오류 메시지 표시 */}
        <Snackbar
          open={!!loginError}
          autoHideDuration={6000}
          onClose={() => setLoginError(null)}
        >
          <Alert onClose={() => setLoginError(null)} severity="error">
            {loginError}
          </Alert>
        </Snackbar>
      </LoginWrapper>
    </Wrapper>
  );
}

export default Login;