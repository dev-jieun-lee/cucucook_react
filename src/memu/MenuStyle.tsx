import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styled from "styled-components";

//**헤더, 메뉴 스타일 */

export const Nav = styled.nav`
  height: 110px;
  /* border-bottom: 1px solid ; */
  align-items: center; 
  .mode-icon, .search-icon, .login{
    transform: scale(1.3);
  
  }
  .mode-icon{
    margin: 0 20px;
  }
  .avatar{
    transform: scale(0.8);
  }
`;

export const Col = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Logo = styled.div`
  padding: 10px;
  .logo{
    width: 150px;
  }
`;

export const MainMenu = styled.div`
  margin-top: 30px;
  text-align: center;
  ul {
    list-style-type: none;
  }
  .main-menu-item {
    position: relative;
    display: inline-block;
    width: 120px;
    margin: 0 10px;
  }
  .menu-title {
    display: 'flex';
    height: 100%;
    font-size: 18px;
    font-weight: 600;
    color: ${(props) => props.theme.textColor};
    position: relative;
    cursor: pointer;
    
  }
  .menu-title::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
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
  margin-top: 1.5px;
  padding-top: 5px;
  position: absolute;
  color: ${(props) => props.theme.bgColor};;
  background-color: ${(props) => props.theme.bgColor};
  border: 0px 1px 1px 1px solid #ccc;
  /* box-shadow: 1px 1px 0px 0px #ccc; */
  border-radius: 5px;
  z-index: 1000;
  width: 120px;
  ul{
    padding-left: 0;
  }
  li{
    text-align: center;
    line-height: 30px;
  }
`;

export const LinkItem = styled(Link)`
  color: ${(props) => props.theme.textColor};
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  &:hover{
    color: ${(props) => props.theme.mainColor};
  }
`;

export const MotionSearch = styled.form`
  color: ${(props) => props.theme.mainColor};;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

export const MotionInput = styled(motion.input)`
  width: 210px;
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 5px 10px;
  /* padding-left: 40px; */
  z-index: 1; 
  color: grey;
  font-size: 16px;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid ${(props) => props.theme.mainColor};
  outline: none;
`;

export const MotionIconButton  = styled(motion.div)`
  display: flex;
  align-items: center;
`;