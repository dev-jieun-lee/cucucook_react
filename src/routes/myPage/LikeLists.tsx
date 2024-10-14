import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Box,
  List,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useQuery } from "react-query";
import Loading from "../../components/Loading";
import LoadingNoMargin from "../../components/LoadingNoMargin";
import { TitleCenter, Wrapper, SearchArea } from "../../styles/CommonStyles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextsmsIcon from "@mui/icons-material/Textsms";
import StarIcon from "@mui/icons-material/Star";
import {
  ThumbnailBox,
  ThumbnailBoxContainer,
  ThumbnailButton,
} from "../../styles/RecipeStyle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SearchIcon from "@mui/icons-material/Search";
import { getRecipeLikeListOtherInfo } from "../../apis/mypageApi";
import ScrollTop from "../../components/ScrollTop";

const LikeLists = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberId = user?.memberId || 0; 

  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(""); // 검색어 상태
  const [triggerSearch, setTriggerSearch] = useState(false); // 검색 트리거 추가
  const { ref: lastItemRef, inView } = useInView({ threshold: 1 });
  const [searchParams, setSearchParams] = useSearchParams();

  const itemsPerPage = 12;

   // 검색 파라미터 URL 업데이트
  useEffect(() => {
    setSearchParams({
      search: search
      // currentPage: currentPage.toString()
    });
  }, [search, setSearchParams]);

  // 데이터 가져오기 함수
  const fetchData = async (page: number, keyword: string) => {
    
    // if (loading || isFetching) return; 
    setLoading(true);
    const startValue = (page - 1) * itemsPerPage;
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await getRecipeLikeListOtherInfo(
        memberId,
        "all",
        "reg_dt",
        itemsPerPage,
        startValue,
        search
      );
      if (response && response.length > 0) {
        setLikedRecipes((prevRecipes) =>
          triggerSearch ? response : [...prevRecipes, ...response]
        );
        setHasMore(response.length === itemsPerPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    } finally {
      setLoading(false);
      setIsFetching(false);
      setTriggerSearch(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (memberId !== 0) {
      fetchData(1, ""); // 처음 진입 시 검색어 없이 첫 페이지 데이터를 로드
    }
  }, [memberId]);

  // 무한 스크롤 감지 및 다음 페이지 요청
  useEffect(() => {
    if (inView && hasMore && !loading && !triggerSearch) {
      setIsFetching(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading, triggerSearch]);

  // currentPage가 업데이트될 때마다 fetchData 호출
  useEffect(() => {
    
    if (currentPage > 1) {
      fetchData(currentPage, search);
    }
  }, [currentPage]);

  // 검색 실행 시 데이터 초기화 및 리패치
  const handleSearchClick = () => {
    if (!memberId || memberId === 0) return;
    setHasMore(true);
    setCurrentPage(1);
    setTriggerSearch(true);
    setLikedRecipes([]);
    fetchData(1, search); // 검색어를 포함하여 첫 페이지부터 데이터 로드
  };

  // 검색 필드에서 Enter 키 입력 시 검색 실행
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleViewDetailClick = (path: string, params: string) => {
    const fullPath = `${path}/${params}`;
    navigate(fullPath);
  };

  return (
    <Wrapper>
      <Box component="section" sx={{ width: "100%" }}>
        <TitleCenter style={{ marginBottom: "30px" }}>
          <IconButton
            color="primary"
            aria-label="add"
            style={{ marginTop: "-5px" }}
            onClick={() => navigate("/mypage/activity")}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          {t("mypage.myLikes")}
        </TitleCenter>
        <SearchArea>
          <TextField
            className="search-input"
            variant="standard"
            placeholder={t("sentence.searching")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleSearchClick}
                    edge="end"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </SearchArea>
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
                    sx={{ flexDirection: "column" }}
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
      <ScrollTop />
    </Wrapper>
  );
};

export default LikeLists;
