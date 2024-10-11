import { Box, Button, ListItem } from "@mui/material";
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
  .form {
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
  margin: 10px 0 25px;
  height: 50px;
`;

export const PwChangeArea = styled.div`
  width: 100%;
  margin: 10px 0;
  .pw-input-form {
    width: 100%;
    margin: 10px;
  }
`;

export const ConnectButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  .con-btn {
    width: 100%;
    height: 50px;
    margin: -5px 0 40px;
  }
  .kakao {
    background-color: #f7e600;
    color: #000;
    opacity: 0.8;
    margin-right: 2px;
  }
  .naver {
    background-color: #2db400;
    color: #000;
    opacity: 0.8;
    margin-left: 2px;
  }
`;

export const UserInfoForm = styled.form`
  .input-form {
    margin: 10px 0;
  }
  .input-email {
    margin-top: 0px;
  }
  .form-select {
    text-align: left;
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
  .grid {
    &:nth-child(2) {
      border-right: 1px solid;
      border-left: 1px solid;
    }
  }
  .icon {
    transform: scale(2);
    margin-top: 25px;
    color: ${(props) => props.theme.textColor};
    ${media.small`
      margin-top: 15px;
      transform: scale(1.5);
    `};
  }
  .kind {
    font-size: 1.2rem;
    color: ${(props) => props.theme.textColor};
    ${media.small`
      font-size: 1.1rem;
    `};
  }
  .count {
    font-size: 1.8rem;
    font-weight: bold;
    color: ${(props) => props.theme.mainColor};
    ${media.small`
      font-size: 1.5rem;
    `};
  }
`;

export const SummaryDataArea = styled.div`
  /* overflow-x: hidden; */
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
  .grid {
    border: 1px solid;
    border-color: ${(props) => props.theme.navBorderColor};
    border-radius: 5px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    margin: 16px 20px;
    color: ${(props) => props.theme.textColor};
    span {
      font-size: 18px;
      font-weight: bold;
      align-items: center;
      .icon {
        transform: scale(1);
        padding-top: 10px;
      }
    }
  }
  .more-icon {
    transform: scale(0.7);
    color: #898787d3;
    margin-top: 4px;
  }
`;

export const MypageContentArea = styled.div`
  width: 100%;
`;

export const MypageHeaderListItem = styled(ListItem)`
  width: 100%;
  .no {
    flex: 1;
    text-align: center;
  }
  .division {
    flex: 2;
    text-align: center;
    ${media.small`
      display : none;
    `};
  }
  .title {
    flex: 4;
    text-align: center;
    ${media.small`
      flex: 6;
    `};
  }
  .recipe {
    flex: 2;
    ${media.small`
      display : none;
    `};
  }
  .comment {
    flex: 3;
    text-align: center;
    ${media.small`
      flex : 6;
    `};
  }
  .date {
    flex: 2;
    text-align: center;
  }
  .delete {
    flex: 1;
    text-align: center;
    /* ${media.small`
      flex: 1;
    `}; */
  }
  ${media.small`
    font-size: 13px;
  `};

  border-bottom: 1px solid;
  border-top: 1px solid;
  height: 55px;
  border-color: ${(props) => props.theme.navBorderColor};
`;

export const MypageRowListItem = styled(ListItem)`
  width: 100%;
  .no {
    flex: 1;
    text-align: center;
    ${media.small`
      /* flex: 1; */
      /* margin-left : -10px; */
      font-size: 12px;
    `};
  }
  .division {
    flex: 2;
    text-align: center;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${media.small`
      font-size: 13px;
      color: ${(props: any) => props.theme.navBorderColor};
    `};
  }
  .content {
    display: flex;
    flex: 6;
    align-items: center;
    ${media.small`
      /* flex: 6; */
      margin-left : 20px;
      flex-direction: column;
      text-align : left;
      align-items: flex-start;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `};
  }
  .recipe {
    flex: 2;
    ${media.small`
      font-size : 12px;
      color : ${(props: any) => props.theme.navBorderColor};
    `};
  }
  .comment {
    width: 95%;
    flex: 3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .title {
    flex: 4;
    width: 95%;
    margin-left: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${media.small`
      /* flex: 4; */
      margin-left: 0px;
      margin-bottom : 3px;
      font-size: 15px;

    `};
  }
  .date {
    flex: 2;
    font-size: 14px;
    text-align: center;
    ${media.small`
      /* flex: 2; */
      font-size: 10px;
      color : ${(props: any) => props.theme.navBorderColor};
    `};
  }
  .delete {
    flex: 1;
    text-align: center;
    /* ${media.small`
      flex: 1;
    `}; */
  }

  ${media.small`
    height: 60px;
  `};
  border-bottom: 1px solid;
  height: 55px;
  border-color: ${(props) => props.theme.tableBorderColor};
  &:last-child {
    border-color: ${(props) => props.theme.navBorderColor};
  }
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.tableHoverColor};
  }
`;

export const ActivityHeaderListItem = styled(ListItem)`
  width: 90%;
  margin: 0 auto;
  border-bottom: 1px solid;
  /* border-top: 1px solid; */
  height: 50px;
  border-color: ${(props) => props.theme.navBorderColor};
  font-size: 14px;
  .activity-no {
    flex: 1;
    text-align: center;
    ${media.small`
      display : none;
    `};
  }
  .activity-title {
    flex: 4;
    text-align: center;
    ${media.small`
      flex: 1;
    `};
  }
  /* .activity-comment{
    flex : 4;
    text-align: center;
    ${media.small`
      display : none;
    `};
  }  */
  .date {
    flex: 2;
    text-align: center;
    ${media.small`
      flex: 1;
    `};
  }
`;

export const ActivityRowListItem = styled(ListItem)`
  width: 90%;
  margin: 0 auto;
  border-bottom: 1px solid;
  /* border-top: 1px solid; */
  height: 50px;
  border-color: ${(props) => props.theme.navBorderColor};
  font-size: 15px;
  .activity-no {
    flex: 1;
    text-align: center;
    font-size: 12px;
    ${media.small`
      display : none;
    `};
  }
  .activity-title,
  .comment-title {
    flex: 4;
    width: 90%;
    margin-left: 10px;
    margin-right: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .activity-comment {
    margin-left: 10px;
    flex: 4;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .date {
    flex: 2;
    text-align: center;
    font-size: 12px;
    ${media.small`
      flex :1;
      font-size: 12px;
      color : ${(props: any) => props.theme.navBorderColor};
    `};
  }
  .contents {
    display: flex;
    flex: 4;
    align-items: center;
    margin-left: 20px;
    flex-direction: column;
    text-align: left;
    align-items: flex-start;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .comment-title {
      font-size: 13px;
      color: ${(props: any) => props.theme.navBorderColor};
    }
    ${media.small`
      flex: 1;
      margin-left : 0px;
    `};
  }
  &:hover {
    cursor: pointer;
    font-weight: bold;
  }
`;
