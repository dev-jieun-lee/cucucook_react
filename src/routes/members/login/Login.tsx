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
  Alert,
  AlertColor
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import { useFormik } from "formik";
import { Wrapper } from "../../../styles/CommonStyles";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import { login } from "../api";
import SnackbarCustom from "../../../components/SnackbarCustom";
import { useAuth } from "../../../auth/AuthContext";


function Login({ isDarkMode }: { isDarkMode: boolean }) {
  const { setUser, setLoggedIn } = useAuth(); //로그인 상태관리리
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); //스낵바
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error'); // 스낵바 색깔, 기본은 'error'

  const [saveId, setSaveId] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null); // 로그인 오류 메시지 상태

  const navigate = useNavigate();
  const location = useLocation(); // 이전 페이지 정보

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      if (data) {
        console.log(data);
        
        //auth 데이터 전달
        setUser({ id: data.userId, name: data.name });
        // 로그인 성공 시 이전 페이지로 이동
        const from = location.state?.from || '/';
        navigate(from);
      } else {
        // 로그인 실패 처리
        setLoginError(data || '로그인 실패');
        setSnackbarSeverity('error'); // 실패 시 빨간색
        setSnackbarOpen(true); // 스낵바 열기
      }
    },
    onError: (error) => {
      console.error('로그인 오류: ', error);
      setLoginError('정확한 값을 입력해주세요.');
      setSnackbarSeverity('error'); // 에러 시 빨간색
      setSnackbarOpen(true); // 스낵바 열기
    }
  });

  const formik = useFormik({
    initialValues: {
      userId: '',
      password: '',
    },
    onSubmit: (values, { resetForm }) => {
      mutation.mutate(values, {
        
        onSettled: () => {
          console.log(values);
          // 비밀번호 초기화
          resetForm({
            values: {
              userId: values.userId,
              password: '',
            },
          });
        }
      });
    },
    
  });


  //스낵바 닫기
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const handleSaveIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaveId(event.target.checked);
  };

  const handleSignup = () => {
    navigate('/signup/intro');
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
            <InputLabel htmlFor="userId">{t('members.id')}</InputLabel>
            <OutlinedInput
              id="userId"
              label={t('members.id')}
              value={formik.values.userId}
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
          <button type="button">{t("members.finding_id")}</button>
          <span />
          <button type="button">{t("members.finding_pw")}</button>
          <span />
          <button type="button" onClick={handleSignup}>{t("members.join")}</button>
        </ButtonArea>

        {/* 로그인 오류 메시지 표시 */}
        {/* 스낵바 컴포넌트 */}
        <SnackbarCustom
          open={snackbarOpen}
          message={loginError || ''}
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        />
      </LoginWrapper>
    </Wrapper>
  );
}

export default Login;
