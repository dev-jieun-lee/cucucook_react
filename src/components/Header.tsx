import { AlertColor, Drawer, IconButton, Tooltip } from "@mui/material"; // MUI 컴포넌트 임포트
import Menu from "../memu/Menu"; // 메뉴 컴포넌트
import {
  Col,
  Logo,
  MotionInput,
  MotionSearch,
  Nav,
  MotionIconButton,
  DrawerTop,
} from "../memu/MenuStyle"; // 스타일 컴포넌트
import LightModeIcon from "@mui/icons-material/LightMode"; // 밝은 모드 아이콘
import DarkModeIcon from "@mui/icons-material/DarkMode"; // 어두운 모드 아이콘
import SearchIcon from "@mui/icons-material/Search"; // 검색 아이콘
import LoginIcon from "@mui/icons-material/Login"; // 로그인 아이콘
import LogoutIcon from "@mui/icons-material/Logout"; // 로그아웃 아이콘
import { motion, useAnimation } from "framer-motion"; // 애니메이션 라이브러리
import { useEffect, useState } from "react"; // React 훅
import { useNavigate } from "react-router-dom"; // 페이지 이동 훅
import { useForm } from "react-hook-form"; // 폼 관리 훅
import { useTranslation } from "react-i18next"; // 다국어 지원 훅
import MenuIcon from "@mui/icons-material/Menu"; // 드로어 메뉴 아이콘
import CloseIcon from "@mui/icons-material/Close"; // 드로어 닫기 아이콘
import DrawerMenu from "../memu/DrawerMenu"; // 드로어 메뉴 컴포넌트
import axios from "axios"; // HTTP 요청 라이브러리
import { useMutation } from "react-query";
import { logout } from "../routes/members/membersApi";
import LoginUser from "../LoginUser";
import { useAuth } from "../auth/AuthContext";

interface IForm {
  keyword: string; // 검색어 폼 데이터
}

function Header({ isDarkMode, onToggleTheme }: any) {
  const { setUser, setLoggedIn, user, isLoggedIn } = useAuth(); //로그인 상태관리
  const { t } = useTranslation(); // 번역 함수
  const [searchOpen, setSearchOpen] = useState(false); // 검색창 상태
  const [isScrolled, setIsScrolled] = useState(false); // 스크롤 상태
  const [open, setOpen] = useState(false); // 드로어 상태
  const inputAnimation = useAnimation(); // 애니메이션 제어
  const navigate = useNavigate(); // 페이지 이동 함수

  // 드로어 열기/닫기
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen); // 상태 업데이트
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0); // 스크롤 상태 업데이트
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // 이벤트 리스너 추가
    return () => {
      window.removeEventListener("scroll", handleScroll); // 이벤트 리스너 제거
    };
  }, []);

  // 로그인 페이지 이동
  const handleLoginClick = () => {
    navigate("/login"); // 페이지 이동
  };

  // 검색창 열기/닫기
  const toggleSearch = () => {
    inputAnimation.start({
      scaleX: searchOpen ? 0 : 1, // 애니메이션 설정
    });
    setSearchOpen((prev) => !prev); // 상태 토글
  };

  const { register, handleSubmit } = useForm<IForm>(); // 폼 훅
  const onValid = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`); // 검색 결과 페이지로 이동
  };

  return (
    <Nav className={isScrolled ? "scrolled" : ""}>
      <Col>
        <div style={{ display: "flex" }}>
          <Logo>
            <a href="/main">
              {isDarkMode ? (
                <img className="logo" src="/logo/dark_logo2.png" alt="logo" /> // 어두운 모드 로고
              ) : (
                <img className="logo" src="/logo/light_logo2.png" alt="logo" /> // 밝은 모드 로고
              )}
            </a>
          </Logo>
          {/* 메뉴 컴포넌트 */}
          <div className="menu-box">
            <Menu />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {/* <Tooltip title={t("text.search")}>
            <MotionSearch onSubmit={handleSubmit(onValid)}>
              <MotionIconButton
                onClick={toggleSearch}
                animate={{ x: searchOpen ? -215 : 0 }} // 애니메이션
                transition={{ type: "linear" }}
              >
                <IconButton className="search-icon">
                  <SearchIcon color="primary" />
                </IconButton>
              </MotionIconButton>
              <MotionInput
                {...register("keyword", { required: true, minLength: 2 })} // 폼 유효성 검사
                initial={{ scaleX: 0 }} // 애니메이션 초기값
                animate={inputAnimation} // 애니메이션 제어
                transition={{ type: "linear" }}
                placeholder={t("sentence.searching")} // 플레이스홀더
              />
            </MotionSearch>
          </Tooltip> */}
          <Tooltip title={t("text.change_mode")}>
            <IconButton
              className="mode-icon"
              color="primary"
              onClick={onToggleTheme} // 테마 전환
            >
              {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          {/* 드로어 열기 버튼 */}
          <IconButton
            className="drawer-icon"
            color="primary"
            onClick={toggleDrawer(true)} // 드로어 열기
          >
            <MenuIcon />
          </IconButton>
          <div className="profile-area">
            {user ? (
              <div className="profile">
                <LoginUser />
              </div>
            ) : (
              // 로그인 상태가 아닐 때 로그인 버튼
              <Tooltip title={t("members.login")}>
                <IconButton
                  className="login"
                  color="primary"
                  onClick={handleLoginClick} // 로그인 페이지 이동
                >
                  <LoginIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
      </Col>

      {/* 드로어 컴포넌트 */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <div style={{ width: "100%", padding: "0" }} role="presentation">
          {/* 드로어 상단 */}
          <DrawerTop>
            {user ? (
              // 로그인 상태일 때 로그아웃 버튼
              <div className="icon-btn profile">
                <LoginUser />
              </div>
            ) : (
              // 로그인 상태가 아닐 때 로그인 버튼
              <div
                className="drawer-login-btn"
                onClick={() => {
                  toggleDrawer(false)(); // 드로어 닫기
                  handleLoginClick(); // 로그인 페이지 이동
                }}
              >
                <IconButton className="icon-btn" color="primary">
                  <LoginIcon />
                </IconButton>
                <span>{t("members.login")}</span>
              </div>
            )}
            <IconButton className="icon-btn" onClick={toggleDrawer(false)}>
              <CloseIcon /> {/* 드로어 닫기 버튼 */}
            </IconButton>
          </DrawerTop>
          <DrawerMenu toggleDrawer={toggleDrawer} /> {/* 드로어 메뉴 */}
        </div>
      </Drawer>
    </Nav>
  );
}

export default Header;
