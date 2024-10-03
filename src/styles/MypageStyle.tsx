import { Button } from "@mui/material";
import styled from "styled-components";

export const SubTitle = styled.div`
  margin-top: 50px;
  text-align: left;
  color: ${(props) => props.theme.textColor};
`;

export const PwInputArea = styled.div`
  width: 100%;
  margin-top: 20px;
  .form{
    width: 100%;
  }
`;

export const PwButtonArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

export const PwChangeButton = styled(Button)`
  width: 100%;
  margin: -5px 0 25px;
  height: 50px;
`;

export const PwChangeArea = styled.div`
  width: 100%;
  margin: 10px 0;
  .pw-input-form{
    width: 100%;
    margin: 10px;
  }
`;

export const ConnectButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  .con-btn{
    width: 100%;
    height: 50px;
    margin: -5px 0 40px;
  }
  .kakao{
    background-color: #F7E600;
    color: #000;
    opacity: 0.8;
    margin-right: 2px;
  }
  .naver{
    background-color: #2DB400;
    color: #000;
    opacity: 0.8;
    margin-left: 2px;
  }
`;

export const UserInfoForm = styled.form`
  .input-form{
    margin: 10px 0;
  }
  .input-email{
    margin-top: 0px;
  }
  
`;
