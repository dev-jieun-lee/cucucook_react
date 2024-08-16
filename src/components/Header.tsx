import { Drawer, IconButton, Tooltip } from "@mui/material";
import Menu from "../memu/Menu";
import {
  Col,
  Logo,
  MotionInput,
  MotionSearch,
  Nav,
  MotionIconButton,
  DrawerTop,
} from "../memu/MenuStyle";
import Profile from "../routes/myPage/Profile";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import { motion, useAnimation, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DrawerMenu from "../memu/DrawerMenu";

///임시 검색 인터페이스
interface IForm {
  keyword: string;
}

function Header({ isDarkMode, onToggleTheme }: any) {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const inputAnimation = useAnimation();
  const navigate = useNavigate();

  // 드로어 메뉴 열기/닫기
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  //스크롤이벤트
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //로그인 페이지로 이동
  const handleLoginClick = () => {
    navigate("/login");
  };

  //검색창 열기/ 닫기
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
  const onValid = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`);
  };

  return (
    <Nav className={isScrolled ? "scrolled" : ""}>
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
          {/* 메뉴 컴포넌트 */}
          <div className="menu-box">
            <Menu />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <Tooltip title={t("text.search")}>
            <MotionSearch onSubmit={handleSubmit(onValid)}>
              <MotionIconButton
                onClick={toggleSearch}
                animate={{ x: searchOpen ? -215 : 0 }}
                transition={{ type: "linear" }}
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
                placeholder={t("sentence.searching")}
              />
            </MotionSearch>
          </Tooltip>
          <Tooltip title={t("text.change_mode")}>
            <IconButton
              className="mode-icon"
              color="primary"
              onClick={onToggleTheme}
            >
              {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          {/* 드로어 열기 버튼 추가 */}
          <IconButton
            className="drawer-icon"
            color="primary"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <div className="profile-area">
            <Tooltip title={t("members.login")}>
              <IconButton
                className="login"
                color="primary"
                onClick={handleLoginClick}
              >
                <LoginIcon />
              </IconButton>
            </Tooltip>
            {/* <Profile /> */}
          </div>
        </div>
      </Col>

      {/* 드로어 컴포넌트 추가 */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <div style={{ width: "100%", padding: "0" }} role="presentation">
          {/* 드로어 상단 */}
          <DrawerTop>
            <div
              className="drawer-login-btn"
              onClick={() => {
                toggleDrawer(false)();
                handleLoginClick();
              }}
            >
              <IconButton className="icon-btn" color="primary">
                <LoginIcon />
              </IconButton>
              <span>{t("members.login")}</span>
            </div>
            <IconButton className="icon-btn" onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </DrawerTop>
          <DrawerMenu toggleDrawer={toggleDrawer} />
        </div>
      </Drawer>
    </Nav>
  );
}

export default Header;
