import React, { useState, useEffect } from "react";
import { Box, Divider, Grid, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../../auth/AuthContext";
import { Wrapper, PageTitleBasic, TitleCenter, SearchArea } from "../../styles/CommonStyles";
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
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "react-query";

const MyRecipes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberId = user?.memberId;
  const [search, setSearch] = useState(""); //검색어
  const [searchType, setSearchType] = useState("title"); // 검색 유형
  const [searchParams, setSearchParams] = useSearchParams();
  const [triggerSearch, setTriggerSearch] = useState(true);
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref: lastItemRef, inView } = useInView({ threshold: 1 });

  const display = 10;

  // 검색 파라미터 URL 업데이트
  useEffect(() => {
    setSearchParams({
      search: search,
      searchType: searchType,
      // currentPage: currentPage.toString()
    });
  }, [search, searchType, setSearchParams]);

  // 데이터를 불러오는 API 호출 함수
  const getRecipeListApi = async () => {
    const writesData = await fetchMyRecipeList(
      memberId!, undefined, search, searchType
    ); 
    return writesData;
  };

  // 데이터 가져오기 시 로딩 상태 추가
  const getRecipeWithDelay = async () => {
    setLoading(true); // 로딩 상태 시작

    // 인위적인 지연 시간 추가
    await new Promise((resolve) => setTimeout(resolve, 100));

    const recipes= await getRecipeListApi(); // 데이터 불러오기

    setLoading(false);
    return recipes;
  };


  const {
    data: recipeList,
    isLoading: recipeListLoading,
    refetch,
  } = useQuery(["recipes"], getRecipeWithDelay, {
    enabled: triggerSearch, // 검색 트리거 활성화 시 쿼리 실행
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  // 트리거 변경 시 데이터 초기화 및 로딩 처리
  useEffect(() => {
    if (triggerSearch) {
      refetch(); // 데이터 가져오기
      setTriggerSearch(false); // 트리거를 false로 초기화
    }
  }, [triggerSearch, refetch]);

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    // setCurrentPage(1);
    setTriggerSearch(true); // 검색 트리거를 true로 설정하여 검색 실행
    refetch(); // refetch를 호출해 쿼리를 수동으로 실행
  };

  // 엔터 키로 검색 실행 핸들러
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleViewDetailClick = (path: string, params: string) => {
    const pullPath = `${path}/` + params;
    navigate(pullPath);
  };

    //로딩
    if (loading || recipeListLoading ) {
      return <Loading />;
    }
  

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
      <SearchArea>
        <TextField
          className="search-input"
          variant="standard"
          placeholder={t("sentence.searching")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown} // 엔터 키로 검색
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  // color="primary"
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
            ) : recipeList.length > 0 ? (
              <>
                {recipeList.map((recipeItem : any, index : any) => (
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
