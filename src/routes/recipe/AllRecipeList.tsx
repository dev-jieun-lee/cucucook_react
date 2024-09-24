import { Add, KeyboardArrowUp } from "@mui/icons-material";
import { Box, Button, Divider, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getMemberRecipeList, getPublicRecipeList } from "./recipeApi";
import LoadingNoMargin from "../../components/LoadingNoMargin";
import {
  PageTitleBasic,
  ScrollBtnFab,
  Wrapper,
} from "../../styles/CommonStyles";
import {
  ThumbnailBox,
  ThumbnailBoxContainer,
  ThumbnailButton,
  TitleBox,
  recipeCommonStyles,
} from "./RecipeStyle";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextsmsIcon from "@mui/icons-material/Textsms";

const AllRecipeList = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const customStyles = recipeCommonStyles();

  const { t } = useTranslation();
  const navigate = useNavigate();
  // 로딩 상태 관리
  const [memberLoading, setMemberLoading] = useState(true);
  const [publicLoading, setPublicLoading] = useState(true);
  const handleMoreViewClick = (value: string) => {
    navigate(value);
  };

  const [memberMessage, setMemberMessage] = useState("");
  const [publicMessage, setPublicMessage] = useState("");

  const handlViewDetailClick = (path: string, params: string) => {
    const pullPath = `${path}/` + params;
    navigate(pullPath);
  };

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

  // 공공상세 레시피 가져오기
  const fetchAllPublicRecipeList = async () => {
    try {
      const params = {
        search: "",
        start: "1",
        display: "4",
        recipeCategoryId: "",
      };
      const allPublicRecipeList = await getPublicRecipeList(params);

      return allPublicRecipeList.data;
    } catch (error) {
      console.error(error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };
  const { data: allPublicRecipeList } = useQuery(
    "allPublicRecipeList",
    fetchAllPublicRecipeList,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setPublicLoading(true);
        setPublicMessage(
          data.message
            .replace('<script type="text/javascript">alert(\'', "")
            .replace("'); history.back();</script>", "")
        );
      },
      onError: (err) => {
        console.error(err);
        alert(err);
        setPublicLoading(false);
      },
    }
  );

  // 회원 레시피 가져오기
  const fetchAllMemberRecipeList = async () => {
    try {
      const params = {
        search: "",
        start: "0",
        display: "4",
        recipeCategoryId: "",
        orderby: "",
      };
      const allPublicRecipeList = await getMemberRecipeList(params);

      return allPublicRecipeList.data;
    } catch (error) {
      console.error(error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };
  const { data: allMemberRecipeList } = useQuery(
    "allMemberRecipeList",
    fetchAllMemberRecipeList,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setMemberLoading(true);
        setMemberMessage(data.message);
      },
      onError: (err) => {
        console.error(err);
        alert(err);
        setMemberLoading(false);
      },
    }
  );

  return (
    <Wrapper>
      <Box component="section" sx={{ width: "100%" }}>
        <TitleBox>
          <PageTitleBasic>{t("text.public_recipe")}</PageTitleBasic>
          {allPublicRecipeList?.data && allPublicRecipeList.data.length > 0 ? (
            <Button
              variant="text"
              onClick={() => handleMoreViewClick("/recipe/public_recipe_list")}
            >
              <Add /> {t("text.more_view")}
            </Button>
          ) : (
            <>{allPublicRecipeList?.data}</>
          )}
        </TitleBox>
        <Grid container spacing={2}>
          {allPublicRecipeList?.data && allPublicRecipeList.data.length > 0 ? (
            allPublicRecipeList.data.map(
              (publicRecipeItem: any, index: number) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <ThumbnailButton
                    onClick={() =>
                      handlViewDetailClick(
                        "/recipe/public_recipe",
                        encodeURIComponent(publicRecipeItem.rcpNm)
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
                          <Box>
                            <Grid
                              container
                              className="thumbnail-info-default-box"
                            >
                              <Grid item></Grid>
                              <Grid></Grid>
                            </Grid>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </ThumbnailButton>
                </Grid>
              )
            )
          ) : (
            <Grid padding={"20px 0"} item xs={12} sm={12} md={12}>
              {publicLoading ? <LoadingNoMargin /> : <>{publicMessage}</>}
            </Grid>
          )}
        </Grid>
      </Box>
      <Box component="section" sx={{ width: "100%" }} mt={4}>
        <TitleBox>
          <PageTitleBasic>{t("text.member_recipe")}</PageTitleBasic>
          <Button
            variant="text"
            onClick={() => handleMoreViewClick("/recipe/member_recipe")}
          >
            <Add /> {t("text.more_view")}
          </Button>
        </TitleBox>
        <Grid container spacing={2}>
          {allMemberRecipeList?.data && allMemberRecipeList.data.length > 0 ? (
            allMemberRecipeList.data.map(
              (memberRecipeItem: any, index: number) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <ThumbnailButton
                    onClick={() =>
                      handlViewDetailClick(
                        "/recipe/member_recipe",
                        encodeURIComponent(memberRecipeItem.recipeId)
                      )
                    }
                  >
                    <Box className="thumbnail-box-wrap">
                      <ThumbnailBoxContainer>
                        <ThumbnailBox
                          src={
                            memberRecipeItem.memberRecipeImages
                              ? `${process.env.REACT_APP_FILE_URL}${memberRecipeItem.memberRecipeImages.webImgPath}/${memberRecipeItem.memberRecipeImages.serverImgName}.${memberRecipeItem.memberRecipeImages.extension}`
                              : "https://via.placeholder.com/300/ffffff/F3B340?text=No+Image"
                          }
                          alt={memberRecipeItem.recipeId}
                        ></ThumbnailBox>
                      </ThumbnailBoxContainer>
                      <Box className="thumbnail-info-box-wrap">
                        <Box margin={"20px"}>
                          <Box className="thumbnail-info-title-box">
                            {memberRecipeItem.title}
                          </Box>
                          <Box>
                            <Grid
                              container
                              className="thumbnail-info-default-box"
                            >
                              <Grid item>{memberRecipeItem.member.name}</Grid>
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
                                        {memberRecipeItem.viewCount}
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
                                        {memberRecipeItem.commentCount}
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
                                        {memberRecipeItem.commentRate}
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
                                        {memberRecipeItem.likeCount}
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
              )
            )
          ) : (
            <Grid padding={"20px 0"} item xs={12} sm={12} md={12}>
              {memberLoading ? <LoadingNoMargin /> : <>{memberMessage}</>}
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

export default AllRecipeList;
