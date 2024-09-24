import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styled from "styled-components";
import media from "../styles/MediaQuery";
import { List, ListItemText } from "@mui/material";

//**헤더, 메뉴 스타일 */

export const Nav = styled.nav`
  /* border-bottom: 1px solid;
  border-color: ${(props) => props.theme.navBorderColor}; */
  align-items: center;
  height: 120px;
  width: 100%;
  position: fixed;
  z-index: 1000;
  top: 0;
  background-color: ${(props) => props.theme.bgColor};
  /* border-bottom: 1px solid ; */
  align-items: center;
  .mode-icon,
  .search-icon,
  .login {
    transform: scale(1.3);
    z-index: 1111;
  }
  .mode-icon {
    margin: 0 20px;
  }
  .login,
  .profile {
    ${media.medium`
      display: none;
    `};
  }
  .profile {
    &:hover {
      cursor: pointer;
    }
  }
  .drawer-icon {
    transform: scale(1.3);
    z-index: 1111;
    ${media.large`
      display: none;
    `};
  }
  .avatar {
    transform: scale(0.8);
    z-index: 1111;
  }
  /* 기본 상태에서는 border-bottom 없음 */
  border-bottom: none;

  /* 스크롤 시 border-bottom 추가 */
  &.scrolled {
    border-bottom: 1px solid ${(props) => props.theme.navBorderColor};
  }

  .menu-box {
    ${media.medium`
      display: none;
    `};
  }
`;

export const Col = styled.div`
  padding: 0 55px;
  margin: 0 auto;
  /* width: 70%; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${media.medium`
    padding: 0 30px;
  `};
`;

export const Logo = styled.div`
  padding: 10px;
  margin-top: 10px;
  .logo {
    width: 150px;

    ${media.medium`

    width: 130px;
  `};
  }
`;

export const MainMenu = styled.div`
  margin-top: 50px;
  text-align: center;
  ul {
    list-style-type: none;
  }
  .main-menu {
    ${media.medium`
      margin-left : -20px
    `};
  }
  .main-menu-item {
    position: relative;
    display: inline-block;
    width: 120px;
    margin: 0 10px;
    ${media.medium`
      width: 90px !important;
    `};
  }
  .menu-title {
    display: block;
    z-index: 9999;
    width: 120px !important;
    display: "flex";
    height: 100%;
    font-size: 18px;
    font-weight: 600;
    color: ${(props) => props.theme.textColor};
    position: relative;
    cursor: pointer;

    ${media.medium`
      /* display : none; */
      /* font-size: 15px;
      width: 90px !important; */
    `};
  }
  .menu-title::after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -3px;
    left: 50%;
    background-color: ${(props) => props.theme.mainColor};
    transition: width 0.3s ease, left 0.3s ease;
  }
  .menu-title.active::after {
    width: 100%;
    left: 0;
  }

  .main-menu-item:hover .menu-title::after {
    width: 100%;
    left: 0;
  }
  .main-menu-item:hover .sub-menu,
  .main-menu-item.active .sub-menu {
    display: block;
  }
`;

export const SubMenu = styled.div`
  display: none;
  margin-top: 1.5;
  padding-top: 5px;
  position: absolute;
  color: ${(props) => props.theme.bgColor};
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid;
  border-color: ${(props) => props.theme.mainColor};
  /* box-shadow: 1px 1px 0px 0px #050404; */
  z-index: 1000;
  width: 120px;
  ul {
    padding-left: 0;
  }
  li {
    text-align: center;
    line-height: 30px;
  }
  ${media.medium`
    width: 90px;
  `};
`;

export const LinkItem = styled(Link)`
  color: ${(props) => props.theme.textColor};
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.mainColor};
  }
  ${media.medium`
    font-size: 13px;
  `};
`;

export const MotionSearch = styled.form`
  color: ${(props) => props.theme.mainColor};
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
  ${media.medium`
    display : none;
  `};
`;

export const MotionInput = styled(motion.input)`
  width: 210px;
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 5px 10px;
  /* padding-left: 40px; */
  z-index: 1112;
  color: grey;
  font-size: 16px;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid ${(props) => props.theme.mainColor};
  outline: none;
`;

export const MotionIconButton = styled(motion.div)`
  display: flex;
  align-items: center;
  z-index: 1111;
`;

// drawer 메뉴 스타일
export const DrawerList = styled(List)`
  .list-item {
    line-height: 33px;
  }
  .list-text {
    margin-left: 10px;
    font-weight: bold;
    color: ${(props) => props.theme.mainColor};
  }
  .list-item-text {
    font-size: 15px;
    margin-left: 15px;
  }
`;

export const DrawerTop = styled.div`
  /* height: 50px; */
  margin: 7px 0;
  display: flex;
  justify-content: space-between;
  .drawer-login-btn {
    span {
      color: ${(props) => props.theme.mainColor};
      font-size: 13px;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .icon-btn {
    transform: scale(0.8);
  }
  .profile {
    &:hover {
      cursor: pointer;
    }
  }
`;
