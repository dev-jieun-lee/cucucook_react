import { KeyboardArrowUp } from "@mui/icons-material";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "styled-components";
import { getPublicRecipe } from "./recipeApi";
import Loading from "../../components/Loading";
import {
  PageSubTitleBasic,
  PageTitleBasic,
  ScrollBtnFab,
  Wrapper,
} from "../../styles/CommonStyles";
import {
  RecipeView,
  RecepiImgBox,
  RecepiImgBoxContainer,
  recipeCommonStyles,
  TitleBox,
} from "./RecipeStyle";

const PublicRecipe = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const customStyles = recipeCommonStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation(); //번역
  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);

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

  const handleRecipeListClick = () => {
    navigate(-1);
  };

  // 파라미터 받아오기
  const { search, display, start } = useParams();

  // 공공상세 레시피 가져오기
  const fetchPublicRecipe = async () => {
    const params = { search, display, start };
    try {
      const publicRecipe = await getPublicRecipe(params);
      return publicRecipe.data;
    } catch (error) {
      console.error(error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };
  const { data: publicRecipe, isLoading: publicRecipeLoading } = useQuery(
    "publicRecipe",
    fetchPublicRecipe,
    {
      refetchOnWindowFocus: false,
      onSuccess: () => {
        // 데이터가 성공적으로 로드되면 로딩 상태를 false로 설정
        setLoading(false);
      },
      onError: (err) => {
        console.error(err);
        alert(err);
        setLoading(false);
      },
      keepPreviousData: true, // 페이지를 이동할 때 이전 데이터 유지
    }
  );

  // 메뉴얼 필드 이름 생성을 위함
  const manualFields = Array.from(
    { length: 20 },
    (_, i) => `${String(i + 1).padStart(2, "0")}`
  );

  return (
    <Wrapper>
      {
        <RecipeView>
          <Box component="section" sx={{ width: "100%" }} padding={"20px 0"}>
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
          {loading || publicRecipeLoading ? (
            <Loading />
          ) : publicRecipe?.data ? (
            <>
              {/* 요리정보 */}
              <Box className="recipe-info-container" padding={"20px 0"}>
                <Grid container spacing={2} sx={{}}>
                  <Grid item xs={12} md={6}>
                    <RecepiImgBoxContainer className="recipe-info-img-container">
                      <RecepiImgBox
                        className="recipe-info-img"
                        alt={publicRecipe.data.rcpNm}
                        src={publicRecipe.data.attFileNoMk}
                      ></RecepiImgBox>
                    </RecepiImgBoxContainer>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box paddingBottom={1}>
                      <PageSubTitleBasic>
                        {publicRecipe.data.rcpNm}
                      </PageSubTitleBasic>
                    </Box>
                    <Grid
                      paddingBottom={1}
                      container
                      className="recipe-info-grid"
                    >
                      <Grid
                        item
                        xs={12}
                        md={2}
                        className="recipe-info-grid-title"
                      >
                        <Typography variant="subtitle2">
                          {t("text.calories")}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={10}
                        className="recipe-info-grid-text"
                      >
                        <Typography variant="subtitle2">
                          {publicRecipe.data.infoEng}kcal
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={2}
                        className="recipe-info-grid-title"
                      >
                        <Typography variant="subtitle2">
                          {t("text.cooking-method")}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={10}
                        className="recipe-info-grid-text"
                      >
                        <Typography variant="subtitle2">
                          {publicRecipe.data.rcpWay2}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={2}
                        className="recipe-info-grid-title"
                      >
                        <Typography variant="subtitle2">
                          {t("text.category")}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={10}
                        className="recipe-info-grid-text"
                      >
                        <Typography variant="subtitle2">
                          {publicRecipe.data.rcpPat2}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={2}
                        className="recipe-info-grid-title"
                      >
                        <Typography variant="subtitle2">
                          {t("text.serving")}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={10}
                        className="recipe-info-grid-text"
                      >
                        <Typography variant="subtitle2">1</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              {/* 재료 */}
              <Box padding={"20px 0"}>
                <Box paddingBottom={1}>
                  <PageSubTitleBasic>{t("text.ingredient")}</PageSubTitleBasic>
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  {publicRecipe.data.rcpPartsDtls}
                </Box>
              </Box>
              <Divider />
              {/* 레시피 */}
              <Box padding={"20px 0"}>
                <Box paddingBottom={1}>
                  <PageSubTitleBasic>{t("text.recipe")}</PageSubTitleBasic>
                </Box>
                <Box>
                  {manualFields.map((field) => {
                    const manualText =
                      publicRecipe.data["manual" + field] || "";
                    const manualImage =
                      publicRecipe.data["manualImg" + field] || "";

                    return manualText ? ( // 값이 존재할 경우에만 출력
                      <Grid
                        className="recipe-description-grid-container"
                        container
                        spacing={2}
                        sx={{
                          ...customStyles.resetMuiGrid,
                          "& > .MuiGrid-item": {
                            borderColor: "divider",
                            padding: "5px",
                          },
                          margin: "10px",
                        }}
                        key={field}
                      >
                        <Grid
                          className="recipe-description-grid-img-container"
                          item
                          xs={12}
                          md={2}
                        >
                          <RecepiImgBoxContainer>
                            <RecepiImgBox
                              className="recipe-info-img"
                              alt={publicRecipe.data.rcpNm}
                              src={manualImage}
                            ></RecepiImgBox>
                          </RecepiImgBoxContainer>
                        </Grid>
                        <Grid
                          className="recipe-description-grid-text-container"
                          item
                          xs={12}
                          md={10}
                        >
                          <Typography variant="subtitle1">
                            {manualText}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : null;
                  })}
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
                    {publicRecipe.data.rcpNaTip}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </>
          ) : (
            <Grid component="div" padding={"20px 0"} textAlign={"left"}>
              {publicRecipe.message
                .replace('<script type="text/javascript">alert(\'', "")
                .replace("'); history.back();</script>", "")}
            </Grid>
          )}
          <Box padding={"20px 0"}></Box>
        </RecipeView>
      }
      {showScrollButton && (
        <ScrollBtnFab color="primary" size="small" onClick={scrollToTop}>
          <KeyboardArrowUp />
        </ScrollBtnFab>
      )}
    </Wrapper>
  );
};

export default PublicRecipe;
