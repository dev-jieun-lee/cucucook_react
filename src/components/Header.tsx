import { IconButton, Tooltip } from "@mui/material";
import Menu from "../memu/Menu";
import { Col, Logo, MotionInput, MotionSearch, Nav, MotionIconButton,  } from "../memu/MenuStyle";
import Profile from "./Profile";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import { motion, useAnimation, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";


///임시 검색 인터페이스
interface IForm {
  keyword: string;
}


function Header({ isDarkMode, onToggleTheme }: any) {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputAnimation = useAnimation();
  const navigate = useNavigate();

  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchOpen((prev) => !prev);
  };
  
  const { register, handleSubmit } = useForm<IForm>();
  const onValid = (data : IForm) => {
    navigate(`/search?keyword=${data.keyword}`)
  }


  return (
    <Nav >
      <Col>
        <div style={{ display: "flex" }}>
          <Logo>
            <a href="/main">
              {isDarkMode ? (
                <img className="logo" src="/logo/dark_logo2.png" alt="logo" />
              ) : (
                <img className="logo" src="/logo/light_logo2.png" alt="logo" />
              )}
            </a>
          </Logo>
          <Menu />
        </div>
        <div style={{ display: "flex" }}>
          <Tooltip title="검색">
            <MotionSearch onSubmit={handleSubmit(onValid)}>
              <MotionIconButton
                onClick={toggleSearch}
                animate={{ x: searchOpen ? -215 : 0 }}
                transition={{ type: 'linear' }}
              >
                <IconButton className="search-icon">
                  <SearchIcon color="primary" />
                </IconButton>
              </MotionIconButton>
              <MotionInput
                {...register("keyword", { required: true, minLength: 2 })}
                initial={{ scaleX: 0 }}
                animate={inputAnimation}
                transition={{ type: "linear" }}
                placeholder="검색어를 입력해주세요."
              />
            </MotionSearch>
          </Tooltip>
          <Tooltip title="모드 변경">
            <IconButton
              className="mode-icon"
              color="primary"
              onClick={onToggleTheme}
            >
              {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <div className="profile-area" >
            <Tooltip title="로그인" >
              <IconButton className="login" color="primary">
                <LoginIcon />
              </IconButton>
            </Tooltip>
            {/* <Profile /> */}
          </div>
        </div>
      </Col>
    </Nav>
  );
}

export default Header;
