import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { SideMenu } from "./SideMenuStyle";
import { Divider, ListItem, ListItemButton } from "@mui/material";

function AdminSideMenu(){
  const [activeButton, setActiveButton] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // URL 경로에 따라 활성 버튼 설정
  useEffect(() => {
    if (location.pathname.startsWith('/admin/members')) {
      setSelectedIndex(0);
      setActiveButton("/admin/members");
    } else if (location.pathname.startsWith('/admin/board')) {
      setSelectedIndex(1);
      setActiveButton("/admin/board");
    } 
    // else if (location.pathname.startsWith('/admin/category')) {
    //   setSelectedIndex(2);
    //   setActiveButton("/admin/category");
    // } 
    else {
      setSelectedIndex(null);
      setActiveButton("");
    }
  }, [location.pathname]);


   // 페이지 이동 및 버튼 선택 상태 변경 함수
  const handleListItemClick = (index: number, path: string, buttonName: string) => {
    setSelectedIndex(index);
    setActiveButton(buttonName);
    navigate(path);
  };
  
  return (
    <SideMenu className="list">
      <ListItem>
        <span className="list-text">{t('menu.admin.original')}</span>
      </ListItem>
      <Divider />
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "/admin/members" ? "active" : ""}`}
          selected={selectedIndex === 0}
          onClick={() => handleListItemClick(0, '/admin/members', "/admin/members")}
        >
          {t('menu.admin.members')}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "/admin/board" ? "active" : ""}`}
          selected={selectedIndex === 1}
          onClick={() => handleListItemClick(0, '/admin/board', "/admin/board")}
        >
          {t('menu.admin.board')}
        </ListItemButton>
      </ListItem>
      {/* <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "/admin/category" ? "active" : ""}`}
          selected={selectedIndex === 2}
          onClick={() => handleListItemClick(0, '//admin/category', "/admin/category")}
        >
          {t('menu.admin.category')}
        </ListItemButton>
      </ListItem> */}
    </SideMenu>
  );
}

export default AdminSideMenu;