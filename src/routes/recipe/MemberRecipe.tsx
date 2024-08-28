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
  MemberRecipeView,
  recipeCommonStyles,
  TitleBox,
} from "../../styles/RecipeStyle";
import { useNavigate, useParams } from "react-router-dom";
import { KeyboardArrowUp } from "@mui/icons-material";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import RecipeCommentWriteBox from "./RecipeCommentWrite";
import RecipeCommentListBox from "./RecipeCommentList";
import { useQuery } from "react-query";
import { getPublicRecipe } from "../../api";

const MemberRecipe = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleRecipeListClick = () => {
    navigate("/recipe/member_recipe_list");
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

  return (
    <Wrapper>
      <MemberRecipeView>
        <Box component="section" padding={"20px 0"}>
          <TitleBox margin={"20px 0"}>
            <PageTitleBasic>
              {t("text.member_recipe")} &nbsp;
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
              "& > .MuiGrid-item": {
                padding: 0,
                margin: 0,
                width: 100,
              },
              ...customStyles.resetMuiGrid,
            }}
          >
            <Grid item xs={12} md={2} className="recipe-info-img-container">
              <Box
                component="img"
                className="recipe-info-img"
                alt="썸네일"
                src=""
              ></Box>
            </Grid>
            <Grid item xs={12} md={10}>
              <Box paddingBottom={1}>
                <PageSubTitleBasic>제목입니다링</PageSubTitleBasic>
              </Box>
              <Grid paddingBottom={1} container className="recipe-info-grid">
                <Grid item xs={12} md={2} className="recipe-info-grid-title">
                  <Typography variant="subtitle2">
                    {t("text.calories")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={10} className="recipe-info-grid-text">
                  <Typography variant="subtitle2">205kcal</Typography>
                </Grid>
                <Grid item xs={12} md={2} className="recipe-info-grid-title">
                  <Typography variant="subtitle2">
                    {t("text.cooking-method")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={10} className="recipe-info-grid-text">
                  <Typography variant="subtitle2">끓이기</Typography>
                </Grid>
                <Grid item xs={12} md={2} className="recipe-info-grid-title">
                  <Typography variant="subtitle2">
                    {t("text.category")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={10} className="recipe-info-grid-text">
                  <Typography variant="subtitle2">밥</Typography>
                </Grid>
                <Grid item xs={12} md={2} className="recipe-info-grid-title">
                  <Typography variant="subtitle2">
                    {t("text.serving")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={10} className="recipe-info-grid-text">
                  <Typography variant="subtitle2">1인분</Typography>
                </Grid>
                <Grid item xs={12} md={2} className="recipe-info-grid-title">
                  <Typography variant="subtitle2">
                    {t("text.difficulty-level")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={10} className="recipe-info-grid-text">
                  <Typography variant="subtitle2">쉬움</Typography>
                </Grid>
                <Grid item xs={12} md={2} className="recipe-info-grid-title">
                  <Typography variant="subtitle2">
                    {t("text.cooking-time")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={10} className="recipe-info-grid-text">
                  <Typography variant="subtitle2">30분</Typography>
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

          <Grid
            container
            spacing={2}
            sx={{
              borderTop: "1px solid",
              borderLeft: "1px solid",
              borderColor: "divider",
              ...customStyles.resetMuiGrid,
              "& > .MuiGrid-item": {
                borderRight: "1px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
                padding: "5px",
                width: 100,
              },
            }}
          >
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2">계란</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2">4개</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2">당근</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2">3개</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2">설탕</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2">찔끔</Typography>
            </Grid>
          </Grid>
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
              <Grid
                className="recipe-description-grid-img-container"
                item
                xs={12}
                md={2}
              >
                <Box
                  component="img"
                  className="recipe-description-grid-img"
                  alt="썸네일"
                  src=""
                ></Box>
              </Grid>
              <Grid
                className="recipe-description-grid-text-container"
                item
                xs={12}
                md={10}
              >
                <Typography variant="subtitle2">1.이렇게 만듭니다.</Typography>
              </Grid>
              <Grid
                className="recipe-description-grid-img-container"
                item
                xs={12}
                md={2}
              >
                <Box
                  component="img"
                  className="recipe-description-grid-img"
                  alt="썸네일"
                  src=""
                ></Box>
              </Grid>
              <Grid
                className="recipe-description-grid-text-container"
                item
                xs={12}
                md={10}
              >
                <Typography variant="subtitle2">2.이렇게 만듭니다.</Typography>
              </Grid>
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
              이렇게하는 좋은팁이 있습니다링
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box padding={"20px 0"}>
          <RecipeCommentWriteBox />
        </Box>
        <Box padding={"20px 0"}>
          <RecipeCommentListBox />
        </Box>
      </MemberRecipeView>
      {showScrollButton && (
        <ScrollBtnFab color="primary" size="small" onClick={scrollToTop}>
          <KeyboardArrowUp />
        </ScrollBtnFab>
      )}
    </Wrapper>
  );
};

export default MemberRecipe;
