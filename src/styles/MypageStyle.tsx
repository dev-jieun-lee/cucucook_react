import { Button } from "@mui/material";
import styled from "styled-components";
import media from "./MediaQuery";

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

export const MyPageTitle = styled.div`
  width: 100%;
  text-align: left;
  color: ${(props) => props.theme.mainColor};
  font-weight: bold;
  font-size: 1.6rem;
  ${media.small`
    font-size: 1.4rem;
  `};
`;

export const SummaryCountArea = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 200px;
  margin-top: 50px;
  ${media.small`
    grid-template-rows: 150px;
    margin-top: 30px;
  `};
  .grid{
    &:nth-child(2){
      border-right: 1px solid;
      border-left: 1px solid;
    }
  }
  .icon{
    transform: scale(2);
    margin-top: 25px;
    color: ${(props) => props.theme.textColor};
    ${media.small`
      margin-top: 15px;
      transform: scale(1.5);
    `};
  }
  .kind{
    font-size: 1.2rem;
    color: ${(props) => props.theme.textColor};
    ${media.small`
      font-size: 1.1rem;
    `};
  }
  .count{
    font-size: 1.8rem;
    font-weight: bold;
    color: ${(props) => props.theme.mainColor};
    ${media.small`
      font-size: 1.5rem;
    `};
  }
`;

export const SummaryDataArea = styled.div`
  width: 100%;
  margin: 50px 0 50px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 330px);
  gap: 10px;
  ${media.medium`
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 330px);
  `};
  .grid{
    border: 1px solid;
    border-color: ${(props) => props.theme.navBorderColor};
    border-radius: 5px;
  }
  .title{
    display: flex;
    justify-content: space-between;
    margin: 16px 20px;
    color: ${(props) => props.theme.textColor};
    span{
      font-size: 18px;
      font-weight: bold;
      align-items: center;
      .icon{
        transform: scale(1);
        padding-top: 10px;
      }
    }
  }
  .table-container{
    background : none;
    border: 0;
    box-shadow: none;
    width: 95%;
    margin: -10px auto;
    text-align: center;
    .more-icon{
      transform: scale(0.7);
      color: #898787d3;
      margin-top: 10px;
    }
    .row {
        &:hover {
          
          cursor: pointer;
          .cell{
            font-weight: bold !important;
          }
        }
      }
  }

`;


export const MypageContentArea = styled.div`
  width: 100%;
`;