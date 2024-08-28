import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
  TextField,
  Button,
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
import { register, idCheck } from "../api"; // api.ts 파일에서 import

const Signup = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.phone;
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const [customDomain, setCustomDomain] = useState("");

  const emailDomains = [
    { value: "gmail.com", label: "gmail.com" },
    { value: "naver.com", label: "naver.com" },
    { value: "daum.net", label: "daum.net" },
    { value: "custom", label: t("members.custom_input") },
  ];

  // 아이디 중복검사
  const idDuplicationChk = async (id: string) => {
    try {
      const isAvailable = await idCheck(id);
      return isAvailable;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "ID availability check failed:",
          error.message,
          error.response?.data
        );
      } else {
        console.error("Unexpected error:", error);
      }
      return false;
    }
  };

  // 한글 자모로 변환하는 함수
  const convertToHangul = (input: string) => {
    const jamo = /[\u3131-\u3163\uac00-\ud7a3]/; // 자음 및 모음 유니코드 범위
    const isHangul = input.split("").every((char) => jamo.test(char));
    if (!isHangul) return "";

    return input
      .split("")
      .filter((char) => jamo.test(char))
      .join("");
  };

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
    } = values;

    if (!id) {
      errors.id = t("members.id_required");
    } else if (id.length < 4) {
      errors.id = t("members.id_min");
    } else if (!/^[a-zA-Z0-9]+$/.test(id)) {
      // 영문자와 숫자 허용
      errors.id = t("members.id_alphanumeric_only"); // 영문자와 숫자만 허용
    } else {
      const isAvailable = await idDuplicationChk(id);
      setIsIdAvailable(isAvailable);
      if (!isAvailable) {
        errors.id = t("members.id_in_use");
      }
    }

    if (!password) {
      errors.password = t("members.password_required");
    } else if (
      !/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,15}$/.test(password)
    ) {
      errors.password = t("members.password_rules");
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = t("members.passwords_match");
    }

    if (!name) {
      errors.name = t("members.name_required");
    } else if (!/^[가-힣\s]+$/.test(name)) {
      // 모든 한글 문자와 공백 허용
      errors.name = t("members.name_korean_only"); // 한글만 허용
    }

    if (!emailLocalPart) {
      errors.emailLocalPart = t("members.email_required");
    }

    if (!emailDomain) {
      errors.emailDomain = t("members.email_domain_required");
    } else if (emailDomain === "custom" && !customDomain) {
      errors.customDomain = t("members.custom_domain_required");
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      password: "",
      confirmPassword: "",
      name: "",
      emailLocalPart: "",
      emailDomain: "gmail.com",
      customDomain: "",
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
          phone: phoneNumber,
          email: fullEmail,
          smsNoti: true,
          emailNoti: true,
        });
        alert("Registration successful!");
        navigate("/login");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(
            "Registration failed: " + (error.response?.data || "Unknown error")
          );
        } else {
          console.error("Unexpected error:", error);
          alert("An unexpected error occurred");
        }
      }
    },
  });

  // 아이디 입력값 정제 함수
  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 영문자와 숫자만 허용
    const value = event.target.value.replace(/[^a-zA-Z0-9]/g, "");
    formik.setFieldValue("id", value);
  };

  // 이름 입력값 정제 함수
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
              onChange={handleIdChange} // 아이디 정제 핸들러 사용
              onBlur={formik.handleBlur}
              error={formik.touched.id && Boolean(formik.errors.id)}
              helperText={formik.touched.id && formik.errors.id}
              margin="normal"
            />
            {formik.touched.id && isIdAvailable === false && (
              <FormHelperText error>{t("members.id_in_use")}</FormHelperText>
            )}
            {formik.touched.id && isIdAvailable === true && (
              <FormHelperText>{t("members.id_available")}</FormHelperText>
            )}
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
              onChange={handleNameChange} // 이름 정제 핸들러 사용
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
              value={phoneNumber}
              disabled
              margin="normal"
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
                error={
                  formik.touched.emailLocalPart &&
                  Boolean(formik.errors.emailLocalPart)
                }
                helperText={
                  formik.touched.emailLocalPart && formik.errors.emailLocalPart
                }
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
              >
                {emailDomains.map((domain) => (
                  <MenuItem key={domain.value} value={domain.value}>
                    {domain.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
            {formik.values.emailDomain === "custom" && (
              <TextField
                className="custom-domian"
                id="customDomain"
                name="customDomain"
                label={t("sentence.input_domain")}
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                error={
                  formik.touched.customDomain &&
                  Boolean(formik.errors.customDomain)
                }
                helperText={
                  formik.touched.customDomain && formik.errors.customDomain
                }
                fullWidth
              />
            )}
          </FormControl>

          <LoginSubmitButton
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
          >
            {t("members.signup")}
          </LoginSubmitButton>
        </form>
      </LoginWrapper>
    </Wrapper>
  );
};

export default Signup;
