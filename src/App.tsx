import { Box, CssBaseline, StyledEngineProvider } from "@mui/material";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import {
  muiDarkTheme,
  muiLightTheme,
  styledDarkTheme,
  styledLightTheme,
} from "./theme";
// material-ui
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
// styled-components
import { I18nextProvider } from "react-i18next";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import TestPage from "./TestPage";
import Footer from "./components/Footer";
import i18n from "./locales/i18n";
import BoardSideMenu from "./memu/sideMenu/BoardSideMenu";
import MypageSideMenu from "./memu/sideMenu/MypageSideMenu";
import RecipeSideMenu from "./memu/sideMenu/RecipeSideMenu";
import Login from "./routes/members/login/Login";
import Activity from "./routes/myPage/Activity";
import LikeLists from "./routes/myPage/LikeLists";
import MyReplys from "./routes/myPage/MyReplys";
import MyWrites from "./routes/myPage/MyWrites";
import Profile from "./routes/myPage/Profile";
import UserInfo from "./routes/myPage/UserInfo";
import AllRecipeList from "./routes/recipe/AllRecipeList";
import MemberRecipe from "./routes/recipe/MemberRecipe";
import MemberRecipeList from "./routes/recipe/MemberRecipeList";
import PublicRecipe from "./routes/recipe/PublicRecipe";
import PublicRecipeList from "./routes/recipe/PublicRecipeList";

