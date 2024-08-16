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
import Login from './routes/members/login/Login';
import Profile from './routes/myPage/Profile';
import Activity from './routes/myPage/Activity';
import UserInfo from './routes/myPage/UserInfo';
import LikeLists from './routes/myPage/LikeLists';
import MyWrites from './routes/myPage/MyWrites';
import MyReplys from './routes/myPage/MyReplys';

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
            <BrowserRouter> {/* BrowserRouter를 가장 바깥으로 이동 */}
              <Box
                sx={{
                  width: '100%', // Header의 width를 100%로 설정
                }}
              >
                <Header isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
              </Box>
              <Box
                sx={{
                  backgroundColor: 'background.default',
                  minHeight: '65vh',
                  width: '100%',
                  margin: '120px auto',
                }}
              >
                <Routes>
                  <Route path="/*" element={<Main isDarkMode={isDarkMode} />} />

                  {/* 로그인 */}
                  <Route
                    path="/login"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '20px auto' }}>
                        <Login isDarkMode={isDarkMode} />
                      </Box>
                    }
                  />

                  {/* 레시피 */}
                  <Route
                    path="/all_recipe"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                        <RecipeSideMenu isDarkMode={isDarkMode} />
                        <AllRecipe/>
                      </Box>
                    }
                  />
                  <Route
                    path="/public_recipe"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                        <RecipeSideMenu isDarkMode={isDarkMode} />
                        <PublicRecipe />
                      </Box>
                    }
                  />
                  <Route
                    path="/member_recipe"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto'}}>
                        <RecipeSideMenu isDarkMode={isDarkMode} />
                        <MemberRecipe />
                      </Box>
                    }
                  />

                  {/* 보드 */}
                  <Route
                    path="/notice"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                        <BoardSideMenu isDarkMode={isDarkMode} />
                      </Box>
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                        <BoardSideMenu isDarkMode={isDarkMode} />
                      </Box>
                    }
                  />
                  <Route
                    path="/qna"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                        <BoardSideMenu isDarkMode={isDarkMode} />
                      </Box>
                    }
                  />

                  {/* 마이페이지 */}
                  <Route
                    path="/mypage/profile"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                        <MypageSideMenu isDarkMode={isDarkMode} />
                        <Profile isDarkMode={false}/>
                      </Box>
                    }
                  />
                   <Route
                    path="/mypage/UserInfo"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                        <MypageSideMenu isDarkMode={isDarkMode} />
                        <UserInfo isDarkMode={isDarkMode} />
                      </Box>
                    }
                  />
                  <Route
                    path="/mypage/activity"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto'  }}>
                        <MypageSideMenu isDarkMode={isDarkMode} />
                        <Activity isDarkMode={false} />
                      </Box>
                    }
                  />
                  <Route
                    path="/mypage/LikeLists"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                      <MypageSideMenu isDarkMode={isDarkMode} />
                        <LikeLists isDarkMode={false} />
                      </Box>
                    }
                  />
                  <Route
                    path="/mypage/MyWrites"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                      <MypageSideMenu isDarkMode={isDarkMode} />
                        <MyWrites isDarkMode={false} />
                      </Box>
                    }
                  />
                  <Route
                    path="/mypage/MyReplys"
                    element={
                      <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                      <MypageSideMenu isDarkMode={isDarkMode} />
                        <MyReplys isDarkMode={false} />
                      </Box>
                    }
                  />
                  <Route path="/test" element={<TestPage />} />
                </Routes>
              </Box>
              <Box
                sx={{
                  width: '100%', // Footer의 width를 100%로 설정
                }}
              >
                <Footer isDarkMode={isDarkMode} />
              </Box>
            </BrowserRouter> {/* BrowserRouter 닫기 */}
          </StyledEngineProvider>
        </StyledThemeProvider>
      </MuiThemeProvider>
    </I18nextProvider>


  );
}

export default App;
