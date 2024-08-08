import { Button, Card, Typography } from "@mui/material";
import React from "react";
import {
  Banner,
  BannerButton,
  BannerLeft,
  BannerRight,
  MainCard,
  MainWrapper,
  RecipeWrapper,
  Slogan1,
  Slogan2,
} from "./MainStyle";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useTranslation } from "react-i18next";

function Main({ isDarkMode }: { isDarkMode: boolean }) {
  //데이터 받아오기
  // const { data: publicRecipe, isLoading: publicRecipeLoading } =
  //   useQuery("movies", () => getPublicRecipe());
  //   console.log(publicRecipe);
  const { t } = useTranslation();

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
          <Slogan1>
            <h3>Cook Up the Fun, Stir Up the Flavor!</h3>
            <small>기존 레시피 : </small> <br />
            <small>회원 레시피 : 회원들이 직접 등록한 레시피입니다.</small>
            <br />
            <small>인기 레시피 : 인기 레시피입니다.</small>
          </Slogan1>
        </BannerLeft>
        <BannerRight>
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
          <Button
            variant="outlined"
            color="secondary"
            endIcon={<KeyboardDoubleArrowRightIcon />}
          >
            {t("text.go_upload")}
          </Button>
        </BannerRight>
      </Banner>
      <RecipeWrapper></RecipeWrapper>
    </MainWrapper>
  );
}

export default Main;
