import styled from "styled-components";
import media from "../../../styles/MediaQuery";
import { FormControlLabel, OutlinedInput } from "@mui/material";
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
    .input {
      display: block;
      margin-top: 15px;
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
    margin: 10px 8px 15px;
    height: 40px;
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
`;

export const ButtonArea = styled.div`
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
    margin: 0 10px;
    border-left: 1px solid;
    color: ${(props) => props.theme.mainColor};
  }
`;

//아이디찾기박스
export const InputStyled = styled(OutlinedInput)`
  border-color: ${(props) => props.theme.borderColor}; // 테두리 색상 설정
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
`;

export const StyledSubtitle = styled(Typography)`
  font-weight: bold;
  text-align: left;
  font-size: 1.25rem;
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
  color: black; // 기본 색상
  text-decoration: none; // 밑줄 제거
  &:hover {
    color: ${(props) => props.theme.mainColor}; // 호버 시 색상 변경
    text-decoration: underline; // 호버 시 밑줄 추가
    cursor: pointer; // 마우스 오버 시 커서 변경
  }
`;
