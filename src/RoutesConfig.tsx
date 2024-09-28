// RoutesConfig.tsx
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { lazy } from "react";
import styled from "styled-components";
import RecipeSideMenu from "./memu/sideMenu/RecipeSideMenu";
import BoardSideMenu from "./memu/sideMenu/BoardSideMenu";
import MypageSideMenu from "./memu/sideMenu/MypageSideMenu";
import AdminSideMenu from "./memu/sideMenu/AdminSideMenu";
import MembersManage from "./routes/admin/member/MembersManage";
import BoardManage from "./routes/admin/board/BoardManage";
import MemberDetail from "./routes/admin/member/MemberDetail";

//메인
const Main = lazy(() => import("./routes/main/Main"));
//로그인
const Login = lazy(() => import("./routes/members/login/Login"));
const SignupIntro = lazy(() => import("./routes/members/signUp/SignupIntro"));
const Signup = lazy(() => import("./routes/members/signUp/Signup"));
const FindId = lazy(() => import("./routes/members/login/FindId"));
const FindPw = lazy(() => import("./routes/members/login/FindPw"));
//레시피
const AllRecipeList = lazy(() => import("./routes/recipe/AllRecipeList"));
const MemberRecipe = lazy(() => import("./routes/recipe/MemberRecipe"));
const MemberRecipeList = lazy(() => import("./routes/recipe/MemberRecipeList"));
const PublicRecipe = lazy(() => import("./routes/recipe/PublicRecipe"));
const PublicRecipeList = lazy(() => import("./routes/recipe/PublicRecipeList"));
const MemberRecipeWrite = lazy(
  () => import("./routes/recipe/MemberRecipeWrite")
);

//보드
const Notice = lazy(() => import("./routes/board/notice/Notice"));
const NoticeDetail = lazy(() => import("./routes/board/notice/NoticeDetail"));
const NoticeForm = lazy(() => import("./routes/board/notice/NoticeForm"));
const Faq = lazy(() => import("./routes/board/Faq/Faq"));
const FaqForm = lazy(() => import("./routes/board/Faq/FaqForm"));
const Qna = lazy(() => import("./routes/board/qna/Qna"));
const QnaDetail = lazy(() => import("./routes/board/qna/QnaDetail"));
const QnaForm = lazy(() => import("./routes/board/qna/QnaForm"));
//마이페이지
const Profile = lazy(() => import("./routes/myPage/Profile"));
const UserInfo = lazy(() => import("./routes/myPage/UserInfo"));
const Activity = lazy(() => import("./routes/myPage/Activity"));
const LikeLists = lazy(() => import("./routes/myPage/LikeLists"));
const MyWrites = lazy(() => import("./routes/myPage/MyWrites"));
const MyReplys = lazy(() => import("./routes/myPage/MyReplys"));

