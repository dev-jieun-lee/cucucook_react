import styled from "styled-components";
import media from "./MediaQuery";
import { Box, FormControlLabel, OutlinedInput } from "@mui/material";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

///**로그인, 회원가입 스타일

export const LoginWrapper = styled.div`
  text-align: center;
  margin: 50px auto;
  margin-bottom: 100px;
  width: 35%;
  .title {
    margin-bottom: 30px;
    color: ${(props) => props.theme.mainColor};
    .title-icon {
      transform: scale(1.6);
      ${media.medium`
        transform: scale(1.2);
      `};
    }
    span {
      display: block;
      margin-top: 10px;
      font-size: 25px;
      font-weight: 600;
      ${media.medium`
        font-size: 20px;
      `};
    }
    ${media.medium`
      margin-bottom: 20px;
    `};
  }

  .input-form {
    width: 100%;
    margin-bottom: 20px;
    .input {
      display: block;
      margin-top: 15px;
    }
    .input-email {
      margin: 0;
    }
  }

  .input-email {
    width: 100%;
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
    .email {
      width: 100%;
    }
    .email-select {
      width: 50%;
      height: 55px;
    }
  }
  .custom-domian {
    margin: 8px 0 20px;
  }

  .submit-button {
    margin: 0px 0px 15px;
    height: 50px;
  }

  .save-id {
    width: 100%;
    height: 40px;
    .id-chk {
      float: left;
      margin-left: 1px;
      color: grey;
    }
  }
  ${media.medium`
    width: 60%;
  `};
  ${media.small`
    width: 90%;
  `};

  .email-btn {
    align-items: center;
    height: 54px;
    margin-top: -13px;
    font-size: 15px;
    margin-right: -5px;
  }
  .submit-btn {
    margin-top: 50px;
    height: 53px;
  }

  .chk-area{
    margin-bottom: 20px;
  }
`;

export const SnsLogin = styled.div`
  margin: 0 auto;
  width: 60%;
  height: 40px;
  display: flex;
  .naver {
    width: 50%;
  }
  .kakao {
    width: 50%;
    margin-right: 5px;
  }
  &:hover {
    cursor: pointer;
  }
`;

export const SignupIntroWrapper = styled.div`
  text-align: center;
  margin: 50px auto;
  margin-bottom: 100px;
  width: 55%;
  ${media.medium`
    width: 90%;
  `};
  .title {
    margin-bottom: 30px;
    color: ${(props) => props.theme.mainColor};
    .title-icon {
      transform: scale(1.6);
      ${media.medium`
        transform: scale(1.2);
      `};
    }
    span {
      display: block;
      margin-top: 10px;
      font-size: 25px;
      font-weight: 600;
      ${media.medium`
        font-size: 20px;
      `};
    }
    ${media.medium`
      margin-bottom: 20px;
    `};
  }
  .email-btn {
    height: 53px;
    margin-top: -3px;
    font-size: 15px;
  }
  .submit-btn {
    margin-top: 50px;
    height: 53px;
    font-size: 15px;
  }
`;

export const ButtonArea = styled.div`
  margin-bottom: 15px;
  button {
    font-size: 15px;
    border: 0;
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.mainColor};
    &:hover {
      cursor: pointer;
    }
  }
  span {
    margin: 0 13px;
    border-left: 1px solid;
    color: ${(props) => props.theme.mainColor};
  }
`;

export const ResultBox = styled.div`
  padding: 16px;
  border: 1px solid ${(props) => props.theme.borderColor}; // 입력창과 동일한 테두리 색상
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.boxShadow};
  background-color: ${(props) => props.theme.bgColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
`;

export const LoginSubmitButton = styled(Button)`
  margin: 20px 0;
  height: 40px;
  .intro-btn {
    margin-top: 10px;
  }
`;

export const StyledSubtitle = styled(Typography)`
  font-weight: bold;
  text-align: left;
  font-size: 1.2rem;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 5px;
`;

export const LargeStyledSubtitle = styled(StyledSubtitle)`
  font-size: 1.5rem; /* 큰 글씨 크기 설정 */
`;

export const LeftAlignedFormControlLabel = styled(FormControlLabel)`
  .MuiTypography-root {
    text-align: left;
  }
`;

export const CheckBoxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

// Styled Link 컴포넌트
export const StyledAnchor = styled(Link)`
  font-size: 1rem;
  color: ${(props) => props.theme.mainColor};
  text-decoration: none;
  &:hover {
    text-decoration: underline; // 호버 시 밑줄 추가
    cursor: pointer;
  }
`;

export const FindIdBox = styled(Box)`
  .find-btn {
    align-items: center;
    height: 54px;
    margin-top: 7px;
    font-size: 16px;
  }
  .email-area {
    align-items: center;
  }
  .submit {
    height: 53px;
    font-size: 16px;
  }
`;
