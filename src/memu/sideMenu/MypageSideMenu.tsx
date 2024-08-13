import { useTranslation } from "react-i18next";
import { SideMenu, Wrapper } from "./SideMenuStyle";
import { Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { LinkItem } from "../MenuStyle";

function MypageSideMenu({ isDarkMode }: { isDarkMode: boolean }){
  const { t } = useTranslation();
  return (
    <Wrapper>
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
    </Wrapper>
  );
};

export default MypageSideMenu;