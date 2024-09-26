import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../../auth/AuthContext";
import { fetchMyRecipeList } from "./api";
import { Wrapper, PageTitleBasic } from "../../styles/CommonStyles";
import {
  ThumbnailBox,
  ThumbnailBoxContainer,
  ThumbnailButton,
  TitleBox,
} from "../../styles/RecipeStyle";
import Loading from "../../components/Loading";
import LoadingNoMargin from "../../components/LoadingNoMargin";

const MyRecipes = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberId = user?.memberId;

  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const display = 10;
  const { ref: lastItemRef, inView } = useInView({ threshold: 1 });

  const fetchData = async () => {
    if (loading || isFetching || !hasMore) return; // 중복 호출 방지 조건
    setLoading(true);
    setIsFetching(true);

    if (!memberId) {
      console.error("memberId is undefined");
      setLoading(false);
      setIsFetching(false);
      return;
    }

    try {
      const response = await fetchMyRecipeList(memberId, 5);

      if (response && response.length > 0) {
        setLikedRecipes((prevRecipes) => [...prevRecipes, ...response]);
      } else {
        setHasMore(false); // 더 이상 데이터가 없으면 hasMore를 false로 설정
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 로딩 종료
      setIsFetching(false); // 호출 완료 상태로 변경
    }
  };

  useEffect(() => {
    if (memberId) {
      fetchData(); // memberId가 유효할 때만 fetchData 호출
    }
  }, [memberId, start]); // memberId 또는 start가 변경될 때만 호출

  useEffect(() => {
    if (inView && hasMore && !loading && !isFetching) {
      setStart((prevStart) => prevStart + display); // 다음 데이터 요청
    }
  }, [inView, hasMore, loading, isFetching]); // 추가적인 상태 추가

  return (
    <Wrapper>
      <Box component="section" sx={{ width: "100%" }}>
        <TitleBox>
          <PageTitleBasic>{t("mypage.liked_recipes")}</PageTitleBasic>
        </TitleBox>

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
                  >
                    <ThumbnailButton
                      onClick={() =>
                        navigate(`/recipe/member_recipe/${recipeItem.recipeId}`)
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
