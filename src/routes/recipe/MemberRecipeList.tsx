import { Girl, KeyboardArrowUp } from "@mui/icons-material";
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
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  getMemberRecipeList,
  getRecipeCategoryListWithMemberRecipeCount,
} from "../../api";
import Loading from "../../components/Loading";
import LoadingNoMargin from "../../components/LoadingNoMargin";
import {
  PageTitleBasic,
  ScrollBtnFab,
  Wrapper,
  SearchArea,
} from "../../styles/CommonStyles";
import {
  SearchBox,
  SearchBoxContainer,
  ThumbnailBox,
  ThumbnailBoxContainer,
  ThumbnailButton,
  ThumbnailTypography,
  TitleBox,
} from "../../styles/RecipeStyle";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextsmsIcon from "@mui/icons-material/Textsms";
import SearchIcon from "@mui/icons-material/Search";
const MemberRecipe = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(t("text.recent_order"));
  const [selectedOrderKey, setSelectedOrderKey] = useState("reg_dt");
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
  };

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
      console.error(error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const { refetch: refetchCategories } = useQuery(
    ["recipeCategoryList"],
    fetchRecipeCategoryList,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setcategories(data.data);
      },
      onError: (err) => {
        console.error(err);
        alert(err);
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
    };

    try {
      const memberRecipeList = await getMemberRecipeList(params);

      return memberRecipeList.data;
    } catch (error) {
      console.error(error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const { refetch } = useQuery(
    ["memberRecipeList", selectedCategoryKey, selectedOrderKey, start],
    fetchMemberRecipeList,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setLoading(false);
        setHasMore(data?.addData?.hasMore ?? false);
        setRecipes((prevRecipes) => [...prevRecipes, ...(data.data ?? [])]);
        setMessage(data.message);
      },
      onError: (err) => {
        console.error(err);
        alert(err);
        setLoading(false);
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

  const handleRecipeWriteClick = () => {
    navigate("/recipe/member_recipe_write");
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
                      aria-label="toggle password visibility"
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
                        : "text.primary",
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
                    selectedOrder === value ? "primary.main" : "text.primary",
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
                      selectedOrder === value ? "primary.main" : "text.primary",
                    marginRight: "8px", // Spacing between dot and text,
                  }}
                />
                {value}
              </Button>
            ))}
          </Stack>
          <Button variant="contained" onClick={handleRecipeWriteClick}>
            {t("text.recipe_write")}
          </Button>
        </TitleBox>
      </Box>
      <Box component="section" sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          {loading && !hasMore ? (
            <Loading />
          ) : recipes.length > 0 ? (
            <>
              {recipes.map((recipeItem) => (
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
                              ? `${process.env.REACT_APP_API_URL}${recipeItem.memberRecipeImages.webImgPath}/${recipeItem.memberRecipeImages.serverImgName}.${recipeItem.memberRecipeImages.extension}`
                              : "https://via.placeholder.com/300/ffffff/F3B340?text=No+Image"
                          }
                          alt={recipeItem.title}
                        ></ThumbnailBox>
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
      {showScrollButton && (
        <ScrollBtnFab color="primary" size="small" onClick={scrollToTop}>
          <KeyboardArrowUp />
        </ScrollBtnFab>
      )}
    </Wrapper>
  );
};

export default MemberRecipe;
