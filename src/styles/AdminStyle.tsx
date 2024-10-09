import { IconButton, ListItem } from "@mui/material";
import styled from "styled-components";
import media from "./MediaQuery";

export const ColorDots = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 100%;
`;

export const DeleteIconButton = styled(IconButton)`
  margin: -5px;
  width: 30px;
  height: 30px;
  .delete-icon{
    transform: scale(0.9);
  }
`;

export const AdminHeaderListItem = styled(ListItem)`
  width: 100%;
  border-bottom: 1px solid;
  border-top: 1px solid;
  height: 55px;
  text-align: center;
  border-color: ${(props) => props.theme.navBorderColor};
  .no{
    flex : 1;
  }
  .user-id{
    flex : 3;
    ${media.small`
      display : none;
    `};
  }
  .user-name{
    flex : 3;
  }
  .date{
    flex : 2;
  }
  .role{
    flex : 1;
  }
  .name-area{
    flex : 6;
    display: flex;
    text-align: center;
    ${media.small`
      flex : 2;
      display : block;
    `};
  }
`;


export const AdminRowListItem = styled(ListItem)`
  width: 100%;
  text-align: center;
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
  .no{
    flex : 1;
  }
  .user-id{
    flex : 3;
    ${media.small`
      flex : 2;
      font-size : 13px;
      color: ${(props : any) => props.theme.navBorderColor};
    `};
  }
  .user-name{
    flex : 3;
    ${media.small`
      flex : 2;
    `};
  }
  .date{
    flex : 2;
    font-size: 14px;
    ${media.small`
      color: ${(props: any) => props.theme.navBorderColor};
    `};
  }
  .role{
    flex : 1;
  }
  .name-area{
    flex : 6;
    display: flex;
    text-align: center;
    ${media.small`
      flex : 2;
      display : block;
      text-align : left;
    `};
  }
`;