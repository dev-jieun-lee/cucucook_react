import { Box, Divider, ListItem, ListItemButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DrawerList } from "../styles/MenuStyle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";

function DrawerMenu({ toggleDrawer }: any) {
  const { user } = useAuth(); //로그인 상태관리
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 메뉴 항목 정의
  const RecipeMenuItems = [
    { label: t("menu.recipe.all"), path: "/recipe/all_recipe_list" },
    { label: t("menu.recipe.public"), path: "/recipe/public_recipe_list" },
    { label: t("menu.recipe.member"), path: "/recipe/member_recipe_list" },
  ];

  const BoardMenuItems = [
    { label: t("menu.board.notice"), path: "/notice" },
    { label: t("menu.board.FAQ"), path: "/faq" },
    { label: t("menu.board.QNA"), path: "/qna" },
  ];

  const MypageMenuItems = [
    { label: t("mypage.profile"), path: "/mypage/profile" },
    { label: t("mypage.activity"), path: "/mypage/activity" },
  ];

  const AdminMenuItems = [
    { label: t("menu.admin.members"), path: "/admin/members" },
    { label: t("menu.admin.category_board"), path: "/admin/category/board" },
    { label: t("menu.admin.category_recipe"), path: "/admin/category/recipe" },
  ];

  // 페이지 이동 함수
  const handleListItemClick = (path: string) => {
    toggleDrawer(false)();
    setTimeout(() => {
      navigate(path); // 드로어가 닫힌 후에 페이지 이동
    }, 100);
  };

  // 메뉴 생성 함수
  const renderMenuItems = (items: { label: string; path: string }[]) => {
    return items.map((item, index) => (
      <ListItem className="list-item" key={item.label} disablePadding>
        <ListItemButton onClick={() => handleListItemClick(item.path)}>
          <span className="list-item-text">{item.label}</span>
        </ListItemButton>
      </ListItem>
    ));
  };

  return (
    <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)}>
      <Divider />
      <DrawerList>
        <ListItem className="list-item">
          <span className="list-text">{t("menu.recipe.original")}</span>
        </ListItem>
        {renderMenuItems(RecipeMenuItems)}
      </DrawerList>
      <Divider />
      <DrawerList>
        <ListItem className="list-item">
          <span className="list-text">{t("menu.board.original")}</span>
        </ListItem>
        {renderMenuItems(BoardMenuItems)}
      </DrawerList>
      <Divider />
      {user ? (
        <DrawerList>
          <ListItem className="list-item">
            <span className="list-text">{t("mypage.original")}</span>
          </ListItem>
          {renderMenuItems(MypageMenuItems)}
        </DrawerList>
      ) : (
        <></>
      )}
      <Divider />
      {user?.role === "0" ? (
        <DrawerList>
          <ListItem className="list-item">
            <span className="list-text">{t("menu.admin.original")}</span>
          </ListItem>
          {renderMenuItems(AdminMenuItems)}
        </DrawerList>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default DrawerMenu;
