import { useTranslation } from "react-i18next";
import { SideMenu } from "../../styles/SideMenuStyle";
import { Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { LinkItem } from "../../styles/MenuStyle";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function MypageSideMenu({ isDarkMode }: { isDarkMode: boolean }) {
  const [activeButton, setActiveButton] = useState(""); // 활성 버튼을 관리하는 상태
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // URL 경로에 따라 활성 버튼 설정
  useEffect(() => {
    if (location.pathname.startsWith('/mypage/profile')) {
      setSelectedIndex(0);
      setActiveButton("/mypage/profile");
    } else if (location.pathname.startsWith('/mypage/activity')) {
      setSelectedIndex(1);
      setActiveButton("/mypage/activity");
    } else {
      setSelectedIndex(null);
      setActiveButton("");
    }
  }, [location.pathname]);

  // 페이지 이동 및 버튼 선택 상태 변경 함수
  const handleListItemClick = (
    index: number,
    path: string,
    buttonName: string
  ) => {
    setSelectedIndex(index);
    setActiveButton(buttonName);
    navigate(path);
  };

  return (
    <SideMenu className="list">
      <ListItem>
        <span className="list-text">{t("mypage.original")}</span>
      </ListItem>
      <Divider />
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${
            activeButton === "/mypage/profile" ? "active" : ""
          }`}
          selected={selectedIndex === 0}
          onClick={() => handleListItemClick(0, "/mypage/profile", "mypage/profile")}
        >
          {t("mypage.profile")}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${
            activeButton === "/mypage/activity" ? "active" : ""
          }`}
          selected={selectedIndex === 1}
          onClick={() => handleListItemClick(0, "/mypage/activity", "/mypage/activity")}
        >
          {t("mypage.activity")}
        </ListItemButton>
      </ListItem>
    </SideMenu>
  );
}

export default MypageSideMenu;
