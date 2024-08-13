import { useTranslation } from "react-i18next";
import { SideMenu } from "./SideMenuStyle";
import { Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { LinkItem } from "../MenuStyle";

function BoardSideMenu({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  return (
      <SideMenu className='list' >
        <ListItem>
          <ListItemText>{t('menu.board.original')}</ListItemText>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <LinkItem to="/notice">{t('menu.board.notice')}</LinkItem>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <LinkItem to="/faq">{t('menu.board.FAQ')}</LinkItem>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <LinkItem to="/qna">{t('menu.board.QNA')}</LinkItem>
          </ListItemButton>
        </ListItem>
      </SideMenu>
  );
};

export default BoardSideMenu;