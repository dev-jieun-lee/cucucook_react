import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useTranslation } from "react-i18next";
import { getBoardCategory, getBoardList } from "../../apis/boardApi";
import { useQuery } from "react-query";
import moment from "moment";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Wrapper } from "../../styles/CommonStyles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Loading from "../../components/Loading";
import {
  Banner,
  BannerButton,
  BannerLeft,
  BannerRight,
  GreetingsWrapper,
  MainCard,
  NoticeTable,
  Slogan,
  SloganButton,
} from "../../styles/MainStyle";
import { CustomCategory } from "../../styles/BoardStyle";

function Main({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 데이터를 불러오는 API 호출 함수
  const getBoardListApi = () => {
    const params = {
      search: "",
      searchType: "",
      boardCategoryId: "",
      start: 1,
      display: 10,
      division: "NOTICE",
    };
    return getBoardList(params);
  };

  //공지사항 데이터 가져오기
  const getBoardListWithCategory = async () => {
    try {
      const boardList = await getBoardListApi();
      // NOTICE일 경우만 필터링
      const filteredBoardList = boardList.data
        .filter((board: any) => board.boardDivision === "NOTICE")
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ); // 최신순 정렬

      // 상위 5개의 게시물만 가져오기
      const top5BoardList = filteredBoardList.slice(0, 5);

      // 각 보드의 카테고리 조회
      const boardListWithCategory = await Promise.all(
        top5BoardList.map(async (board: any) => {
          const categoryData = await getBoardCategory(board.boardCategoryId); // 카테고리 조회
          return {
            ...board,
            category: categoryData.data, // 카테고리 정보를 추가
          };
        })
      );
      return boardListWithCategory;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // 데이터 가져오기
  const { data: boardListWithCategory, isLoading: boardListLoading } = useQuery(
    "boardListWithCategory",
    getBoardListWithCategory
  );

  //공지사항 페이지로 이동
  const onClickNotice = (boardId?: string) => {
    if (boardId) {
      navigate(`/notice/${boardId}`);
    } else {
      navigate(`/notice`);
    }
  };
  //레시피 페이지로 이동
  const onClickRecipe = (kind: string) => {
    if (kind === "public") {
      navigate(`/recipe/public_recipe_list`);
    } else if (kind === "members") {
      navigate(`/recipe/member_recipe_list`);
    } else if (kind === "popular") {
      //      navigate(`/recipe/all_recipe_list`);
      navigate(`/recipe/member_recipe_list/like_count`);
    } else if (kind === "form") {
      navigate(`/recipe/member_recipe_write/:recipeId?`);
    }
  };

  //로딩
  if (boardListLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <Banner isDarkMode={isDarkMode}>
        <BannerLeft>
          <div className="card-area">
            <MainCard>
              <div>
                {isDarkMode ? (
                  <img src="/image/banner_icon_dark1.png" alt="main icon 1" />
                ) : (
                  <img src="/image/banner_icon_light1.png" alt="main icon 1" />
                )}
              </div>
              <div>
                <BannerButton
                  variant="contained"
                  color="secondary"
                  onClick={() => onClickRecipe("public")}
                >
                  {t("menu.recipe.public")}
                </BannerButton>
              </div>
            </MainCard>
            <MainCard>
              <div>
                {isDarkMode ? (
                  <img src="/image/banner_icon_dark2.png" alt="main icon 2" />
                ) : (
                  <img src="/image/banner_icon_light2.png" alt="main icon 2" />
                )}
              </div>
              <div>
                <BannerButton
                  variant="contained"
                  color="secondary"
                  onClick={() => onClickRecipe("members")}
                >
                  {t("menu.recipe.member")}
                </BannerButton>
              </div>
            </MainCard>
            <MainCard>
              <div>
                {isDarkMode ? (
                  <img src="/image/banner_icon_dark3.png" alt="main icon 3" />
                ) : (
                  <img src="/image/banner_icon_light3.png" alt="main icon 3" />
                )}
              </div>
              <div>
                <BannerButton
                  variant="contained"
                  color="secondary"
                  onClick={() => onClickRecipe("popular")}
                >
                  {t("menu.recipe.popularity")}
                </BannerButton>
              </div>
            </MainCard>
          </div>
          <GreetingsWrapper>
            <div className="greetings-wrapper">
              <span className="greetings">{t("sentence.greeting")}</span>
              <span className="greetings">{t("sentence.greeting")}</span>
              <span className="greetings">{t("sentence.greeting")}</span>
            </div>
          </GreetingsWrapper>
          <NoticeTable>
            <div className="title">
              <CampaignIcon className="noti-icon" />
              <span onClick={() => onClickNotice()}>
                {t("menu.board.notice")}
              </span>
            </div>
            <div className="notice-table">
              <TableContainer className="table-container" component={Paper}>
                <Table
                  className="table"
                  sx={{ minWidth: 650 }}
                  aria-label="board table"
                >
                  <TableHead className="head">
                    <TableRow>
                      <TableCell className="category-cell">
                        {t("text.category")}
                      </TableCell>
                      <TableCell className="title-cell">
                        {t("text.title")}
                      </TableCell>
                      <TableCell>{t("text.register_date")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {boardListWithCategory &&
                    boardListWithCategory.length > 0 ? (
                      boardListWithCategory.map(
                        (boardItem: any, index: number) => (
                          <TableRow
                            className="row"
                            key={index}
                            onClick={() => onClickNotice(boardItem.boardId)}
                          >
                            <TableCell className="cell">
                              <CustomCategory
                                style={{ color: `${boardItem.category.color}` }}
                                className="category"
                              >
                                [ {boardItem.category.name} ]
                              </CustomCategory>
                            </TableCell>
                            <TableCell className="cell">
                              {boardItem.title}
                            </TableCell>
                            <TableCell className="cell">
                              {moment(boardItem.udtDt).format("YYYY-MM-DD")}
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          {t("sentence.no_data")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </NoticeTable>
          <div className="slogan-main">
            <SloganMain />
          </div>
        </BannerLeft>
        <BannerRight>
          <SloganMain />
        </BannerRight>
      </Banner>
    </Wrapper>
  );
}

export default Main;

function SloganMain() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth(); //로그인 상태관리
  //레시피 페이지로 이동
  const onClickRecipe = () => {
    if (user) {
      navigate(`/recipe/member_recipe_write`);
    } else {
      navigate(`/login`);
    }
  };
  return (
    <>
      <Slogan>
        <div className="box1">
          <span className="strong">Cook</span>
          <span className="basic">{t("sentence.slogan")}</span>
        </div>
        <div className="box2">
          <span className="strong">Cucu</span>
          <span className="basic">{t("sentence.slogan2")}</span>
        </div>
        <div className="box3">
          <span className="strong">{t("sentence.cucucook")}</span>
          <span className="basic">{t("sentence.slogan3")}</span>
        </div>
      </Slogan>
      <SloganButton
        className="icon-btn"
        variant="outlined"
        color="secondary"
        onClick={() => onClickRecipe()}
        endIcon={<KeyboardDoubleArrowRightIcon />}
      >
        {t("text.go_upload")}
      </SloganButton>
    </>
  );
}
