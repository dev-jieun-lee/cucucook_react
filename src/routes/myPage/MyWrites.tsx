import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  Fab,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { activityStyles, scrollButtonStyles } from "./myPageStyles";
import { Wrapper } from "../../styles/CommonStyles";
import { fetchMyWrites } from "./api";
import { getBoardCategoryList } from "../board/api";
import { useAuth } from "../../auth/AuthContext";

interface Write {
  title: string;
  id: number;
  boardId: string;
}

interface MyWritesProps {
  isDarkMode: boolean;
}

const MyWrites: React.FC<MyWritesProps> = ({ isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberId = user ? user.memberId.toString() : null;
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [board_division, setBoardDivision] = useState<string>("NOTICE"); // 기본값 NOTICE로 설정
  const [writes, setWrites] = useState<Write[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // 카테고리 목록 상태 추가
  const [categoriesLoaded, setCategoriesLoaded] = useState(false); // 카테고리 로드 상태

  const loadWrites = async (currentPage: number, division: string) => {
    if (!memberId || !division) return;

    console.log(
      "Fetching writes with memberId:",
      memberId,
      "page:",
      currentPage,
      "board_division:",
      division
    );
    const response = await fetchMyWrites(memberId, currentPage, 5, division);
    console.log("Response data for page", currentPage, ":", response);

    if (currentPage === 0) {
      setWrites(response);
    } else {
      setWrites((prev) => [...prev, ...response]);
    }
  };

  const loadCategoriesAndWrites = async () => {
    const params = {
      search: "",
      start: "",
      display: "",
    };
    const response = await getBoardCategoryList(params);
    console.log(response.data);

    const filteredCategories = response.data.filter(
      (category: any) =>
        category.boardCategoryId && category.boardCategoryId.startsWith("BC")
    );

    if (filteredCategories.length > 0) {
      setCategories(filteredCategories);
      setCategoriesLoaded(true); // 카테고리 로드 완료 상태 설정
      const defaultBoardDivision = "NOTICE";
      setBoardDivision(defaultBoardDivision);

      await loadWrites(0, defaultBoardDivision); // 기본 카테고리로 게시글 로드
    } else {
      setCategories([]);
      setBoardDivision(""); // 필터링된 결과가 없을 때는 셀렉트박스 초기화
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 페이지 진입 시 카테고리 및 게시글을 로드
  useEffect(() => {
    loadCategoriesAndWrites();
  }, [memberId]);

  useEffect(() => {
    console.log("Categories on change:", categories);
    console.log("Current board_division:", board_division);
  }, [categories, board_division]);

  const handleboardDivisionChange = (event: SelectChangeEvent<string>) => {
    const newBoardDivision = event.target.value;
    if (newBoardDivision !== board_division) {
      console.log("셀렉박스 선택값:", newBoardDivision);
      setBoardDivision(newBoardDivision);
      setWrites([]); // 선택한 카테고리에 따라 게시물 목록 초기화 후 새로 로드
      loadWrites(0, newBoardDivision); // 새로운 카테고리로 게시글 로드
    }
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

  const handleGoBack = () => {
    console.log("뒤로가기 클릭");
    navigate(-1);
  };

  const scrollToTop = () => {
    console.log("페이지 상단으로 스크롤");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePostButtonClick = async () => {
    console.log("게시글 버튼 클릭");
    setWrites([]); // 리스트 초기화
    await loadCategoriesAndWrites(); // 게시글 버튼 클릭 시 카테고리 및 게시글 로드
  };

  return (
    <Wrapper>
      <Box sx={activityStyles.container}>
        <Box sx={activityStyles.content}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">{t("내가 쓴 게시글")}</Typography>
            <Button variant="outlined" onClick={handleGoBack}>
              {t("뒤로 가기")}
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Select
              value={board_division} // board_division 값을 직접 설정
              onChange={handleboardDivisionChange}
              displayEmpty
              inputProps={{ "aria-label": "Board categoryId Select" }}
              sx={{ marginLeft: 1 }}
            >
              {categories.map((category, index) => {
                console.log(
                  `Rendering MenuItem: ${category.name} with value: ${category.division}`
                );
                return (
                  <MenuItem
                    key={category.boardCategoryId}
                    value={category.division} // division 값을 사용하여 셀렉트 박스에서 선택
                  >
                    {category.name}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>

          <List
            sx={{
              width: "100%",
              overflowY: "auto",
              maxHeight: "calc(100% - 48px)",
            }}
          >
            {writes.length > 0 ? (
              writes.map((write, index) => (
                <ListItem
                  key={write.id}
                  sx={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                  button
                  onClick={() => navigate(`/notice/${write.boardId}`)}
                >
                  <ListItemText primary={write.title} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" sx={{ padding: 2 }}>
                게시물이 없습니다.
              </Typography>
            )}
          </List>
        </Box>
      </Box>
      {showScrollButton && (
        <Fab
          color="primary"
          size="small"
          sx={scrollButtonStyles}
          onClick={scrollToTop}
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </Wrapper>
  );
};

export default MyWrites;
