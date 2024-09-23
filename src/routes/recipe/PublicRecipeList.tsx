import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Button, Divider, Grid, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import { getPublicRecipeList } from "../../api";
import Loading from "../../components/Loading";
import LoadingNoMargin from "../../components/LoadingNoMargin";
import {
  PageTitleBasic,
  ScrollBtnFab,
  Wrapper,
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
import { SearchArea } from "../board/BoardStyle";

const PublicRecipe = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const categories = ["전체", "국&찌개", "반찬", "밥", "일품", "후식"];
  // 검색어
  const [searchTerm, setSearchTerm] = useState("");
  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);
  // 무한 스크롤 시작값
  const [start, setStart] = useState(1);
  // 무한 스크롤 데이터가 더 있는지 체크
  const [hasMore, setHasMore] = useState(false);
  // 기존 값에 이어붙이기용
  const [recipes, setRecipes] = useState<any[]>([]);
  //선택된 카테고리값
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const display = 20;
  const [message, setMessage] = useState("");

  const updateMessage = (data: any) => {
    if (data.message === "E_ADMIN") setMessage(t("CODE." + data.message));
    else
      setMessage(
        data.message
          .replace('<script type="text/javascript">alert(\'', "")
          .replace("'); history.back();</script>", "")
      );
  };

  const handleViewDetailClick = (path: string, params: string) => {
    const pullPath = `${path}/` + params;
    navigate(pullPath);
  };

  //마지막 항목이 화면에 보일때 마다 새로운 페이지 데이터 로드
  const { ref: lastItemRef, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    if (inView && hasMore) {
      setLoading(true);
      setStart((prevStart) => prevStart + display);
    }
  }, [inView, hasMore]);

  // 공공 레시피 목록가져오기
  const fetchPublicRecipeList = async () => {
    try {
      const params = {
        search: searchTerm,
        start: start,
        display: display,
        recipeCategoryId: selectedCategory,
      };
      const publicRecipeList = await getPublicRecipeList(params);

      return publicRecipeList.data;
    } catch (error) {
      console.error(error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const { refetch } = useQuery(
    //쿼리키 (category, start 값이 번경되면 데이터 요청)
    ["publicRecipeList", selectedCategory, start],
    fetchPublicRecipeList,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setLoading(false);
        if (data) {
          setHasMore(data.addData?.hasMore ?? false);
          if (data.data != null) {
            setRecipes((prevRecipes) => [...prevRecipes, ...data.data]);
          }
          updateMessage(data);
        }
      },
      onError: (err) => {
        console.error(err);
        alert(err);
        setLoading(false);
      },
      keepPreviousData: true, // 페이지를 이동할 때 이전 데이터 유지
    }
  );

  // 검색시
  const handleSearch = async () => {
    setLoading(true);
    try {
      //start값, more값 초기화
      setStart(1);
      setHasMore(true);
      setRecipes([]);
      await refetch();
    } finally {
      setLoading(false);
    }
  };
  const handleSearchKeyUp = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  //카테고리 선택시
  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    handleSearch();
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

  return (
    <Wrapper>
      <Box component="section">
        <TitleBox>
          <PageTitleBasic>{t("text.public_recipe")}</PageTitleBasic>
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
                  key={category}
                  variant="text"
                  sx={{
                    backgroundColor: "transparent",
                    color:
                      selectedCategory === category
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
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Button>
              ))}
            </Stack>
          </SearchBox>
        </SearchBoxContainer>
        <Divider />
        <TitleBox margin={"20px 0"}></TitleBox>
        <Grid container spacing={2}>
          {loading && !hasMore ? (
            <Loading />
          ) : recipes.length > 0 ? (
            <>
              {recipes.map((publicRecipeItem: any, index: number) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <ThumbnailButton
                    onClick={() =>
                      handleViewDetailClick(
                        "/recipe/public_recipe",
                        encodeURIComponent(publicRecipeItem.rcpNm) + "/1/1"
                      )
                    }
                  >
                    <Box className="thumbnail-box-wrap">
                      <ThumbnailBoxContainer>
                        <ThumbnailBox
                          src={publicRecipeItem.attFileNoMk}
                          alt={publicRecipeItem.rcpNm}
                        ></ThumbnailBox>
                      </ThumbnailBoxContainer>

                      <Box className="thumbnail-info-box-wrap">
                        <Box margin={"20px"}>
                          <Box className="thumbnail-info-title-box">
                            {publicRecipeItem.rcpNm}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </ThumbnailButton>
                </Grid>
              ))}
              {hasMore && (
                <Grid item xs={12} sm={12} md={12}>
                  {loading && <LoadingNoMargin />}
                </Grid>
              )}
              <Box ref={lastItemRef} /> {/* 마지막 항목의 참조 */}
            </>
          ) : (
            <Grid padding={"20px 0"} item xs={12} sm={12} md={12}>
              {loading ? <Loading /> : <>{message}</>}
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

export default PublicRecipe;
