import { Button, Card, Typography } from "@mui/material";
import React from "react";
import {
  Banner,
  BannerButton,
  BannerLeft,
  BannerRight,
  MainCard,
  MainWrapper,
  NoticeTable,
  Slogan1,
  Slogan2,
  SloganButton,
} from "./MainStyle";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useTranslation } from "react-i18next";
import { getBoardCategory, getBoardList } from "../board/api";
import { useQuery } from "react-query";

function Main({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();

  // 데이터를 불러오는 API 호출 함수
  const getBoardListApi = () => {
    const params = {
      division: "NOTICE",
      search: "",
      searchType: "",
      boardCategoryId: "",
      start: 1,
      display: 10,
    };
    return getBoardList(params);
  };

  //공지사항 데이터 가져오기
  const getBoardListWithCategory = async () => {
    try {
      const boardList = await getBoardListApi();
      //NOTICE일 경우만 필터링
      const filteredBoardList = boardList.data.filter(
        (board: any) => board.boardDivision === "NOTICE"
      );
      // 각 보드의 카테고리 조회
      const boardListWithCategory = await Promise.all(
        filteredBoardList.map(async (board: any) => {
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

  return (
    <MainWrapper>
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
                <BannerButton variant="contained" color="secondary">
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
                <BannerButton variant="contained" color="secondary">
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
                <BannerButton variant="contained" color="secondary">
                  {t("menu.recipe.popularity")}
                </BannerButton>
              </div>
            </MainCard>
          </div>
          <NoticeTable>
            <div className="title">{t("menu.board.notice")}</div>
          </NoticeTable>
          {/* <Slogan1>
            <h3>Cook Up the Fun, Stir Up the Flavor!</h3>
            <small>기존 레시피 : </small> <br />
            <small>회원 레시피 : 회원들이 직접 등록한 레시피입니다.</small>
            <br />
            <small>인기 레시피 : 인기 레시피입니다.</small>
          </Slogan1> */}
          <div className="slogan-main">
            <SloganMain />
          </div>
        </BannerLeft>
        <BannerRight>
          <SloganMain />
        </BannerRight>
      </Banner>
    </MainWrapper>
  );
}

export default Main;

function SloganMain() {
  const { t } = useTranslation();
  return (
    <>
      <Slogan2>
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
      </Slogan2>
      <SloganButton
        className="icon-btn"
        variant="outlined"
        color="secondary"
        endIcon={<KeyboardDoubleArrowRightIcon />}
      >
        {t("text.go_upload")}
      </SloganButton>
    </>
  );
}
