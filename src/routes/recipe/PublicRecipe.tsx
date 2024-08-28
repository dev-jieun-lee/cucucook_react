import React, { useEffect, useState } from "react";
import {
  PageSubTitleBasic,
  PageTitleBasic,
  ScrollBtnFab,
  Wrapper,
} from "../../styles/CommonStyles";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import {
  PublicRecipeView,
  recipeCommonStyles,
  ThumbnailBox,
  ThumbnailBoxContainer,
  ThumbnailTypography,
  TitleBox,
} from "../../styles/RecipeStyle";
import { useNavigate, useParams } from "react-router-dom";
import { KeyboardArrowUp } from "@mui/icons-material";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import RecipeCommentWriteBox from "./RecipeCommentWrite";
import RecipeCommentListBox from "./RecipeCommentList";
import { getPublicRecipe } from "../../api";
import { useQuery } from "react-query";
import Loading from "../../components/Loading";
import { useSearchParams } from "react-router-dom";

const PublicRecipe = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleRecipeListClick = () => {
    navigate("/recipe/public_recipe_list");
  };

  const [query] = useSearchParams();
  const search = query.get("search") || "";
  const encodedSearch = encodeURIComponent(search);
  const fetchPublicRecipe = () => {
    const params = {
      search: encodedSearch, // search 값이 없을 경우 빈 문자열을 사용
      start: "1",
      display: "1",
    };

    return getPublicRecipe(params); // 데이터 가져오기
  };

  // React Query를 사용하여 데이터 가져오기
  const { data: publicRecipe, isLoading: publicRecipeLoading } = useQuery(
    ["publicRecipe", encodedSearch],
    fetchPublicRecipe
  );

  // 받아온 레시피 과정 갯수 20개
  const maxFields = 20;

  // 필드 이름 생성
  const manualFields = Array.from(
    { length: maxFields },
    (_, i) => `${String(i + 1).padStart(2, "0")}`
  );

  if (!(publicRecipe && publicRecipe.success)) {
    navigate("/recipe/public_recipe_list");
  }

  // 데이터를 줄바꿈 기준으로 분리
  const getPartsDetails = (details: string) => {
    return details ? details.split("\n") : [];
  };

  // 짝수 데이터만 필터링
  const getEvenIndexDetails = (details: string) => {
    const parts = getPartsDetails(details);
    return parts.filter((_, index) => index % 2 === 0);
  };

  // 짝수 다음데이터 잘라서 넣어주기
  const getNextIndexDetails = (details: string, index: number) => {
    const parts = getPartsDetails(details)[2 * index + 1];
    return parts ? parts.split(",") : [];
  };

  // 스페이스로 잘라서 재료 넣어주기
  const getIngredientIndexDetails = (ingredient: string) => {
    console.log(ingredient);
    const lastSpaceIndex = ingredient.trim().lastIndexOf(" ");

    if (lastSpaceIndex === -1) {
      return [ingredient.trim()]; // 스페이스가 없으면 원래 문자열을 배열로 반환
    }

    return [
      ingredient.trim().substring(0, lastSpaceIndex),
      ingredient.trim().substring(lastSpaceIndex + 1),
    ];
  };

  const customStyles = recipeCommonStyles();
  const theme = useTheme();

  const [showScrollButton, setShowScrollButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //로딩
  if (publicRecipeLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <PublicRecipeView>
        <Box component="section" padding={"20px 0"}>
          <TitleBox margin={"20px 0"}>
            <PageTitleBasic>
              {t("text.public_recipe")} &nbsp;
              {t("text.detail_more")}
            </PageTitleBasic>
            <Button variant="contained" onClick={handleRecipeListClick}>
              {t("text.list")}
            </Button>
          </TitleBox>
        </Box>
        <Divider />
        <Box className="recipe-info-container" padding={"20px 0"}>
          <Grid
            container
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid item xs={12} md={2} className="recipe-info-img-container">
              <ThumbnailBoxContainer>
                <ThumbnailBox
                  className="recipe-info-img"
                  alt={publicRecipe.data.rcpNm}
                  src={publicRecipe.data.attFileNoMk}
                ></ThumbnailBox>
              </ThumbnailBoxContainer>
            </Grid>
            <Grid item xs={12} md={10}>
              <Box paddingBottom={1}>
                <PageSubTitleBasic>{publicRecipe.data.rcpNm}</PageSubTitleBasic>
              </Box>
              <Grid paddingBottom={1} container className="recipe-info-grid">
                <Grid item xs={12} md={2} className="recipe-info-grid-title">
                  <Typography variant="subtitle2">
                    {t("text.calories")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={10} className="recipe-info-grid-text">
                  <Typography variant="subtitle2">
                    {publicRecipe.data.infoEng}kcal
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2} className="recipe-info-grid-title">
                  <Typography variant="subtitle2">
                    {t("text.cooking-method")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={10} className="recipe-info-grid-text">
                  <Typography variant="subtitle2">
                    {publicRecipe.data.rcpWay2}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2} className="recipe-info-grid-title">
                  <Typography variant="subtitle2">
                    {t("text.category")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={10} className="recipe-info-grid-text">
                  <Typography variant="subtitle2">
                    {publicRecipe.data.rcpPat2}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2} className="recipe-info-grid-title">
                  <Typography variant="subtitle2">
                    {t("text.serving")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={10} className="recipe-info-grid-text">
                  <Typography variant="subtitle2">1</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box padding={"20px 0"}>
          <Box paddingBottom={1}>
            <PageSubTitleBasic>{t("text.ingredient")}</PageSubTitleBasic>
          </Box>
          {getEvenIndexDetails(publicRecipe.data.rcpPartsDtls).map(
            (item, index) => (
              <>
                <Typography
                  component="li"
                  textAlign={"left"}
                  key={index}
                  marginTop={1}
                  marginBottom={1}
                >
                  {item}
                </Typography>
                <Grid
                  container
                  sx={{
                    borderLeft: "1px solid",
                    borderColor: "divider",
                    ...customStyles.resetMuiGrid,
                    "& > .MuiGrid-item": {
                      borderTop: "1px solid",
                      borderRight: "1px solid",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      padding: "5px",
                      width: "100%",
                    },
                  }}
                >
                  {getNextIndexDetails(
                    publicRecipe.data.rcpPartsDtls,
                    index
                  ).map((itemNext, indexNext) => (
                    <>
                      {getIngredientIndexDetails(itemNext).map(
                        (itemIngredient, indexIngredient) => (
                          <Grid item xs={6} md={3} key={indexIngredient}>
                            <Typography variant="subtitle2">
                              {itemIngredient}
                            </Typography>
                          </Grid>
                        )
                      )}
                    </>
                  ))}
                </Grid>
              </>
            )
          )}
        </Box>
        <Divider />
        <Box padding={"20px 0"}>
          <Box paddingBottom={1}>
            <PageSubTitleBasic>{t("text.recipe")}</PageSubTitleBasic>
          </Box>
          <Box>
            <Grid
              className="recipe-description-grid-container"
              container
              spacing={2}
              sx={{
                ...customStyles.resetMuiGrid,
                "& > .MuiGrid-item": {
                  borderColor: "divider",
                  padding: "5px",
                  width: 100,
                },
              }}
            >
              {manualFields.map((field) => {
                // 현재 필드의 값을 가져오기
                const manualText = publicRecipe.data["manual" + field] || "";
                const manualImage =
                  publicRecipe.data["manualImg" + field] || "";

                return manualText ? ( // 값이 존재할 경우에만 출력
                  <>
                    <Grid
                      className="recipe-description-grid-img-container"
                      item
                      xs={12}
                      md={2}
                    >
                      <ThumbnailBoxContainer>
                        <ThumbnailBox
                          className="recipe-info-img"
                          alt={publicRecipe.data.rcpNm}
                          src={manualImage}
                        ></ThumbnailBox>
                      </ThumbnailBoxContainer>
                    </Grid>
                    <Grid
                      className="recipe-description-grid-text-container"
                      item
                      xs={12}
                      md={10}
                    >
                      <Typography variant="subtitle1">{manualText}</Typography>
                    </Grid>
                  </>
                ) : null;
              })}
            </Grid>
          </Box>
        </Box>
        <Divider />
        <Box padding={"20px 0"}>
          <Box paddingBottom={1}>
            <PageSubTitleBasic>
              <TipsAndUpdatesIcon
                sx={{ verticalAlign: "middle", color: theme.mainColor }}
              />{" "}
              <Box component="span">{t("text.tip")}</Box>
            </PageSubTitleBasic>
          </Box>
          <Box>
            <Typography sx={{ textAlign: "left" }} variant="subtitle1">
              {publicRecipe.data["rcpNaTip"]}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box padding={"20px 0"}></Box>
      </PublicRecipeView>
      {showScrollButton && (
        <ScrollBtnFab color="primary" size="small" onClick={scrollToTop}>
          <KeyboardArrowUp />
        </ScrollBtnFab>
      )}
    </Wrapper>
  );
};

export default PublicRecipe;
