import React, { useEffect, useState } from "react";
import { SideMenu } from "./SideMenuStyle";
import { useTranslation } from "react-i18next";
import { LinkItem } from "../MenuStyle";
import {
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function RecipeSideMenu({ isDarkMode }: { isDarkMode: boolean }) {
  const [activeButton, setActiveButton] = useState(""); // 활성 버튼을 관리하는 상태
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // URL 경로에 따라 활성 버튼 설정
  useEffect(() => {
    switch (location.pathname) {
      case "/recipe/all_recipe_list":
        setSelectedIndex(0);
        setActiveButton("all");
        break;
      case "/recipe/public_recipe_list":
        setSelectedIndex(1);
        setActiveButton("public");
        break;
      case "/recipe/public_recipe":
        setSelectedIndex(1);
        setActiveButton("public");
        break;
      case "/recipe/member_recipe_list":
        setSelectedIndex(2);
        setActiveButton("member");
        break;
      case "/recipe/member_recipe":
        setSelectedIndex(2);
        setActiveButton("member");
        break;
      default:
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
        <span className="list-text">{t("menu.recipe.original")}</span>
      </ListItem>
      <Divider />
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "all" ? "active" : ""}`}
          selected={selectedIndex === 0}
          onClick={() =>
            handleListItemClick(0, "/recipe/all_recipe_list", "all")
          }
        >
          {t("menu.recipe.all")}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "public" ? "active" : ""}`}
          selected={selectedIndex === 1}
          onClick={() =>
            handleListItemClick(0, "/recipe/public_recipe_list", "public")
          }
        >
          {t("menu.recipe.public")}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding className="list-item">
        <ListItemButton
          className={`list-button ${activeButton === "member" ? "active" : ""}`}
          selected={selectedIndex === 2}
          onClick={() =>
            handleListItemClick(0, "/recipe/member_recipe_list", "member")
          }
        >
          {t("menu.recipe.member")}
        </ListItemButton>
      </ListItem>
    </SideMenu>
  );
}

export default RecipeSideMenu;
