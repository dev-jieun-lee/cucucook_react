import React, { useEffect, useState } from "react";
import {
  PageTitleBasic,
  ScrollBtnFab,
  Wrapper,
} from "../../styles/CommonStyles";
import { useTranslation } from "react-i18next";
import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  TitleBox,
  ThumbnailBox,
  ThumbnailBoxContainer,
  ThumbnailButton,
  ThumbnailTypography,
} from "../../styles/RecipeStyle";
import { useNavigate } from "react-router-dom";
import { KeyboardArrowUp } from "@mui/icons-material";

const AllRecipeList = ({ isDarkMode }: { isDarkMode: boolean }) => {
  //데이터 받아오기
  // const { data: publicRecipe, isLoading: publicRecipeLoading } =
  //   useQuery("movies", () => getPublicRecipe());
  //   console.log(publicRecipe);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleMoreViewClick = (value: string) => {
    navigate(value);
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

  return (
    <Wrapper>
      <Box component="section">
        <TitleBox>
          <PageTitleBasic>{t("text.public_recipe")}</PageTitleBasic>
          <Button
            variant="text"
            onClick={() => handleMoreViewClick("/recipe/public_recipe_list")}
          >
            <AddIcon /> {t("더보기")}
          </Button>
        </TitleBox>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <ThumbnailButton onClick={() => alert("클릭이벤트")}>
              <ThumbnailBoxContainer>
                <ThumbnailBox
                  src="https://png.pngtree.com/thumb_back/fh260/background/20230609/pngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg"
                  alt="강아지사진"
                ></ThumbnailBox>
              </ThumbnailBoxContainer>
              <ThumbnailTypography variant="subtitle1">
                강아지귀엽당
              </ThumbnailTypography>
            </ThumbnailButton>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <ThumbnailButton onClick={() => alert("클릭이벤트")}>
                <ThumbnailBoxContainer>
                  <ThumbnailBox
                    src="https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg"
                    alt="강아지사진2"
                  ></ThumbnailBox>
                </ThumbnailBoxContainer>
                <ThumbnailTypography variant="subtitle1">
                  강아지 너무 귀엽당
                </ThumbnailTypography>
              </ThumbnailButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <ThumbnailButton onClick={() => alert("클릭이벤트")}>
                <ThumbnailBoxContainer>
                  <ThumbnailBox
                    src="https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg"
                    alt="강아지사진2"
                  ></ThumbnailBox>
                </ThumbnailBoxContainer>
                <ThumbnailTypography variant="subtitle1">
                  강아지 짱짱짱짱짱 대박적이게 귀엽당ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ
                  긴말은 말줄임표 해야징
                </ThumbnailTypography>
              </ThumbnailButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <ThumbnailButton onClick={() => alert("클릭이벤트")}>
                <ThumbnailBoxContainer>
                  <ThumbnailBox
                    src="https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13262118&filePath=L2Rpc2sxL25ld2RhdGEvMjAyMC8yMS9DTFMxMDAwNi82MmZhMWExMy03ZjRmLTQ1NWMtYTZlNy02ZTk2YjhjMjBkYTk=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006"
                    alt="꽃사진"
                  ></ThumbnailBox>
                </ThumbnailBoxContainer>
                <ThumbnailTypography variant="subtitle1">
                  꽃이당
                </ThumbnailTypography>
              </ThumbnailButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box component="section" mt={4}>
        <TitleBox>
          <PageTitleBasic>{t("text.public_recipe")}</PageTitleBasic>
          <Button
            variant="text"
            onClick={() => handleMoreViewClick("/recipe/member_recipe")}
          >
            <AddIcon /> {t("더보기")}
          </Button>
        </TitleBox>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <ThumbnailButton onClick={() => alert("클릭이벤트")}>
              <ThumbnailBoxContainer>
                <ThumbnailBox
                  src="https://png.pngtree.com/thumb_back/fh260/background/20230609/pngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg"
                  alt="강아지사진"
                ></ThumbnailBox>
              </ThumbnailBoxContainer>
              <ThumbnailTypography variant="subtitle1">
                강아지귀엽당
              </ThumbnailTypography>
            </ThumbnailButton>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <ThumbnailButton onClick={() => alert("클릭이벤트")}>
                <ThumbnailBoxContainer>
                  <ThumbnailBox
                    src="https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg"
                    alt="강아지사진2"
                  ></ThumbnailBox>
                </ThumbnailBoxContainer>
                <ThumbnailTypography variant="subtitle1">
                  강아지 너무 귀엽당
                </ThumbnailTypography>
              </ThumbnailButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <ThumbnailButton onClick={() => alert("클릭이벤트")}>
                <ThumbnailBoxContainer>
                  <ThumbnailBox
                    src="https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg"
                    alt="강아지사진2"
                  ></ThumbnailBox>
                </ThumbnailBoxContainer>
                <ThumbnailTypography variant="subtitle1">
                  강아지 짱짱짱짱짱 대박적이게 귀엽당ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ
                  긴말은 말줄임표 해야징
                </ThumbnailTypography>
              </ThumbnailButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <ThumbnailButton onClick={() => alert("클릭이벤트")}>
                <ThumbnailBoxContainer>
                  <ThumbnailBox
                    src="https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13262118&filePath=L2Rpc2sxL25ld2RhdGEvMjAyMC8yMS9DTFMxMDAwNi82MmZhMWExMy03ZjRmLTQ1NWMtYTZlNy02ZTk2YjhjMjBkYTk=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006"
                    alt="꽃사진"
                  ></ThumbnailBox>
                </ThumbnailBoxContainer>
                <ThumbnailTypography variant="subtitle1">
                  꽃이당
                </ThumbnailTypography>
              </ThumbnailButton>
            </Box>
          </Grid>
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
