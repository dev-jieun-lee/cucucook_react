import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import TextsmsIcon from "@mui/icons-material/Textsms";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteMemberRecipeLike,
  getMemberRecipeList,
  getRecipeCategoryListWithMemberRecipeCount,
  insertMemberRecipeLike,
} from "../../apis/recipeApi";
import { useAuth } from "../../auth/AuthContext";
import Loading from "../../components/Loading";
import LoadingNoMargin from "../../components/LoadingNoMargin";
import ScrollTop from "../../components/ScrollTop";
import { handleApiError } from "../../hooks/errorHandler";
import { PageTitleBasic, SearchArea, Wrapper } from "../../styles/CommonStyles";
import {
  SearchBox,
  SearchBoxContainer,
  ThumbnailBox,
  ThumbnailBoxContainer,
  ThumbnailButton,
  TitleBox,
} from "../../styles/RecipeStyle";
const MemberRecipe = ({ isDarkMode }: { isDarkMode: boolean }) => {
  // 파라미터 받아오기
  const { order } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(t("text.recent_order"));
  const [selectedOrderKey, setSelectedOrderKey] = useState("reg_dt");
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);
  // 무한 스크롤 시작값
  const [start, setStart] = useState(0);
  // 무한 스크롤 데이터가 더 있는지 체크
  const [hasMore, setHasMore] = useState(true);
  // 레시피 정보
  const [recipes, setRecipes] = useState<any[]>([]);

  const display = 10;
  const [message, setMessage] = useState("");

  const orderMap: { [key: string]: string } = {
    reg_dt: t("text.recent_order"),
    view_count: t("text.count_order"),
    comment_count: t("text.comment_order"),
    comment_rate: t("text.rate_order"),
    like_count: t("text.like_order"),
  };

  useEffect(() => {
    if (order) {
      setSelectedOrder(orderMap[order]);
      setSelectedOrderKey(order);
    }
  }, []);

  //마지막 항목이 화면에 보일때 마다 새로운 페이지 데이터 로드
  const { ref: lastItemRef, inView } = useInView({
    threshold: 1,
  });
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setStart((prevStart) => prevStart + display);
    }
  }, [inView, hasMore, loading]);

  const handleViewDetailClick = (path: string, params: string) => {
    const pullPath = `${path}/` + params;
    navigate(pullPath);
  };

  // 레시피 카테고리 목록 가져오기
  const fetchRecipeCategoryList = async () => {
    const params = {
      search: searchTerm,
    };

    try {
      const recipeCategoryList =
        await getRecipeCategoryListWithMemberRecipeCount(params);
      return recipeCategoryList.data;
    } catch (error) {
      handleApiError(error, navigate, t);
      //return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const { refetch: refetchCategories } = useQuery(
    ["recipeCategoryList"],
    fetchRecipeCategoryList,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data && data.success) setcategories(data.data);
      },
      onError: (error) => {
        handleApiError(error, navigate, t);
      },
    }
  );

  // 레시피 목록 가져오기
  const fetchMemberRecipeList = async () => {
    const params = {
      search: searchTerm,
      start: start,
      display: display,
      recipeCategoryId: selectedCategoryKey,
      orderby: selectedOrderKey,
      memberId: user?.memberId,
    };

    try {
      const memberRecipeList = await getMemberRecipeList(params);
      return memberRecipeList.data;
    } catch (error) {
      handleApiError(error, navigate, t);
    }
  };

  const { refetch } = useQuery(
    ["memberRecipeList", selectedCategoryKey, selectedOrderKey, start],
    fetchMemberRecipeList,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data && data.success) {
          setLoading(false);
          setHasMore(data?.addData?.hasMore ?? false);

          const finalData = (data?.data ?? []).map((recipeItem: any) => ({
            ...recipeItem,
            isLike: recipeItem.memberRecipeLike || false,
          }));

          setRecipes((prevRecipes) => [...prevRecipes, ...(finalData ?? [])]);
          setMessage(data.message);
        }
      },
      onError: (error) => {
        setLoading(false);
        handleApiError(error, navigate, t);
      },
    }
  );

  const handleSearch = async () => {
    // 시작값 초기화
    setStart(0);
    // 데이터 가져와야 함
    setHasMore(true);
    // 레시피 목록 초기화
    setRecipes([]);

    await refetch();
  };

  const handleSearchKeyUp = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
      // 카테고리 목록 초기화
      setcategories([]);
      await refetchCategories();
    }
  };

  //카테고리 선택시
  const handleCategoryClick = async (name: string, categoryId: string) => {
    setSelectedCategory(name);
    setSelectedCategoryKey(categoryId);
    setStart(0);
    setRecipes([]);
    setHasMore(true);
    setLoading(true);
    await refetch();
  };

  //순서선택시
  const handleOrderClick = async (order: string, key: string) => {
    setSelectedOrder(order);
    setSelectedOrderKey(key);
    setStart(0);
    setRecipes([]);
    setHasMore(true);
    setLoading(true);
    await refetch();
  };

  const handleRecipeWriteClick = () => {
    navigate("/recipe/member_recipe_write");
  };

  //좋아요등록
  const { mutate: insertMemberRecipeLikeMutation } = useMutation(
    (recipeId: string) => {
      const params = { recipeId, memberId: user?.memberId };
      return insertMemberRecipeLike(params);
    },
    {
      onSuccess: (data, recipeId) => {
        if (data && data.success) {
          setRecipes((prevRecipes) =>
            prevRecipes.map((recipeItem) =>
              recipeItem.recipeId === recipeId
                ? {
                    ...recipeItem,
                    isLike: true,
                    likeCount: data.data,
                  }
                : recipeItem
            )
          );
        }
      },
      onError: (error) => {
        handleApiError(error, navigate, t);
      },
    }
  );

  //좋아요삭제
  const { mutate: deleteMemberRecipeLikeMutation } = useMutation(
    (recipeId: string) => {
      const params = { recipeId, memberId: user?.memberId };
      return deleteMemberRecipeLike(params);
    },
    {
      onSuccess: (data, recipeId) => {
        if (data && data.success) {
          setRecipes((prevRecipes) =>
            prevRecipes.map((recipeItem) =>
              recipeItem.recipeId === recipeId
                ? {
                    ...recipeItem,
                    isLike: false,
                    likeCount: data.data,
                  }
                : recipeItem
            )
          );
        }
      },
      onError: (error) => {
        handleApiError(error, navigate, t);
      },
    }
  );

  const handleLikeClick = (recipeId: string, isLike: boolean) => {
    if (!isLike) {
      insertMemberRecipeLikeMutation(recipeId);
    } else {
      deleteMemberRecipeLikeMutation(recipeId);
    }
  };

  return (
    <Wrapper>
      <Box component="section" sx={{ width: "100%" }}>
        <TitleBox>
          <PageTitleBasic>{t("text.member_recipe")}</PageTitleBasic>
        </TitleBox>
        <Divider />

        <SearchBoxContainer>
          <SearchArea>
            <TextField
              className="search-input"
              variant="standard"
              placeholder={t("sentence.searching")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={handleSearchKeyUp}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      // color="primary"
                      aria-label={t("sentence.searching")}
                      onClick={handleSearch}
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </SearchArea>
          <SearchBox>
            <Stack
              direction="row"
              flexWrap="wrap"
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ height: "15px", alignSelf: "center" }}
                />
              }
              sx={{
                "& .MuiButton-root": {
                  marginLeft: "0",
                },
              }}
            >
              {categories.map((category) => (
                <Button
                  key={category.recipeCategoryId}
                  variant="text"
                  sx={{
                    backgroundColor: "transparent",
                    color:
                      selectedCategory === category.name
                        ? "primary.main"
                        : "secondary.main",
                    "&:hover": {
                      backgroundColor: "none",
                      color: "primary.main",
                    },
                    "&:active": {
                      backgroundColor: "none",
                    },
                  }}
                  onClick={() =>
                    handleCategoryClick(
                      category.name,
                      category.recipeCategoryId
                    )
                  }
                >
                  {currentLang === "ko" ? category.name : category.nameEn} (
                  {category.count})
                </Button>
              ))}
            </Stack>
          </SearchBox>
        </SearchBoxContainer>

        <Divider />

        <TitleBox margin={"20px 0"}>
          <Stack
            direction="row"
            flexWrap="wrap"
            sx={{
              "& .MuiButton-root": {
                marginLeft: "0",
              },
            }}
          >
            {Object.entries(orderMap).map(([key, value]) => (
              <Button
                key={key}
                variant="text"
                sx={{
                  backgroundColor: "transparent",
                  color:
                    selectedOrder === value ? "primary.main" : "secondary.main",
                  "&:hover": {
                    backgroundColor: "none",
                    color: "primary.main",
                  },
                  "&:hover .hoverBox": {
                    backgroundColor: "primary.main",
                  },
                }}
                onClick={() => handleOrderClick(value, key)}
              >
                <Box
                  className="hoverBox"
                  sx={{
                    display: "inline-block",
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    backgroundColor:
                      selectedOrder === value
                        ? "primary.main"
                        : "secondary.main",
                    marginRight: "8px",
                  }}
                />
                {value}
              </Button>
            ))}
          </Stack>
          {user?.memberId && (
            <Button variant="contained" onClick={handleRecipeWriteClick}>
              {t("text.recipe_write")}
            </Button>
          )}
        </TitleBox>
      </Box>
      <Box component="section" sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          {loading && !hasMore ? (
            <Loading />
          ) : recipes && recipes.length > 0 ? (
            <>
              {recipes.map((recipeItem) => {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={recipeItem.recipeId}
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
                                ? `${process.env.REACT_APP_FILE_URL}${recipeItem.memberRecipeImages.webImgPath}/${recipeItem.memberRecipeImages.serverImgName}.${recipeItem.memberRecipeImages.extension}`
                                : "https://via.placeholder.com/300/ffffff/F3B340?text=No+Image"
                            }
                            alt={recipeItem.title}
                          ></ThumbnailBox>
                          {user?.memberId && (
                            <IconButton
                              sx={{}}
                              className={`recipe-like-btn`}
                              component="div"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleLikeClick(
                                  recipeItem.recipeId,
                                  recipeItem.isLike
                                );
                              }}
                            >
                              {recipeItem.isLike ? (
                                <FavoriteIcon
                                  fontSize="large"
                                  style={{ verticalAlign: "middle" }}
                                />
                              ) : (
                                <FavoriteBorderIcon
                                  fontSize="large"
                                  style={{ verticalAlign: "middle" }}
                                />
                              )}
                            </IconButton>
                          )}
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
                );
              })}
              <Grid item xs={12} sm={12} md={12}>
                {hasMore && <LoadingNoMargin />}
              </Grid>
              <Box ref={lastItemRef} /> {/* 마지막 항목의 참조 */}
            </>
          ) : (
            <Grid padding={"20px 0"} item xs={12} sm={12} md={12}>
              {loading ? <Loading /> : <>{t("CODE." + message)}</>}
            </Grid>
          )}
        </Grid>
      </Box>
      <ScrollTop />
    </Wrapper>
  );
};

export default MemberRecipe;
