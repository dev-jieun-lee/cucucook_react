import { Box, Divider, Drawer, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DrawerList } from "./MenuStyle";
import { useNavigate } from "react-router-dom";

function DrawerMenu({toggleDrawer}: any )  {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 메뉴 항목 정의
  const RecipeMenuItems = [
    { label: t('menu.recipe.all'), path: '/all_recipe' },
    { label: t('menu.recipe.public'), path: '/public_recipe' },
    { label: t('menu.recipe.member'), path: '/member_recipe' },
  ];

  const BoardMenuItems = [
    { label: t('menu.board.notice'), path: '/board/notice' },
    { label: t('menu.board.FAQ'), path: '/board/faq' },
    { label: t('menu.board.QNA'), path: '/board/qna' },
  ];

  const MypageMenuItems = [
    { label: t('menu.mypage.profile'), path: '/mypage/profile' },
    { label: t('menu.mypage.activity'), path: '/mypage/activity' },
  ];

  // 페이지 이동 함수
  const handleListItemClick = (path: string) => {
    navigate(path);
  };

  // 메뉴 생성 함수
  const renderMenuItems = (items: { label: string, path: string }[]) => {
    return items.map((item, index) => (
      <ListItem className="list-item" key={item.label} disablePadding>
        <ListItemButton
          onClick={() => handleListItemClick(item.path)}
        >
          <span className="list-item-text">{item.label}</span>
        </ListItemButton>
      </ListItem>
    ));
  };

  return (
    <Box sx={{ width: 300 }} role="presentation"  onClick={toggleDrawer(false)}>
      <Divider />
      <DrawerList>
        <ListItem className="list-item">
          <span className="list-text">{t('menu.recipe.original')}</span>
        </ListItem>
        {renderMenuItems(RecipeMenuItems)}
      </DrawerList>
      <Divider />
      <DrawerList>
        <ListItem className="list-item">
          <span className="list-text">{t('menu.board.original')}</span>
        </ListItem>
        {renderMenuItems(BoardMenuItems)}
      </DrawerList>
      <Divider />
      <DrawerList>
        <ListItem className="list-item">
          <span className="list-text">{t('menu.mypage.original')}</span>
        </ListItem>
        {renderMenuItems(MypageMenuItems)}
      </DrawerList>
    </Box>
  );
};

export default DrawerMenu;