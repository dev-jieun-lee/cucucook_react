
import React from 'react';
import { SideMenu } from './SideMenuStyle';
import { useTranslation } from 'react-i18next';
import { LinkItem } from '../MenuStyle';
import { Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';

function RecipeSideMenu({ isDarkMode }: { isDarkMode: boolean }){
  const { t } = useTranslation();
  return (
      <SideMenu className='list' >
        <ListItem>
          <ListItemText>{t('menu.recipe.original')}</ListItemText>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <LinkItem to="/all_recipe">{t('menu.recipe.all')}</LinkItem>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <LinkItem to="/public_recipe">{t('menu.recipe.public')}</LinkItem>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <LinkItem to="/member_recipe">{t('menu.recipe.member')}</LinkItem>
          </ListItemButton>
        </ListItem>
      </SideMenu>
  );
};

export default RecipeSideMenu;