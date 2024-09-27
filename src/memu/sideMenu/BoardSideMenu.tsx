import { useTranslation } from "react-i18next";
import { SideMenu } from "./SideMenuStyle";
import { Divider, ListItem, ListItemButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function BoardSideMenu({ isDarkMode }: { isDarkMode: boolean }) {
  const [activeButton, setActiveButton] = useState(""); // 활성 버튼을 관리하는 상태
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // URL 경로에 따라 활성 버튼 설정
  useEffect(() => {
    if (location.pathname.startsWith('/notice')) {
      setSelectedIndex(0);
      setActiveButton("notice");
    } else if (location.pathname.startsWith('/faq')) {
      setSelectedIndex(1);
      setActiveButton("faq");
    } else if (location.pathname.startsWith('/qna')) {
      setSelectedIndex(2);
      setActiveButton("qna");
    } else {
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
        <span className="list-text">{t('menu.board.original')}</span>
      </ListItem>
      <Divider />
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "notice" ? "active" : ""}`}
          selected={selectedIndex === 0}
          onClick={() => handleListItemClick(0, '/notice', "notice")}
        >
          {t('menu.board.notice')}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "faq" ? "active" : ""}`}
          selected={selectedIndex === 1}
          onClick={() => handleListItemClick(0, '/faq', "faq")}
        >
          {t('menu.board.FAQ')}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "qna" ? "active" : ""}`}
          selected={selectedIndex === 2}
          onClick={() => handleListItemClick(0, '/qna', "qna")}
        >
          {t('menu.board.QNA')}
        </ListItemButton>
      </ListItem>
    </SideMenu>
  );
};

export default BoardSideMenu;