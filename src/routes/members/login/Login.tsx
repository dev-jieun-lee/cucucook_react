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
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";
import { useFormik } from "formik";
import { Wrapper } from "../../../styles/CommonStyles";

function Login({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation(); //번역
  const [showPassword, setShowPassword] = React.useState(false); //비밀번호 상태 관리
  const [saveId, setSaveId] = React.useState(false); // 체크박스 상태 관리

  //비밀번호 토글
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      // 각 input의 초기값
      id: "",
      password: "",
    },
    onSubmit: (form, { resetForm }) => {
      // submit 함수 (input값들을 객체로 받는다)
      console.log(JSON.stringify(form, null, 2));
      // saveId가 false일 경우 id 값을 초기화

      if (!saveId) {
        resetForm({
          values: {
            id: '',
            password: '',
          },
        });
      } else {
        // saveId가 true일 경우 password만 초기화
        resetForm({
          values: {
            id: form.id,
            password: '',
          },
        });
      }
    },
  });

  //아이디 저장
  const handleSaveIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaveId(event.target.checked);
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <LockOpenIcon className="title-icon" />
          <span>{t("members.login")} </span>
        </div>

        <form className="form" onSubmit={formik.handleSubmit}>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="id">{t('members.id')}</InputLabel>
              <OutlinedInput
                id="id"
                label={t('members.id')}
                value={formik.values.id} // formik의 id 값
                onChange={formik.handleChange} // formik의 handleChange 연결
              />
          </FormControl>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="password">{t('members.password')}</InputLabel>
              <OutlinedInput
                id="password"
                value={formik.values.password} // formik의 password 값
                onChange={formik.handleChange} // formik의 handleChange 연결
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
          <button type="button">{t("members.join")}</button>
        </ButtonArea>
      </LoginWrapper>
    </Wrapper>
  );
}

export default Login;