import { AuthProvider } from "./auth/AuthContext";
import Faq from "./routes/board/Faq/Faq";
import FaqForm from "./routes/board/Faq/FaqForm";
import Notice from "./routes/board/notice/Notice";
import NoticeDetail from "./routes/board/notice/NoticeDetail";
import NoticeForm from "./routes/board/notice/NoticeForm";
import Main from "./routes/main/Main";
import FindId from "./routes/members/login/FindId";
import FindPw from "./routes/members/login/FindPw";
import Signup from "./routes/members/signUp/Signup";
import SignupIntro from "./routes/members/signUp/SignupIntro";
import MemberRecipeWrite from "./routes/recipe/MemberRecipeWrite";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <MuiThemeProvider theme={isDarkMode ? muiDarkTheme : muiLightTheme}>
          <StyledThemeProvider
            theme={isDarkMode ? styledDarkTheme : styledLightTheme}
          >
            <StyledEngineProvider injectFirst>
              <CssBaseline />
              <BrowserRouter>
                {" "}
                {/* BrowserRouter를 가장 바깥으로 이동 */}
                <Box
                  sx={{
                    width: "100%", // Header의 width를 100%로 설정
                  }}
                >
                  <Header
                    isDarkMode={isDarkMode}
                    onToggleTheme={handleToggleTheme}
                  />
                </Box>
                <Box
                  sx={{
                    backgroundColor: "background.default",
                    minHeight: "65vh",
                    width: "100%",
                    margin: "120px auto",
                  }}
                >
                  <Routes>
                    <Route
                      path="/*"
                      element={<Main isDarkMode={isDarkMode} />}
                    />

                    {/* 로그인 */}
                    <Route
                      path="/login"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "20px auto",
                          }}
                        >
                          <Login isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />

                    {/*아이디찾기 */}
                    <Route
                      path="/login/FindId"
                      element={<FindId isDarkMode={false} />}
                    />

                    {/* 회원가입 */}
                    <Route
                      path="/signup/intro"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "20px auto",
                          }}
                        >
                          <SignupIntro isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />
                    <Route
                      path="/signup/form"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "20px auto",
                          }}
                        >
                          <Signup isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />

                    {/*비밀번호 찾기 */}
                    <Route
                      path="/login/FindPw"
                      element={<FindPw isDarkMode={false} />}
                    />

                    {/* 레시피 */}
                    <Route
                      path="/recipe/all_recipe_list"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                            alignItems: "flex-start",
                          }}
                        >
                          <RecipeSideMenu isDarkMode={isDarkMode} />
                          <AllRecipeList isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />
                    <Route
                      path="/recipe/public_recipe_list/:search?/:display?/:start?/:recipeCategoryId?"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                            alignItems: "flex-start",
                          }}
                        >
                          <RecipeSideMenu isDarkMode={isDarkMode} />
                          <PublicRecipeList isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />
                    <Route
                      path="/recipe/member_recipe_list/:search?/:display?/:start?/:recipeCategoryId?/:orderby?"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                            alignItems: "flex-start",
                          }}
                        >
                          <RecipeSideMenu isDarkMode={isDarkMode} />
                          <MemberRecipeList isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />
                    <Route
                      path="/recipe/public_recipe/:search/:display/:start"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                            alignItems: "flex-start",
                          }}
                        >
                          <RecipeSideMenu isDarkMode={isDarkMode} />
                          <PublicRecipe isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />
                    <Route
                      path="/recipe/member_recipe/:recipeId?"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                            alignItems: "flex-start",
                          }}
                        >
                          <RecipeSideMenu isDarkMode={isDarkMode} />
                          <MemberRecipe isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />
                    <Route
                      path="/recipe/member_recipe_write/:recipeId?"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                            alignItems: "flex-start",
                          }}
                        >
                          <RecipeSideMenu isDarkMode={isDarkMode} />
                          <MemberRecipeWrite isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />

                    {/* 보드 */}
                    <Route
                      path="/notice"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <Notice />
                        </Box>
                      }
                    />
                    <Route
                      path="/notice/:boardId"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <NoticeDetail />
                        </Box>
                      }
                    />
                    <Route
                      path="/notice/form"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <NoticeForm />
                        </Box>
                      }
                    />
                    <Route
                      path="/notice/form/:boardId"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <NoticeForm />
                        </Box>
                      }
                    />
                    <Route
                      path="/faq/form"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <FaqForm />
                        </Box>
                      }
                    />
                    <Route
                      path="/faq/form/:boardId"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <FaqForm />
                        </Box>
                      }
                    />
                    <Route
                      path="/notice/:boardId"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <NoticeDetail />
                        </Box>
                      }
                    />
                    <Route
                      path="/notice/form"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <NoticeForm />
                        </Box>
                      }
                    />
                    <Route
                      path="/notice/form/:boardId"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <NoticeForm />
                        </Box>
                      }
                    />
                    <Route
                      path="/faq/form"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <FaqForm />
                        </Box>
                      }
                    />
                    <Route
                      path="/faq/form/:boardId"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <FaqForm />
                        </Box>
                      }
                    />
                    <Route
                      path="/faq"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                          <Faq />
                        </Box>
                      }
                    />
                    <Route
                      path="/qna"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <BoardSideMenu isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />

                    {/* 마이페이지 */}
                    <Route
                      path="/mypage/profile"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <MypageSideMenu isDarkMode={isDarkMode} />
                          <Profile isDarkMode={false} />
                        </Box>
                      }
                    />
                    <Route
                      path="/mypage/UserInfo"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <MypageSideMenu isDarkMode={isDarkMode} />
                          <UserInfo isDarkMode={isDarkMode} />
                        </Box>
                      }
                    />
                    <Route
                      path="/mypage/activity"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <MypageSideMenu isDarkMode={isDarkMode} />
                          <Activity isDarkMode={false} />
                        </Box>
                      }
                    />
                    <Route
                      path="/mypage/LikeLists"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <MypageSideMenu isDarkMode={isDarkMode} />
                          <LikeLists isDarkMode={false} />
                        </Box>
                      }
                    />
                    <Route
                      path="/mypage/MyWrites"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
                          <MypageSideMenu isDarkMode={isDarkMode} />
                          <MyWrites isDarkMode={false} />
                        </Box>
                      }
                    />
                    <Route
                      path="/mypage/MyReplys"
                      element={
                        <Box
                          sx={{
                            display: "flex",
                            width: "92%",
                            margin: "140px auto",
                          }}
                        >
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
                    width: "100%", // Footer의 width를 100%로 설정
                  }}
                >
                  <Footer isDarkMode={isDarkMode} />
                </Box>
              </BrowserRouter>{" "}
              {/* BrowserRouter 닫기 */}
            </StyledEngineProvider>
          </StyledThemeProvider>
        </MuiThemeProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
