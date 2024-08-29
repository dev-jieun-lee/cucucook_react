import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginSubmitButton, LoginWrapper } from "../login/LoginStyle";
import { Wrapper } from "../../../styles/CommonStyles";
import PersonIcon from "@mui/icons-material/Person";
import { register, idCheck } from "../api";

const Signup = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const [customDomain, setCustomDomain] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [idError, setIdError] = useState<string | null>(null); // ID 입력에 대한 오류 메시지를 저장하는 상태 추가

  const emailDomains = [
    { value: "gmail.com", label: "gmail.com" },
    { value: "naver.com", label: "naver.com" },
    { value: "daum.net", label: "daum.net" },
    { value: "custom", label: t("members.custom_input") },
  ];

  // ID 중복 확인 함수
  const idDuplicationChk = async (id: string) => {
    try {
      const isAvailable = await idCheck(id);
      return isAvailable;
    } catch (error) {
      console.error("ID 중복 확인 실패:", error);
      return false;
    }
  };

  // 입력된 이름을 한글로 변환하는 함수
  const convertToHangul = (input: string) => {
    const jamo = /[\u3131-\u3163\uac00-\ud7a3]/;
    const isHangul = input.split("").every((char) => jamo.test(char));
    if (!isHangul) return "";

    return input
      .split("")
      .filter((char) => jamo.test(char))
      .join("");
  };

  // 폼 유효성 검사 함수
  const validate = async (values: any) => {
    const errors: any = {};
    const {
      id,
      password,
      confirmPassword,
      name,
      emailLocalPart,
      emailDomain,
      customDomain,
      phone,
    } = values;

    // ID 유효성 검사
    if (!id) {
      errors.id = t("members.id_required");
    } else if (id.length < 4) {
      errors.id = t("members.id_min");
    } else if (!/^[a-zA-Z0-9]+$/.test(id)) {
      errors.id = t("members.id_alphanumeric_only");
    } else {
      const isAvailable = await idDuplicationChk(id);
      setIsIdAvailable(isAvailable);
      if (!isAvailable) {
        errors.id = t("members.id_in_use");
      }
    }

    // 비밀번호 유효성 검사
    if (!password) {
      errors.password = t("members.password_required");
    } else if (
      !/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,15}$/.test(password)
    ) {
      errors.password = t("members.password_rules");
    }

    // 비밀번호 확인 유효성 검사
    if (confirmPassword !== password) {
      errors.confirmPassword = t("members.passwords_match");
    }

    // 이름 유효성 검사
    if (!name) {
      errors.name = t("members.name_required");
    } else if (!/^[가-힣\s]+$/.test(name)) {
      errors.name = t("members.name_korean_only");
    }

    // 이메일 유효성 검사
    if (!emailLocalPart) {
      errors.emailLocalPart = t("members.email_required");
    }

    if (!emailDomain) {
      errors.emailDomain = t("members.email_domain_required");
    } else if (emailDomain === "custom" && !customDomain) {
      errors.customDomain = t("members.custom_domain_required");
    }

    // 전화번호 유효성 검사
    if (!phone) {
      errors.phone = t("members.phone_required");
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      password: "",
      confirmPassword: "",
      name: "",
      emailLocalPart: email?.split("@")[0] || "",
      emailDomain: email?.split("@")[1] || "gmail.com",
      customDomain: "",
      phone: "",
    },
    validate,
    onSubmit: async (values) => {
      const fullEmail =
        values.emailLocalPart +
        "@" +
        (values.emailDomain === "custom" ? customDomain : values.emailDomain);
      try {
        await register({
          userId: values.id,
          password: values.password,
          name: values.name,
          phone: values.phone,
          email: fullEmail,
          smsNoti: true,
          emailNoti: true,
        });
        alert(t("members.registration_success"));
        navigate("/login");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (
            error.response?.data.includes(
              "duplicate key value violates unique constraint"
            )
          ) {
            setPhoneError(t("members.phone_number_invalid"));
            formik.setSubmitting(false); // 제출 버튼을 다시 활성화
          } else {
            alert(
              t("members.registration_failed") +
                (error.response?.data || "Unknown error")
            );
          }
        } else {
          console.error("Unexpected error:", error);
          alert(t("members.unexpected_error"));
        }
      }
    },
  });

  // ID 입력 변경 핸들러
  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;

    if (!alphanumericRegex.test(value)) {
      setIdError(t("members.id_alphanumeric_only")); // 비알파벳 문자가 있을 경우 오류 메시지 설정
    } else {
      setIdError(null); // 입력이 유효할 경우 오류 메시지 제거
    }

    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    formik.setFieldValue("id", sanitizedValue);
  };

  // 이름 입력 변경 핸들러
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filteredValue = convertToHangul(value);
    formik.setFieldValue("name", filteredValue);
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <PersonIcon className="title-icon" />
          <span>{t("members.join")}</span>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <FormControl className="input-form">
            <TextField
              id="id"
              name="id"
              label={t("members.id")}
              value={formik.values.id}
              onChange={handleIdChange}
              onBlur={formik.handleBlur}
              error={formik.touched.id && Boolean(formik.errors.id)}
              helperText={
                formik.touched.id &&
                (formik.errors.id ||
                  (isIdAvailable === false && t("members.id_in_use")) ||
                  (isIdAvailable === true && t("members.id_available")))
              }
              margin="normal"
            />
          </FormControl>

          <FormControl className="input-form">
            <TextField
              id="password"
              name="password"
              label={t("members.password")}
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
            />
          </FormControl>

          <FormControl className="input-form">
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label={t("members.password_chk")}
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              margin="normal"
            />
          </FormControl>

          <FormControl className="input-form">
            <TextField
              id="name"
              name="name"
              label={t("menu.mypage.name")}
              value={formik.values.name}
              onChange={handleNameChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
          </FormControl>

          <FormControl className="input-form">
            <TextField
              id="phone"
              name="phone"
              label={t("menu.mypage.phone_number")}
              value={formik.values.phone}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                formik.setFieldValue("phone", onlyNums);
                setPhoneError(null); // 입력이 변경될 때 전화번호 오류 메시지 초기화
              }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              margin="normal"
              error={Boolean(phoneError)}
              helperText={phoneError}
            />
          </FormControl>

          <FormControl className="input-form">
            <div className="input-email">
              <TextField
                className="email"
                id="emailLocalPart"
                name="emailLocalPart"
                label={t("text.email")}
                value={formik.values.emailLocalPart}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">@</InputAdornment>
                  ),
                }}
              />
              <Select
                className="email-select"
                id="emailDomain"
                name="emailDomain"
                value={formik.values.emailDomain}
                onChange={(e) => {
                  formik.handleChange(e);
                  if (e.target.value !== "custom") {
                    setCustomDomain("");
                  }
                }}
                disabled
              >
                {emailDomains.map((domain) => (
                  <MenuItem key={domain.value} value={domain.value}>
                    {domain.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </FormControl>

          <LoginSubmitButton
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting || Boolean(phoneError)}
          >
            {t("members.signup")}
          </LoginSubmitButton>
        </form>
      </LoginWrapper>
    </Wrapper>
  );
};

export default Signup;
