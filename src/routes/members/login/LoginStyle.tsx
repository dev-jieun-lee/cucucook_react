import styled from "styled-components";
import media from "../../../styles/MediaQuery";
import { Button } from "@mui/material";

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

export const LoginSubmitButton = styled(Button)`
  margin: 20px 0;
  height: 40px;
`;
