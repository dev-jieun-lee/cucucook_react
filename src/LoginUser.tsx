import { Logout } from "@mui/icons-material";
import {
  AlertColor,
  Avatar,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./auth/AuthContext";
import { useMutation } from "react-query";
import { logout } from "./apis/memberApi";
import { useNavigate } from "react-router-dom";

function LoginUser() {
  const { t } = useTranslation(); // 번역 함수
  const { setUser, setLoggedIn, user, isLoggedIn } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); //스낵바
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("error"); // 스낵바 색깔, 기본은 'error'
  const [logoutError, setLogoutError] = useState<string | null>(null); //로그아웃 오류 메시지 상태
  const navigate = useNavigate(); // 페이지 이동 함수

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //로그아웃 api 호출
  const {
    mutate: logoutMutation,
    isLoading,
    error,
  } = useMutation(logout, {
    onSuccess: () => {
      // 로그아웃 성공 시 상태 업데이트 및 페이지 이동
      navigate("/"); // 메인 페이지로 이동
      setUser(null);
    },
    onError: (error) => {
      console.error("로그아웃 오류: ", error); // 오류 처리
      setLogoutError("로그아웃에 실패했습니다.");
      setSnackbarSeverity("error"); // 에러 시 빨간색
      setSnackbarOpen(true); // 스낵바 열기
    },
  });

  // 로그아웃 처리
  const handleLogout = () => {
    logoutMutation(); // 로그아웃 요청 실행
  };

  return (
    <>
      <div style={{ display: "flex" }} onClick={handleClick}>
        <Avatar className="avatar" src="/broken-image.jpg" />
        <span style={{ marginTop: "10px", marginLeft: "5px" }}>
          {user?.name}
        </span>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t("members.logout")}
        </MenuItem>
      </Menu>
    </>
  );
}

export default LoginUser;
