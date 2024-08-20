import React, { useEffect, useState } from "react";
import {
  PageTitleBasic,
  ScrollBtnFab,
  Wrapper,
} from "../../styles/CommonStyles";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  TitleBox,
  ThumbnailBox,
  ThumbnailBoxContainer,
  ThumbnailButton,
  ThumbnailTypography,
  SearchBox,
  SearchBoxContainer,
  SearchTextField,
} from "../../styles/RecipeStyle";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { BorderBottom, KeyboardArrowUp } from "@mui/icons-material";

const thumbnails = [
  {
    id: 1,
    src: "https://png.pngtree.com/thumb_back/fh260/background/20230609/pngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg",
    title: "강아지너무귀여웡 ㅠ_ㅠ",
  },
  {
    id: 2,
    src: "https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg",
    title: "강아지너무귀여웡 ㅠ_ㅠ",
  },
  {
    id: 3,
    src: "https://news.nateimg.co.kr/orgImg/ns/2023/10/12/NISI20231012_0020087516_web.jpg",
    title: "누가루이고누가후이겡",
  },
  {
    id: 4,
    src: "https://cdn.thetitlenews.net/news/photo/202312/3303_7663_341.png",
    title: "판다는 왜 귀여운 것일까 아이바오 귀엽당",
  },
  {
    id: 5,
    src: "https://img.khan.co.kr/news/2024/03/04/news-p.v1.20240303.0c4af180e49842269d2c5044819efb9a.png",
    title: "푸바오오~~~~~~~~~~~~~~",
  },
  {
    id: 6,
    src: "https://i.namu.wiki/i/N7XtnLu7mENPBU1wMlAoOo5_w13roksendvuswR8gkFw_8SilcxCpT3kTTdzaP42jSpZAQ2-R4x3aNxaj6A3JA.webp",
    title: "러바오도있음",
  },
  {
    id: 7,
    src: "https://ppss.kr/wp-content/uploads/2018/09/zzzzzz.jpg",
    title:
      "너무나ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ귀여운~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  },
  {
    id: 8,
    src: "https://png.pngtree.com/thumb_back/fh260/background/20230609/pngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg",
    title: "강아지너무귀여웡 ㅠ_ㅠ",
  },
  {
    id: 9,
    src: "https://png.pngtree.com/thumb_back/fh260/background/20230609/pngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg",
    title: "강아지너무귀여웡 ㅠ_ㅠ",
  },
  {
    id: 10,
    src: "https://png.pngtree.com/thumb_back/fh260/background/20230609/pngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg",
    title: "강아지너무귀여웡 ㅠ_ㅠ",
  },
  {
    id: 11,
    src: "https://png.pngtree.com/thumb_back/fh260/background/20230609/pngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg",
    title: "강아지너무귀여웡 ㅠ_ㅠ",
  },
  {
    id: 12,
    src: "https://png.pngtree.com/thumb_back/fh260/background/20230609/pngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg",
    title: "강아지너무귀여웡 ㅠ_ㅠ",
  },
];

const PublicRecipe = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleMoreViewClick = (value: string) => {
    navigate(value);
  };
  const theme = useTheme();

  const categories = ["전체(27)", "한식(2)", "양식(5)", "중식(1)", "일식(19)"];
  const [selectedCategory, setSelectedCategory] = useState<string>("전체(27)");

  const orderList = [
    t("text.최신순"),
    t("text.조회수순"),
    t("text:댓글순"),
    t("text.평점순"),
  ];
  const [selectedOrder, setSelectedOrder] = useState<string>(t("text.최신순"));

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    console.log(`Selected Category: ${category}`);
  };

  const handleOrderClick = (order: string) => {
    setSelectedOrder(order);
    console.log(`Selected order: ${order}`);
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
        </TitleBox>
        <SearchBoxContainer>
          <SearchBox>
            <Box
              sx={{
                display: "flex",
              }}
            >
              <SearchTextField
                label={t("sentence.searching")}
                variant="outlined"
                size="small"
              />
              <IconButton
                aria-label="search"
                sx={{ ml: 1, color: theme.mainColor, transform: "scale(1.3)" }}
              >
                <SearchIcon fontSize="medium" />
              </IconButton>
            </Box>
          </SearchBox>
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
            {orderList.map((order) => (
              <Button
                key={order}
                variant="text"
                sx={{
                  backgroundColor: "transparent",
                  color:
                    selectedOrder === order ? "primary.main" : "text.primary",
                  "&:hover": {
                    backgroundColor: "none",
                    color: "primary.main",
                  },
                  "&:hover .hoverBox": {
                    backgroundColor: "primary.main",
                  },
                }}
                onClick={() => handleOrderClick(order)}
              >
                <Box
                  className="hoverBox"
                  sx={{
                    display: "inline-block",
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    backgroundColor:
                      selectedOrder === order ? "primary.main" : "text.primary",
                    marginRight: "8px",
                  }}
                />
                {order}
              </Button>
            ))}
          </Stack>
        </TitleBox>

        <Grid container spacing={2}>
          {thumbnails.map((thumbnails) => (
            <Grid item xs={12} sm={6} md={3} key={thumbnails.id}>
              <ThumbnailButton onClick={() => alert("클릭이벤트")}>
                <ThumbnailBoxContainer>
                  <ThumbnailBox
                    src={thumbnails.src}
                    alt={thumbnails.title}
                  ></ThumbnailBox>
                </ThumbnailBoxContainer>
                <ThumbnailTypography variant="subtitle1">
                  {thumbnails.title}
                </ThumbnailTypography>
              </ThumbnailButton>
            </Grid>
          ))}
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
