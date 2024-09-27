import { List } from "@mui/material";
import styled from "styled-components";
import media from "../../styles/MediaQuery";



export const SideMenu = styled(List)`
  /* margin-top: 30px; */
  width: 220px;
  height: 100%;
  background-color: ${(props) => props.theme.footerColor};
  border: 1px solid;
  border-color: ${(props) => props.theme.navBorderColor};
  border-radius: 10px;
  margin-left: -15px;
  margin-right: 40px;
  flex-shrink: 0;
  /* position: fixed; */
  .list-text{
    color: ${(props) => props.theme.subTextColor};
    font-weight: bold !important;
    padding-left: 10px;
    font-size: 17px;
    margin-bottom: 5px;
  }
  .list-item{
    line-height: 30px;
    color: ${(props) => props.theme.textColor};
    &:hover{
      color: ${(props) => props.theme.mainColor};
    }
  }
  .list-button{
    padding-left: 25px;
  }
  .list-button.active {
  color: ${(props) => props.theme.mainColor};
  }
  
  ${media.medium`
    display: none;
  `};

`;
