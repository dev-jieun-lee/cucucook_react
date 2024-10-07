import { useTranslation } from "react-i18next";
import { TitleCenter, Wrapper } from "../../styles/CommonStyles";
import { PwChangeArea, UserInfoForm } from "../../styles/MypageStyle";
import { Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { LoginWrapper } from "../../styles/LoginStyle";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { changePasswordByUser } from "../../apis/mypageApi";
import Swal from "sweetalert2";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { BoardButtonArea } from "../../styles/BoardStyle";
import { useNavigate } from "react-router-dom";


function PwChange(){
  const { t } = useTranslation();
  const { user } = useAuth();
  const memberId = user ? user.memberId.toString() : null;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      newPassword: "",
      confirmNewPassword: ""
    },
    validate: (values) => {
      const errors: { newPassword?: string; confirmNewPassword?: string } = {};
      if (!values.newPassword) {
        errors.newPassword = t("mypage.password_mismatch");
      }
      if (!values.confirmNewPassword) {
        errors.confirmNewPassword = t("mypage.password_mismatch");
      } else if (values.newPassword !== values.confirmNewPassword) {
        errors.confirmNewPassword = t("mypage.password_mismatch");
      }
      return errors;
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      mutation.mutate(values as any); // mutation 실행
    },
  });

  const mutation = useMutation(
    (values: any) =>
      changePasswordByUser(memberId!, values.newPassword),
    {
      onSuccess: (data) => {
        Swal.fire({
          icon: "success",
          title: t("text.save"),
          text: t("menu.board.alert.save"),
          showConfirmButton: true,
          confirmButtonText: t("text.check"),
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      },
      onError: (error) => {
        Swal.fire({
          title: t("mypage.update_failed"),
          icon: "error",
          confirmButtonText: t("alert.ok"),
        });
      },
    }
  );

  const handleSaveChangesClick = async () => {
    const confirmSave = await Swal.fire({
      title: t("mypage.save_changes"),
      text: t("mypage.save_changes_confirm"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("alert.yes"),
      cancelButtonText: t("alert.no"),
    });

    if (confirmSave.isConfirmed) {
      formik.handleSubmit();
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return(
    <Wrapper>
      <TitleCenter>{t("mypage.change_password")}</TitleCenter>
      <LoginWrapper>
        <UserInfoForm onSubmit={formik.handleSubmit}>
          <FormControl
            className="input-form"
          >
            <InputLabel htmlFor="newPassword">
              {t("mypage.new_password")}
            </InputLabel>
            <OutlinedInput
              id="newPassword"
              label={t("mypage.new_password")}
              type={showPassword ? "text" : "password"}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              name="newPassword"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.errors.newPassword && (
              <FormHelperText error>{formik.errors.newPassword}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            className="input-form"
          >
            <InputLabel htmlFor="confirmNewPassword">
              {t("mypage.confirm_new_password")}
            </InputLabel>
            <OutlinedInput
              id="confirmNewPassword"
              label={t("mypage.confirm_new_password")}
              type={showPassword ? "text" : "password"}
              value={formik.values.confirmNewPassword}
              onChange={formik.handleChange}
              name="confirmNewPassword"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.errors.confirmNewPassword && (
              <FormHelperText error>{formik.errors.confirmNewPassword}</FormHelperText>
            )}
          </FormControl>
          <BoardButtonArea style={{marginTop :  '25px'}}>
            <Button
              className="cancel-btn"
              type="button"
              variant="outlined"
              color="warning"
              onClick={() => navigate(-1)}
            >
              {t("text.cancel")}
            </Button>
            <Button
              className="save-btn"
              type="submit"
              variant="contained"
              onClick={handleSaveChangesClick}
              disabled={!!formik.errors.confirmNewPassword || !formik.values.newPassword}
            >
              {t("text.save")}
            </Button>
          </BoardButtonArea>
        </UserInfoForm>
      </LoginWrapper>
    </Wrapper>
  )
}

export default PwChange;