import React, { useState, useEffect } from "react";
import { Box, Divider, Grid, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../../auth/AuthContext";
import {
  Wrapper,
  PageTitleBasic,
  TitleCenter,
} from "../../styles/CommonStyles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextsmsIcon from "@mui/icons-material/Textsms";
import StarIcon from "@mui/icons-material/Star";
import {
  ThumbnailBox,
  ThumbnailBoxContainer,
  ThumbnailButton,
  TitleBox,
} from "../../styles/RecipeStyle";
import Loading from "../../components/Loading";
import LoadingNoMargin from "../../components/LoadingNoMargin";
import { fetchMyRecipeList } from "../../apis/mypageApi";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const MyRecipes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberId = user?.memberId;

  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref: lastItemRef, inView } = useInView({ threshold: 1 });

  const display = 10;

  const fetchData = async () => {
    if (loading || !hasMore) return; // 중복 호출 방지 조건
    setLoading(true);

    if (!memberId) {
      console.error("memberId is undefined");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchMyRecipeList(memberId, undefined); // 모든 레시피를 가져오도록 null 전달

      if (response && response.length > 0) {
        setLikedRecipes(response); // 모든 레시피로 업데이트
      } else {
        setHasMore(false); // 더 이상 데이터가 없으면 hasMore를 false로 설정
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    if (memberId) {
      fetchData(); // 페이지 진입 시 한 번 호출
    }
  }, [memberId]); // memberId가 변경될 때만 호출

  const handleViewDetailClick = (path: string, params: string) => {
    const pullPath = `${path}/` + params;
    navigate(pullPath);
  };
  return (
    <Wrapper>
      <Box component="section" sx={{ width: "100%" }}>
        <TitleCenter style={{ marginBottom: "30px" }}>
          <Tooltip title={t("text.go_back")}>
            <IconButton
              color="primary"
              aria-label="add"
              style={{ marginTop: "-5px" }}
              onClick={() => navigate("/mypage/activity")}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Tooltip>
          {t("mypage.myRecipe")}
        </TitleCenter>

        <Box component="section" sx={{ width: "100%" }}>
          <Grid container spacing={2}>
            {loading && !hasMore ? (
              <Loading />
            ) : likedRecipes.length > 0 ? (
              <>
                {likedRecipes.map((recipeItem, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={`${recipeItem.recipeId}-${index}`}
                    sx={{ flexDirection: "column" }} // 필요한 경우 추가
                  >
                    <ThumbnailButton
                      onClick={() =>
                        handleViewDetailClick(
                          "/recipe/member_recipe",
                          encodeURIComponent(recipeItem.recipeId)
                        )
                      }
                    >
                      <Box className="thumbnail-box-wrap">
                        <ThumbnailBoxContainer>
                          <ThumbnailBox
                            src={
                              recipeItem.memberRecipeImages
                                ? `${process.env.REACT_APP_API_URL}${recipeItem.memberRecipeImages.webImgPath}/${recipeItem.memberRecipeImages.serverImgName}.${recipeItem.memberRecipeImages.extension}`
                                : "https://via.placeholder.com/300/ffffff/F3B340?text=No+Image"
                            }
                            alt={recipeItem.title}
                          />
                        </ThumbnailBoxContainer>
                        <Box className="thumbnail-info-box-wrap">
                          <Box margin={"20px"}>
                            <Box className="thumbnail-info-title-box">
                              {recipeItem.title}
                            </Box>
                            <Box>
                              <Grid
                                container
                                className="thumbnail-info-default-box"
                              >
                                <Grid item>{recipeItem.member.name}</Grid>
                                <Grid item>
                                  <Grid container spacing={1}>
                                    <Grid item>
                                      <Box display="flex" alignItems="center">
                                        <VisibilityIcon
                                          style={{
                                            verticalAlign: "middle",
                                            fontSize: "0.9rem",
                                          }}
                                        />
                                        <Box component="span" ml={0.5}>
                                          {recipeItem.viewCount}
                                        </Box>
                                      </Box>
                                    </Grid>
                                    <Grid item>
                                      <Divider
                                        className="recipe-eval-info"
                                        orientation="vertical"
                                        sx={{ height: "20px" }}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Box display="flex" alignItems="center">
                                        <TextsmsIcon
                                          style={{
                                            verticalAlign: "middle",
                                            fontSize: "0.9rem",
                                          }}
                                        />
                                        <Box component="span" ml={0.5}>
                                          {recipeItem.commentCount}
                                        </Box>
                                      </Box>
                                    </Grid>
                                    <Grid item>
                                      <Divider
                                        className="recipe-eval-info"
                                        orientation="vertical"
                                        sx={{ height: "20px" }}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Box display="flex" alignItems="center">
                                        <StarIcon
                                          style={{
                                            verticalAlign: "middle",
                                            fontSize: "0.9rem",
                                          }}
                                        />
                                        <Box component="span" ml={0.5}>
                                          {recipeItem.commentRate}
                                        </Box>
                                      </Box>
                                    </Grid>
                                    <Grid item>
                                      <Divider
                                        className="recipe-eval-info"
                                        orientation="vertical"
                                        sx={{ height: "20px" }}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Box display="flex" alignItems="center">
                                        <FavoriteIcon
                                          style={{
                                            verticalAlign: "middle",
                                            fontSize: "0.9rem",
                                          }}
                                        />
                                        <Box component="span" ml={0.5}>
                                          {recipeItem.likeCount}
                                        </Box>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </ThumbnailButton>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  {hasMore && <LoadingNoMargin />}
                </Grid>
                <Box ref={lastItemRef} />
              </>
            ) : (
              <Grid padding={"20px 0"} item xs={12}>
                {loading ? <Loading /> : <>No data found.</>}
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Wrapper>
  );
};

export default MyRecipes;
