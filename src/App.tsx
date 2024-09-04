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

import Notice from './routes/board/notice/Notice';
import Faq from './routes/board/Faq/Faq';
import Main from './routes/main/Main';
import { AuthProvider } from './auth/AuthContext';
import SignupIntro from './routes/members/signUp/SignupIntro';
import Signup from './routes/members/signUp/Signup';
import NoticeDetail from './routes/board/notice/NoticeDetail';
import NoticeForm from './routes/board/notice/NoticeForm';
import FaqForm from './routes/board/Faq/FaqForm';
import Qna from './routes/board/qna/Qna';
import QnaForm from './routes/board/qna/QnaForm';
import QnaDetail from './routes/board/qna/QnaDetail';
import AnswerForm from './routes/board/qna/AnswerForm';


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
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
                    flexGrow: 1, 
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    width: '100%',
                    margin: '120px auto'
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

                    {/* 회원가입 */}
                    <Route
                      path="/signup/intro"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '20px auto' }}>
                          <SignupIntro isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />
                    <Route
                      path="/signup/form"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '20px auto' }}>
                          <Signup isDarkMode={isDarkMode} />
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
                          <Notice/>
                        </Box>
                      }
                    />
                    <Route
                      path="/notice/:boardId"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <NoticeDetail/>
                        </Box>
                      }
                    />
                    <Route
                      path="/notice/form"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <NoticeForm/>
                        </Box>
                      }
                    />
                    <Route
                      path="/notice/form/:boardId"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <NoticeForm/>
                        </Box>
                      }
                    />
                    <Route
                      path="/faq/form"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <FaqForm/>
                        </Box>
                      }
                    />
                    <Route
                      path="/faq/form/:boardId"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <FaqForm/>
                        </Box>
                      }
                    />
                    <Route
                      path="/faq"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <Faq/>
                        </Box>
                      }
                    />
                    <Route
                      path="/qna"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <Qna/>
                        </Box>
                      }
                    />
                    <Route
                      path="/qna/:boardId"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <QnaDetail/>
                        </Box>
                      }
                    />
                    <Route
                      path="/qna/form"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <QnaForm/>
                        </Box>
                      }
                    />
                    <Route
                      path="/qna/form/:boardId"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <QnaForm/>
                        </Box>
                      }
                    />
                    <Route
                      path="/qna/form/:boardId/answer"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <AnswerForm/>
                        </Box>
                      }
                    />
                    <Route
                      path="/qna/form/:boardId/answer/:answerId"
                      element={
                        <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <AnswerForm/>
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
                  {/* 회원가입 */}
                    {/* <Route path="/signup" element={<SignupPageOne />} /> */}

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
      </AuthProvider>
    </I18nextProvider>


  );
}

export default App;
