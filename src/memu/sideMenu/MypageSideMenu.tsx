import { useTranslation } from "react-i18next";
import { SideMenu } from "./SideMenuStyle";
import { Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { LinkItem } from "../MenuStyle";

function MypageSideMenu({ isDarkMode }: { isDarkMode: boolean }){
  const { t } = useTranslation();
  return (
      <SideMenu className='list' >
        <ListItem>
          <ListItemText>{t('menu.mypage.original')}</ListItemText>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <LinkItem to="/mypage">{t('menu.mypage.info')}</LinkItem>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <LinkItem to="/activity">{t('menu.mypage.activity')}</LinkItem>
          </ListItemButton>
        </ListItem>
      </SideMenu>
  );
};

export default MypageSideMenu;