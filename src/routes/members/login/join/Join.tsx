import { useTranslation } from "react-i18next";
import { Wrapper } from "../../../../styles/CommonStyles";
import { ButtonArea, LoginWrapper } from "../LoginStyle";
import PersonIcon from '@mui/icons-material/Person';
import { Button, Checkbox, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useFormik } from "formik";

function Join({ isDarkMode }: { isDarkMode: boolean }){
  const { t } = useTranslation(); //번역
  const [showPassword, setShowPassword] = useState(false); //비밀번호 상태 관리

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
      userId: "",
      password: "",
      passwordChk: "",
      userName:"",
      phone: "",
      email:"",
      notifyChk:"",
      },

    onSubmit: (form, { resetForm }) => {
      // submit 함수 (input값들을 객체로 받는다)
      console.log(JSON.stringify(form, null, 2));

    },
  });
  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <PersonIcon className="title-icon" />
          <span>{t("members.join")} </span>
        </div>
        <form className="form" onSubmit={formik.handleSubmit}>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="id">{t('members.id')}</InputLabel>
              <OutlinedInput
                id="id"
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
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="passwordChk">{t('members.password_chk')}</InputLabel>
              <OutlinedInput
                id="passwordChk"
                value={formik.values.passwordChk} 
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
                label={t('members.password_chk')}
              />
          </FormControl>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="userName">{t('members.name')}</InputLabel>
              <OutlinedInput
                id="userName"
                label={t('members.name')}
                value={formik.values.userName} 
                onChange={formik.handleChange}
              />
          </FormControl>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor="phone">{t('members.phone')}</InputLabel>
              <OutlinedInput
                id="phone"
                label={t('members.phone')}
                value={formik.values.phone} 
                onChange={formik.handleChange}
              />
          </FormControl>
          <div className="save-id">
            <FormControlLabel
              className="id-chk"
              control={
                <Checkbox
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
      </LoginWrapper>
    </Wrapper>
  );
};

export default Join;