function RoutesConfig({ isDarkMode }: any) {
  return (
    <Routes>
      {/* 메인 */}
      <Route path="/*" element={<Main isDarkMode={isDarkMode} />} />

      {/* 로그인. 회원가입 */}
      <Route
        path="/login"
        element={
          <LoginRouteBox>
            <Login isDarkMode={isDarkMode} />
          </LoginRouteBox>
        }
      />
      <Route
        path="/signup/intro"
        element={
          <LoginRouteBox>
            <SignupIntro isDarkMode={isDarkMode} />
          </LoginRouteBox>
        }
      />
      <Route
        path="/signup/form"
        element={
          <LoginRouteBox>
            <Signup isDarkMode={isDarkMode} />
          </LoginRouteBox>
        }
      />
      <Route
        path="/login/FindId"
        element={<FindId isDarkMode={isDarkMode} />}
      />
      <Route
        path="/login/FindPw"
        element={<FindPw isDarkMode={isDarkMode} />}
      />

      {/* 레시피 */}
      <Route
        path="/recipe/all_recipe_list"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <AllRecipeList isDarkMode={isDarkMode} />
          </RouteBox>
        }
      />

      <Route
        path="/recipe/public_recipe_list"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <PublicRecipeList isDarkMode={isDarkMode} />
          </RouteBox>
        }
      />
      <Route
        path="/recipe/member_recipe_list"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <MemberRecipeList isDarkMode={isDarkMode} />
          </RouteBox>
        }
      />
      <Route
        path="/recipe/public_recipe"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <PublicRecipe isDarkMode={isDarkMode} />
          </RouteBox>
        }
      />
      <Route
        path="/recipe/member_recipe/:recipeId?"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <MemberRecipe isDarkMode={isDarkMode} />
          </RouteBox>
        }
      />
      <Route
        path="/recipe/member_recipe_write/:recipeId?"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <MemberRecipeWrite isDarkMode={isDarkMode} />
          </RouteBox>
        }
      />

      {/* 보드 */}
      <Route
        path="/notice"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <Notice />
          </RouteBox>
        }
      />
      <Route
        path="/notice/:boardId"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <NoticeDetail />
          </RouteBox>
        }
      />
      <Route
        path="/notice/form"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <NoticeForm />
          </RouteBox>
        }
      />
      <Route
        path="/notice/form/:boardId"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <NoticeForm />
          </RouteBox>
        }
      />
      <Route
        path="/faq"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <Faq />
          </RouteBox>
        }
      />
      <Route
        path="/faq/form"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <FaqForm />
          </RouteBox>
        }
      />
      <Route
        path="/faq/form/:boardId"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <FaqForm />
          </RouteBox>
        }
      />
      <Route
        path="/qna"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <Qna />
          </RouteBox>
        }
      />
      <Route
        path="/qna/:boardId"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <QnaDetail />
          </RouteBox>
        }
      />
      <Route
        path="/qna/form"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <QnaForm />
          </RouteBox>
        }
      />
      <Route
        path="/qna/form/:boardId"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <QnaForm />
          </RouteBox>
        }
      />

      {/* 마이페이지 */}
      <Route
        path="/mypage/profile"
        element={
          <RouteBox>
            <MypageSideMenu isDarkMode={isDarkMode} />
            <Profile isDarkMode={false} />
          </RouteBox>
        }
      />
      <Route
        path="/mypage/UserInfo"
        element={
          <RouteBox>
            <MypageSideMenu isDarkMode={isDarkMode} />
            <UserInfo isDarkMode={false} />
          </RouteBox>
        }
      />
      <Route
        path="/mypage/activity"
        element={
          <RouteBox>
            <MypageSideMenu isDarkMode={isDarkMode} />
            <Activity isDarkMode={false} />
          </RouteBox>
        }
      />
      <Route
        path="/mypage/LikeLists"
        element={
          <RouteBox>
            <MypageSideMenu isDarkMode={isDarkMode} />
            <LikeLists isDarkMode={false} />
          </RouteBox>
        }
      />
      <Route
        path="/mypage/MyWrites"
        element={
          <RouteBox>
            <MypageSideMenu isDarkMode={isDarkMode} />
            <MyWrites isDarkMode={false} />
          </RouteBox>
        }
      />
      <Route
        path="/mypage/MyReplys"
        element={
          <RouteBox>
            <MypageSideMenu isDarkMode={isDarkMode} />
            <MyReplys isDarkMode={false} />
          </RouteBox>
        }
      />

      {/* 관리자 */}
      <Route
        path="/admin/members"
        element={
          <RouteBox>
            <AdminSideMenu />
            <MembersManage />
          </RouteBox>
        }
      />
      <Route
        path="/admin/members/:memberId"
        element={
          <RouteBox>
            <AdminSideMenu />
            <MemberDetail />
          </RouteBox>
        }
      />
      <Route
        path="/admin/board"
        element={
          <RouteBox>
            <AdminSideMenu />
            <BoardManage />
          </RouteBox>
        }
      />
    </Routes>
  );
}

export default RoutesConfig;

const LoginRouteBox = styled(Box)`
  display: flex;
  width: 92%;
  margin: 20px auto;
`;
const RouteBox = styled(Box)`
  display: flex;
  width: 92%;
  margin: 140px auto;
`;
