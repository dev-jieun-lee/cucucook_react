import { KeyboardArrowUp } from "@mui/icons-material";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import {
  Box,
  Button,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "styled-components";
import {
  deleteMemberRecipe,
  deleteMemberRecipeLike,
  getMemberRecipe,
  getRecipeCommentList,
  insertMemberRecipeLike,
} from "../../apis/recipeApi";
import Loading from "../../components/Loading";
import {
  PageSubTitleBasic,
  PageTitleBasic,
  ScrollBtnFab,
  Wrapper,
} from "../../styles/CommonStyles";
import {
  CommentIconButton,
  IngredientGrid,
  MemberRecipeView,
  RecepiImgBox,
  RecepiImgBoxContainer,
  recipeCommonStyles,
  TitleBox,
} from "../../styles/RecipeStyle";
import RecipeCommentListBox from "./RecipeCommentList";
import RecipeCommentWriteBox from "./RecipeCommentWrite";
import Swal from "sweetalert2";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextsmsIcon from "@mui/icons-material/Textsms";

const MemberRecipe = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const navigate = useNavigate();
  const handleRecipeListClick = () => {
    navigate("/recipe/member_recipe_list");
  };

  const handleRecipeWriteClick = () => {
    navigate("/recipe/member_recipe_write/" + recipeId);
  };

  const [isLike, setIsLike] = useState(false); //좋아요 상태
  const [likeCount, setLikeCount] = useState(false); //좋아요 갯수
  const scrollCommentRef = useRef<HTMLDivElement | null>(null);

  const customStyles = recipeCommonStyles();
  const theme = useTheme();

  // 파라미터 받아오기
  const { recipeId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);

  const [showScrollButton, setShowScrollButton] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalCount, setTotalCount] = useState(0); // 총 게시물 수
  const display = 20;

  const handleRecipeDeleteClick = async (recipeId: string) => {
    const params = {
      recipeId: recipeId as string,
    };
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: t("text.delete"),
        text: t("recipe.alert.delete_recipe_confirm"),
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: t("text.yes"),
        cancelButtonText: t("text.no"),
      });

      // 결과 확인 후 API 호출
      if (result.isConfirmed) {
        deleteMemberRecipeMutation(params);
      }
    } catch (error) {
      console.error("Error", error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  // 멤버 상세 레시피 가져오기
  const fetchMemberRecipe = async () => {
    const params = { recipeId };
    try {
      const publicRecipe = await getMemberRecipe(params);
      return publicRecipe.data;
    } catch (error) {
      console.error(error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const {
    data: memberRecipe,
    isLoading: memberRecipeLoading,
    refetch,
  } = useQuery("memberRecipe", fetchMemberRecipe, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setIsLoading(false);
      setLikeCount(data.data.memberRecipe.likeCount);
    },
    onError: (err) => {
      console.error(err);
      alert(err);
      setIsLoading(false);
    },
    keepPreviousData: true,
  });

  // 댓글 작성 후 호출되는 함수
  const handleCommentSubmit = async () => {
    setIsLoading(true); // 댓글 작성 시 로딩 상태 설정
    await refetch(); // 상세보기 새로고침
    await refetchCommentList(); // 댓글 새로고침
  };

  // 레시피 댓글 가져오기
  const fetchRecipeCommentList = async () => {
    const params = { recipeId, display, start: (currentPage - 1) * display };
    try {
      const recipeCommentList = await getRecipeCommentList(params);
      return recipeCommentList.data;
    } catch (error) {
      console.error(error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const { refetch: refetchCommentList } = useQuery(
    ["recipeCommentList", currentPage],
    fetchRecipeCommentList,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setComments(data.data);
        setTotalCount(data.addData.totalCnt);
        setIsLoading(false);
      },
      onError: (err) => {
        console.error(err);
        alert(err);
        setIsLoading(false);
      },
      keepPreviousData: true,
    }
  );

  //레시피 삭제
  const { mutate: deleteMemberRecipeMutation } = useMutation(
    (params: { recipeId: string }) => deleteMemberRecipe(params),
    {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: t("text.delete"),
          text: t("recipe.alert.delete_recipe_confirm_sucecss"),
          showConfirmButton: true,
          confirmButtonText: t("text.check"),
          timer: 1000,
          timerProgressBar: true,
        });
        navigate("/recipe/member_recipe_list");
      },
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: t("text.delete"),
          text: t("recipe.alert.delete_comment_confirm_sucecss"),
          showConfirmButton: true,
          confirmButtonText: t("text.check"),
        });
      },
    }
  );

  //좋아요등록
  const { mutate: insertMemberRecipeLikeMutation } = useMutation(
    () => {
      const params = { recipeId: recipeId, memberId: 1 };
      return insertMemberRecipeLike(params);
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          setIsLike(!isLike);
          setLikeCount(data.data);
        }
      },
      onError: (error) => {},
    }
  );

  //좋아요삭제
  const { mutate: deleteMemberRecipeLikeMutation } = useMutation(
    () => {
      const params = { recipeId: recipeId, memberId: 1 };
      return deleteMemberRecipeLike(params);
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          setIsLike(!isLike);
          setLikeCount(data.data);
        }
      },
      onError: (error) => {},
    }
  );

  const handleLikeClick = () => {
    if (!isLike) {
      insertMemberRecipeLikeMutation();
    } else {
      deleteMemberRecipeLikeMutation();
    }
  };

  const handleCommentScroll = () => {
    if (scrollCommentRef.current) {
      scrollCommentRef.current.scrollIntoView({ behavior: "smooth" }); // 스크롤 이동
    }
  };

  useEffect(() => {
    setIsLoading(true);
    refetchCommentList();
  }, [currentPage, refetchCommentList]);

  useEffect(() => {
    if (!memberRecipeLoading && !isLoading) {
      setIsLoading(false);
    }
  }, [memberRecipeLoading, isLoading]);

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

  const handlePageChange = (event: any, page: any) => {
    setCurrentPage(page);
  };

  return (
    <Wrapper>
      <MemberRecipeView>
        <Box component="section" sx={{ width: "100%" }} padding={"20px 0"}>
          <TitleBox margin={"20px 0"}>
            <PageTitleBasic>
              {t("text.member_recipe")} &nbsp;
              {t("text.detail_more")}
            </PageTitleBasic>
            <Box>
              <Button
                variant="contained"
                onClick={() => handleRecipeWriteClick()}
                sx={{
                  marginRight: "10px",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                {t("text.update")}
              </Button>
              <Button
                variant="outlined"
                sx={{ marginRight: "10px" }}
                type="button"
                color="warning"
                aria-label="delete"
                onClick={() => handleRecipeDeleteClick(recipeId || "")}
              >
                {t("text.delete")}
              </Button>
              <Button variant="outlined" onClick={handleRecipeListClick}>
                {t("text.list")}
              </Button>
            </Box>
          </TitleBox>
        </Box>
        <Divider />

        {memberRecipeLoading || isLoading ? (
          <Loading />
        ) : (
          <Box>
            {memberRecipe?.data ? (
              <>
                <Box className="recipe-info-container" padding={"20px 0"}>
                  <Grid
                    container
                    sx={{
                      "& > .MuiGrid-item": {
                        padding: "5px",
                        margin: 0,
                        width: "100%",
                      },
                      ...customStyles.resetMuiGrid,
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <Box className="recipe-info-img-container">
                        <Box
                          component="img"
                          className="recipe-info-img"
                          alt={memberRecipe.data.memberRecipe.title}
                          src={
                            memberRecipe.data.memberRecipeImages
                              ? `${process.env.REACT_APP_API_URL}${memberRecipe.data.memberRecipeImages.webImgPath}/${memberRecipe.data.memberRecipeImages.serverImgName}.${memberRecipe.data.memberRecipeImages.extension}`
                              : "https://via.placeholder.com/300/ffffff/F3B340?text=No+Image"
                          }
                        ></Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box paddingBottom={1}>
                        <PageSubTitleBasic className="recipe-title">
                          {memberRecipe.data.memberRecipe.title}
                        </PageSubTitleBasic>
                        <Grid
                          container
                          className="recipe-defalt-info-container"
                        >
                          <Grid item className="recipe-write-info">
                            {memberRecipe.data.memberRecipe.member.name}
                          </Grid>
                          <Grid item className="recipe-eval-info-container">
                            <Box className="recipe-eval-info ">
                              <Box
                                display="flex"
                                alignItems="center"
                                marginRight={"18px"}
                              >
                                <VisibilityIcon
                                  fontSize="small"
                                  style={{ verticalAlign: "middle" }}
                                />
                                <Box component="span" ml={0.5}>
                                  {memberRecipe.data.memberRecipe.viewCount}
                                </Box>
                              </Box>
                            </Box>
                            <Divider
                              className="recipe-eval-info"
                              orientation="vertical"
                              sx={{ height: "20px" }}
                            />
                            <Box className="recipe-eval-info ">
                              <Button
                                variant="text"
                                onClick={handleCommentScroll}
                              >
                                <Box display="flex" alignItems="center">
                                  <TextsmsIcon
                                    fontSize="small"
                                    style={{ verticalAlign: "middle" }}
                                  />
                                  <Box component="span" ml={0.5}>
                                    {
                                      memberRecipe.data.memberRecipe
                                        .commentCount
                                    }
                                  </Box>
                                </Box>
                              </Button>
                            </Box>
                            <Divider
                              className="recipe-eval-info"
                              orientation="vertical"
                              sx={{ height: "20px" }}
                            />
                            <Box className="recipe-eval-info ">
                              <Button
                                variant="text"
                                onClick={handleCommentScroll}
                              >
                                <Box display="flex" alignItems="center">
                                  <StarIcon
                                    fontSize="small"
                                    style={{ verticalAlign: "middle" }}
                                  />
                                  <Box component="span" ml={0.5}>
                                    {memberRecipe.data.memberRecipe.commentRate}
                                  </Box>
                                </Box>
                              </Button>
                            </Box>
                            <Divider
                              className="recipe-eval-info"
                              orientation="vertical"
                              sx={{ height: "20px" }}
                            />
                            <Box className="recipe-eval-info">
                              <Button variant="text" onClick={handleLikeClick}>
                                <Box display="flex" alignItems="center">
                                  {isLike ? (
                                    <FavoriteIcon
                                      fontSize="small"
                                      style={{ verticalAlign: "middle" }}
                                    />
                                  ) : (
                                    <FavoriteBorderIcon
                                      fontSize="small"
                                      style={{ verticalAlign: "middle" }}
                                    />
                                  )}
                                  <Box component="span" ml={0.5}>
                                    {likeCount}
                                  </Box>
                                </Box>
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
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
                            {memberRecipe.data.memberRecipe.calory}
                            {t("text.kcal")}
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
                            {currentLang === "ko"
                              ? memberRecipe.data.memberRecipe.method
                              : memberRecipe.data.memberRecipe.methodEn}
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
                            {currentLang === "ko"
                              ? memberRecipe.data.memberRecipe
                                  .recipeCategoryName
                              : memberRecipe.data.memberRecipe
                                  .recipeCategoryNameEn}
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
                          <Typography variant="subtitle2">
                            {memberRecipe.data.memberRecipe.serving}
                            {t("text.serving")}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2}
                          className="recipe-info-grid-title"
                        >
                          <Typography variant="subtitle2">
                            {t("text.difficulty-level")}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={10}
                          className="recipe-info-grid-text"
                        >
                          <Typography variant="subtitle2">
                            {currentLang === "ko"
                              ? memberRecipe.data.memberRecipe.level
                              : memberRecipe.data.memberRecipe.levelEn}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2}
                          className="recipe-info-grid-title"
                        >
                          <Typography variant="subtitle2">
                            {t("text.cooking-time")}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={10}
                          className="recipe-info-grid-text"
                        >
                          <Typography variant="subtitle2">
                            {memberRecipe.data.memberRecipe.time}
                            {t("text.minute-short")}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
                <Divider />
                <Box padding={"20px 0"}>
                  <Box paddingBottom={1}>
                    <PageSubTitleBasic>
                      {t("text.ingredient")}
                    </PageSubTitleBasic>
                  </Box>
                  <Box>
                    <IngredientGrid
                      container
                      sx={{
                        ...customStyles.resetMuiGrid,
                      }}
                    >
                      {memberRecipe.data.memberRecipeIngredient.map(
                        (memberRecipeIngredientItem: any) => (
                          <Box
                            display="contents"
                            key={memberRecipeIngredientItem.ingredientId}
                          >
                            <Grid item xs={6} md={3}>
                              <Typography variant="subtitle2">
                                {memberRecipeIngredientItem.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="subtitle2">
                                {memberRecipeIngredientItem.amount}
                              </Typography>
                            </Grid>
                          </Box>
                        )
                      )}
                    </IngredientGrid>
                  </Box>
                </Box>
                <Divider />
                <Box padding={"20px 0"}>
                  <Box paddingBottom={1}>
                    <PageSubTitleBasic>{t("text.recipe")}</PageSubTitleBasic>
                  </Box>
                  <Box>
                    {memberRecipe.data.memberRecipeProcessList.map(
                      (memberRecipeProcessItem: any) => (
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
                            margin: "10px",
                          }}
                          key={memberRecipeProcessItem.recipeProcessId}
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
                                alt={memberRecipeProcessItem.imgId}
                                src={
                                  memberRecipeProcessItem.memberRecipeImages
                                    ? `${process.env.REACT_APP_API_URL}${memberRecipeProcessItem.memberRecipeImages.webImgPath}/${memberRecipeProcessItem.memberRecipeImages.serverImgName}.${memberRecipeProcessItem.memberRecipeImages.extension}`
                                    : "https://via.placeholder.com/300/ffffff/F3B340?text=No+Image"
                                }
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
                              {memberRecipeProcessItem.recipeNumber}.
                              {memberRecipeProcessItem.contents}
                            </Typography>
                          </Grid>
                        </Grid>
                      )
                    )}
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
                      {memberRecipe.data.memberRecipe.tip}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Box padding={"20px 0"}>
                  <PageSubTitleBasic>
                    {t("text.comment")}(
                    {memberRecipe.data.memberRecipe.commentCount})
                  </PageSubTitleBasic>
                </Box>
                <Box>
                  <RecipeCommentWriteBox
                    onCommentSubmit={handleCommentSubmit}
                  />
                </Box>
                <Box padding={"20px 0"} ref={scrollCommentRef}>
                  <RecipeCommentListBox
                    onCommentListChange={handleCommentSubmit}
                    commentList={comments}
                    recipeId={recipeId || ""}
                  />
                </Box>
              </>
            ) : (
              <Typography padding={"20px 0"}>{t("CODE.E_IS_DATA")}</Typography> // 데이터가 없을 때 메시지
            )}
            {totalCount > 0 && (
              <Stack className="pagination" spacing={2}>
                <Pagination
                  className="pagination-btn"
                  count={Math.ceil(totalCount / display)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Stack>
            )}
          </Box>
        )}
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
