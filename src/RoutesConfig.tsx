// RoutesConfig.tsx
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { lazy } from "react";
import styled from "styled-components";
import RecipeSideMenu from "./memu/sideMenu/RecipeSideMenu";
import BoardSideMenu from "./memu/sideMenu/BoardSideMenu";
import MypageSideMenu from "./memu/sideMenu/MypageSideMenu";

import KakaoCallback from "./routes/members/login/KakaoRedirection";
import NaverCallback from "./routes/members/login/NaverRedirection";
import { ProtectAuthRouter } from "./ProtectRouter/ProtectAuthRouter";
import { ProtectRoleRouter } from "./ProtectRouter/ProtectRoleRouter";
import AdminSideMenu from "./memu/sideMenu/AdminSideMenu";

//메인
const Main = lazy(() => import("./routes/main/Main"));

//로그인
const Login = lazy(() => import("./routes/members/login/Login"));
const SignupIntro = lazy(() => import("./routes/members/signUp/SignupIntro"));
const Signup = lazy(() => import("./routes/members/signUp/Signup"));
const FindId = lazy(() => import("./routes/members/login/FindId"));
const FindPw = lazy(() => import("./routes/members/login/FindPw"));
//const Redirection = lazy(() => import("./routes/members/login/Redirection"));

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
const MyRecipes = lazy(() => import("./routes/myPage/MyRecipes"));
const PwChange = lazy(() => import("./routes/myPage/PwChange"));
//관리자
const MembersManage = lazy(() => import("./routes/admin/member/MembersManage"));
const MemberDetail = lazy(() => import("./routes/admin/member/MemberDetail"));
const BoardCategoryManage = lazy(
  () => import("./routes/admin/category/BoardCategoryManage")
);
const RecipeCategoryManage = lazy(
  () => import("./routes/admin/category/RecipeCategoryManage")
);

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
            <Login/>
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
      {/* 소셜로그인 리디렉션 핸들러 라우트 추가 */}
      <Route path="/kakao/callback" element={<KakaoCallback />} />
      <Route path="/naver/callback" element={<NaverCallback />} />
      {/* 레시피 */}
      <Route
        path="/recipe/all_recipe_list"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <AllRecipeList />
          </RouteBox>
        }
      />
      <Route
        path="/recipe/public_recipe_list"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <PublicRecipeList />
          </RouteBox>
        }
      />
      <Route
        path="/recipe/member_recipe_list/:order?"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <MemberRecipeList />
          </RouteBox>
        }
      />
      <Route
        path="/recipe/public_recipe/:search"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <PublicRecipe />
          </RouteBox>
        }
      />
      <Route
        path="/recipe/member_recipe/:recipeId?"
        element={
          <RouteBox>
            <RecipeSideMenu isDarkMode={isDarkMode} />
            <MemberRecipe />
          </RouteBox>
        }
      />
      <Route element={<ProtectAuthRouter />}>
        <Route
          path="/recipe/member_recipe_write/:recipeId?"
          element={
            <RouteBox>
              <RecipeSideMenu isDarkMode={isDarkMode} />
              <MemberRecipeWrite />
            </RouteBox>
          }
        />
      </Route>
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
      <Route element={<ProtectAuthRouter />}>
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
      </Route>
      <Route
        path="/faq"
        element={
          <RouteBox>
            <BoardSideMenu isDarkMode={isDarkMode} />
            <Faq />
          </RouteBox>
        }
      />
      <Route element={<ProtectAuthRouter />}>
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
      </Route>
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
      <Route element={<ProtectAuthRouter />}>
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
      </Route>

      {/* 마이페이지 */}
      <Route element={<ProtectAuthRouter />}>
        <Route
          path="/mypage/profile"
          element={
            <RouteBox>
              <MypageSideMenu isDarkMode={isDarkMode} />
              <Profile />
            </RouteBox>
          }
        />
        <Route
          path="/mypage/profile/userInfo"
          element={
            <RouteBox>
              <MypageSideMenu isDarkMode={isDarkMode} />
              <UserInfo />
            </RouteBox>
          }
        />
        <Route
          path="/mypage/profile/userInfo/passwordChange/:memberId"
          element={
            <RouteBox>
              <MypageSideMenu isDarkMode={isDarkMode} />
              <PwChange />
            </RouteBox>
          }
        />
        <Route
          path="/mypage/activity"
          element={
            <RouteBox>
              <MypageSideMenu isDarkMode={isDarkMode} />
              <Activity />
            </RouteBox>
          }
        />
        <Route
          path="/mypage/activity/LikeLists"
          element={
            <RouteBox>
              <MypageSideMenu isDarkMode={isDarkMode} />
              <LikeLists />
            </RouteBox>
          }
        />
        <Route
          path="/mypage/activity/MyWrites"
          element={
            <RouteBox>
              <MypageSideMenu isDarkMode={isDarkMode} />
              <MyWrites />
            </RouteBox>
          }
        />
        <Route
          path="/mypage/activity/MyReplys"
          element={
            <RouteBox>
              <MypageSideMenu isDarkMode={isDarkMode} />
              <MyReplys />
            </RouteBox>
          }
        />
        <Route
          path="/mypage/activity/MyRecipes"
          element={
            <RouteBox>
              <MypageSideMenu isDarkMode={isDarkMode} />
              <MyRecipes />
            </RouteBox>
          }
        />
      </Route>

      {/* 관리자 */}
      <Route element={<ProtectRoleRouter />}>
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
          path="/admin/category/board"
          element={
            <RouteBox>
              <AdminSideMenu />
              <BoardCategoryManage />
            </RouteBox>
          }
        />
        <Route
          path="/admin/category/recipe"
          element={
            <RouteBox>
              <AdminSideMenu />
              <RecipeCategoryManage />
            </RouteBox>
          }
        />
      </Route>
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
