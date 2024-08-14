import { useTranslation } from "react-i18next";
import { SideMenu } from "./SideMenuStyle";
import { Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { LinkItem } from "../MenuStyle";
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
    switch (location.pathname) {
      case '/notice':
        setSelectedIndex(0);
        setActiveButton("notice");
        break;
      case '/faq':
        setSelectedIndex(1);
        setActiveButton("faq");
        break;
      case '/qna':
        setSelectedIndex(2);
        setActiveButton("qna");
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
      // <SideMenu className='list' >
      //   <ListItem className='list-item'>
      //     <ListItemText>{t('menu.board.original')}</ListItemText>
      //   </ListItem>
      //   <Divider />
      //   <ListItem disablePadding className='list-item'>
      //     <ListItemButton>
      //       <LinkItem to="/notice">{t('menu.board.notice')}</LinkItem>
      //     </ListItemButton>
      //   </ListItem>
      //   <ListItem disablePadding className='list-item'>
      //     <ListItemButton>
      //       <LinkItem to="/faq">{t('menu.board.FAQ')}</LinkItem>
      //     </ListItemButton>
      //   </ListItem>
      //   <ListItem disablePadding className='list-item'>
      //     <ListItemButton>
      //       <LinkItem to="/qna">{t('menu.board.QNA')}</LinkItem>
      //     </ListItemButton>
      //   </ListItem>
      // </SideMenu>
  );
};

export default BoardSideMenu;