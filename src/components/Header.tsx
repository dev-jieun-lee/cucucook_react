import { Drawer, IconButton, Tooltip } from "@mui/material"; // MUI 컴포넌트 임포트
import Menu from "../memu/Menu"; // 메뉴 컴포넌트
import { Col, Logo, Nav, DrawerTop } from "../styles/MenuStyle"; // 스타일 컴포넌트
import LightModeIcon from "@mui/icons-material/LightMode"; // 밝은 모드 아이콘
import DarkModeIcon from "@mui/icons-material/DarkMode"; // 어두운 모드 아이콘
// 검색 아이콘
import LoginIcon from "@mui/icons-material/Login"; // 로그인 아이콘
// 로그아웃 아이콘
import { useAnimation } from "framer-motion"; // 애니메이션 라이브러리
import { useEffect, useRef, useState } from "react"; // React 훅
import { useNavigate } from "react-router-dom"; // 페이지 이동 훅
import { useForm } from "react-hook-form"; // 폼 관리 훅
import { useTranslation } from "react-i18next"; // 다국어 지원 훅
import MenuIcon from "@mui/icons-material/Menu"; // 드로어 메뉴 아이콘
import CloseIcon from "@mui/icons-material/Close"; // 드로어 닫기 아이콘
import DrawerMenu from "../memu/DrawerMenu"; // 드로어 메뉴 컴포넌트
import axios from "axios"; // HTTP 요청 라이브러리
import { useMutation } from "react-query";
import { logout } from "../apis/memberApi";
import LoginUser from "./LoginUser";
import { useAuth } from "../auth/AuthContext";

interface IForm {
  keyword: string; // 검색어 폼 데이터
}

function Header({ isDarkMode, onToggleTheme }: any) {
  const {user } = useAuth(); //로그인 상태관리
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false); 
  const [isScrolled, setIsScrolled] = useState(false); 
  const [open, setOpen] = useState(false); // 드로어 상태
  const inputAnimation = useAnimation(); 
  const navigate = useNavigate(); 
  const drawerButtonRef = useRef<HTMLButtonElement>(null); // 드로어 버튼 참조
  const closeButtonRef = useRef<HTMLButtonElement>(null); // 드로어 닫기 버튼 참조

  // 드로어 열기/닫기
  // const toggleDrawer = (newOpen: boolean) => () => {
  //   setOpen(newOpen); // 상태 업데이트
  // };
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen); // 상태 업데이트
    if (newOpen) {
      // 드로어가 열릴 때 닫기 버튼에 포커스 설정
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      // 드로어가 닫힐 때 드로어 열기 버튼으로 포커스 이동
      setTimeout(() => drawerButtonRef.current?.focus(), 100);
    }
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
    toggleDrawer(false)();
    setTimeout(() => {
      navigate("/login"); // 드로어가 닫힌 후에 페이지 이동
    }, 100);
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
            ref={drawerButtonRef}
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
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{
          disableAutoFocus: true,
        }}
      >
        <div style={{ width: "100%", padding: "0" }} role="presentation">
          {/* 드로어 상단 */}
          <DrawerTop>
            {user ? (
              // 로그인 상태일 때 로그아웃 버튼
              <div className="icon-btn profile">
                <LoginUser toggleDrawer={toggleDrawer} />
              </div>
            ) : (
              // 로그인 상태가 아닐 때 로그인 버튼
              <div
                className="drawer-login-btn"
                onClick={() => {
                  handleLoginClick(); // 로그인 페이지 이동
                }}
              >
                <IconButton className="icon-btn" color="primary" aria-hidden={false}>
                  <LoginIcon aria-hidden={false} />
                </IconButton>
                <span>{t("members.login")}</span>
              </div>
            )}
            <IconButton  aria-hidden={false}  className="icon-btn" onClick={toggleDrawer(false)} ref={closeButtonRef}>
              <CloseIcon  aria-hidden={false}/> {/* 드로어 닫기 버튼 */}
            </IconButton>
          </DrawerTop>
          <DrawerMenu toggleDrawer={toggleDrawer} /> {/* 드로어 메뉴 */}
        </div>
      </Drawer>
    </Nav>
  );
}

export default Header;
