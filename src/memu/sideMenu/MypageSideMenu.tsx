import { useTranslation } from "react-i18next";
import { SideMenu } from "./SideMenuStyle";
import { Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { LinkItem } from "../MenuStyle";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function MypageSideMenu({ isDarkMode }: { isDarkMode: boolean }){
  const [activeButton, setActiveButton] = useState(""); // 활성 버튼을 관리하는 상태
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // URL 경로에 따라 활성 버튼 설정
  useEffect(() => {
    switch (location.pathname) {
      case '/mypage':
        setSelectedIndex(0);
        setActiveButton("info");
        break;
      case '/activity':
        setSelectedIndex(1);
        setActiveButton("activity");
        break;
      default:
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
        <span className="list-text">{t('menu.mypage.original')}</span>
      </ListItem>
      <Divider />
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "info" ? "active" : ""}`}
          selected={selectedIndex === 0}
          onClick={() => handleListItemClick(0, '/mypage', "info")}
        >
          {t('menu.mypage.info')}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "activity" ? "active" : ""}`}
          selected={selectedIndex === 1}
          onClick={() => handleListItemClick(0, '/activity', "activity")}
        >
          {t('menu.mypage.activity')}
        </ListItemButton>
      </ListItem>
    </SideMenu>
  );
};

export default MypageSideMenu;