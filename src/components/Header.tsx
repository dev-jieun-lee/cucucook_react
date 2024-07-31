import { IconButton, Tooltip } from "@mui/material";
import Menu from "../memu/Menu";
import { Col, Logo, MotionInput, MotionSearch, Nav } from "../memu/MenuStyle";
import Profile from "./Profile";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

function Header({ isDarkMode, onToggleTheme }: any) {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputAnimation = useAnimation();

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

  return (
    <Nav>
      <Col>
        <div style={{ display: "flex" }}>
          <Logo>
            {isDarkMode ? (
              <img className="logo" src="/logo/dark_logo2.png" alt="logo" />
            ) : (
              <img className="logo" src="/logo/light_logo2.png" alt="logo" />
            )}
          </Logo>
          <Menu />
        </div>
        <div style={{ display: "flex" }}>
          <Tooltip title="검색">
            <SearchIcon
              className="search-icon"
              color="primary"
              onClick={toggleSearch}
            />
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
          <div className="profile-area">
            <Tooltip title="로그인">
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
