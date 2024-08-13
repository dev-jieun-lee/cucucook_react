import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, CssBaseline, Paper, StyledEngineProvider,  Typography } from '@mui/material';
import { muiDarkTheme, muiLightTheme, styledDarkTheme, styledLightTheme } from './theme';
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// material-ui
import {ThemeProvider as MuiThemeProvider} from "@mui/material";
// styled-components
import {ThemeProvider as StyledThemeProvider} from "styled-components"
import TestPage from './TestPage';
import Main from './routes/main/Main';
import Footer from './components/Footer';
import { I18nextProvider } from 'react-i18next';
import i18n from './locales/i18n';
import RecipeSideMenu from './memu/sideMenu/RecipeSideMenu';
import AllRecipe from './routes/recipe/AllRecipe';
import PublicRecipe from './routes/recipe/PublicRecipe';
import MemberRecipe from './routes/recipe/MemberRecipe';
import BoardSideMenu from './memu/sideMenu/BoardSideMenu';
import MypageSideMenu from './memu/sideMenu/MypageSideMenu';
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <MuiThemeProvider theme={isDarkMode ? muiDarkTheme : muiLightTheme}>
        <StyledThemeProvider theme={isDarkMode ? styledDarkTheme : styledLightTheme}>
          <StyledEngineProvider injectFirst>
            <CssBaseline />
            <Box
              sx={{
                backgroundColor: 'background.default',
                minHeight: '100vh',
                width: '70%',
                margin: '130px auto'
              }}
            >
              <BrowserRouter>
                <Header isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
                <Routes>
                  <Route path="/*" element={<Main isDarkMode={isDarkMode} />} />
                  
                  {/* 레시피 */}
                  <Route
                    path="/all_recipe"
                    element={
                      <Box sx={{ display: 'flex' }}>
                        <RecipeSideMenu isDarkMode={isDarkMode}/>
                        <AllRecipe />
                      </Box>
                    }
                  />
                  <Route
                    path="/public_recipe"
                    element={
                      <Box sx={{ display: 'flex' }}>
                        <RecipeSideMenu isDarkMode={isDarkMode} />
                        <PublicRecipe />
                      </Box>
                    }
                  />
                  <Route
                    path="/member_recipe"
                    element={
                      <Box sx={{ display: 'flex' }}>
                        <RecipeSideMenu isDarkMode={isDarkMode}/>
                        <MemberRecipe />
                      </Box>
                    }
                  />

                  {/* 보드 */}
                  <Route
                    path="/notice"
                    element={
                      <Box sx={{ display: 'flex' }}>
                        <BoardSideMenu isDarkMode={isDarkMode}/>
                      </Box>
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <Box sx={{ display: 'flex' }}>
                        <BoardSideMenu isDarkMode={isDarkMode}/>
                      </Box>
                    }
                  />
                  <Route
                    path="/qna"
                    element={
                      <Box sx={{ display: 'flex' }}>
                        <BoardSideMenu isDarkMode={isDarkMode}/>
                      </Box>
                    }
                  />

                  {/* 마이페이지 */}
                  <Route
                    path="/mypage"
                    element={
                      <Box sx={{ display: 'flex' }}>
                        <MypageSideMenu isDarkMode={isDarkMode}/>
                      </Box>
                    }
                  />
                  <Route
                    path="/activity"
                    element={
                      <Box sx={{ display: 'flex' }}>
                        <MypageSideMenu isDarkMode={isDarkMode}/>
                      </Box>
                    }
                  />
                  <Route path="/test" element={<TestPage />} />
                </Routes>
                <Footer isDarkMode={isDarkMode} />
              </BrowserRouter>
            </Box>
          </StyledEngineProvider>
        </StyledThemeProvider>
      </MuiThemeProvider>
    </I18nextProvider>

  );
}

export default App;
