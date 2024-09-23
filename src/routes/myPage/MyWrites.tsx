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
//mport { getRecipeCategoryList } from "../recipe/api";
import { useAuth } from "../../auth/AuthContext";

interface Write {
  title: string;
  id: number;
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
  const [board_division, setBoardDivision] = useState("NOTICE"); // 기본값을 빈 문자열로 설정
  const [writes, setWrites] = useState<Write[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // 카테고리 목록 상태 추가

  const loadWrites = async (currentPage: number) => {
    if (!memberId) return;

    console.log(
      "Fetching data with memberId:",
      memberId,
      "page:",
      currentPage,
      "board_division:",
      board_division
    );
    const response = await fetchMyWrites(
      memberId,
      currentPage,
      5,
      board_division
    );
    console.log("Response data for page", currentPage, ":", response);

    if (currentPage === 0) {
      setWrites(response);
    } else {
      setWrites((prev) => [...prev, ...response]);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (memberId) {
      loadWrites(0);
    }
  }, [memberId]);

  useEffect(() => {
    loadWrites(0);
  }, [board_division]);

  const handleboardDivisionChange = (event: SelectChangeEvent<string>) => {
    const newBoardDivision = event.target.value;
    if (newBoardDivision !== board_division) {
      console.log("셀렉박스 선택값:", newBoardDivision);
      setBoardDivision(newBoardDivision);
      setWrites([]);
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

  const loadCategories = async () => {
    const params = {
      search: "",
      start: "",
      display: "",
    };
    const response = await getBoardCategoryList(params);
    console.log(response.data);

    // board_category_id가 'BC'로 시작하는 카테고리들 필터링
    const filteredCategories = response.data.filter(
      (category: any) =>
        category.boardCategoryId && category.boardCategoryId.startsWith("BC")
    );

    if (filteredCategories.length > 0) {
      const boardDivision = filteredCategories[0].boardDivision; // 첫 번째 카테고리의 board_division 값 가져오기
      console.log("board_division:", boardDivision);

      // 필터링된 카테고리와 board_division을 상태로 설정
      setCategories(filteredCategories);
      setBoardDivision(boardDivision); // 첫 번째 필터링된 카테고리의 board_division 값을 설정
    } else {
      setCategories([]);
      setBoardDivision(""); // 필터링된 결과가 없을 때는 셀렉트박스 초기화
    }
  };

  // 페이지 진입 시 게시글 버튼을 자동으로 클릭
  useEffect(() => {
    handlePostButtonClick();
  }, []);

  const handlePostButtonClick = async () => {
    setBoardDivision(""); // 셀렉트박스 초기화
    await loadCategories(); // 게시글 버튼 클릭 시 카테고리 목록 로드
  };

  const handleRecipeButtonClick = () => {
    console.log("레시피 버튼 클릭");
    setWrites([]); // 리스트 초기화
    setBoardDivision(""); // 셀렉트박스 초기화
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

          {/* 셀렉트 박스 및 버튼 */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Button
              variant="contained"
              onClick={handlePostButtonClick}
              sx={{ marginRight: 1 }}
            >
              게시글
            </Button>
            <Button variant="contained" onClick={handleRecipeButtonClick}>
              레시피
            </Button>
            <Select
              value={board_division}
              onChange={handleboardDivisionChange}
              displayEmpty
              inputProps={{ "aria-label": "Board categoryId Select" }}
              sx={{ marginLeft: 1 }}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.boardDivision}
                  value={category.boardDivision}
                >
                  {category.name}
                </MenuItem>
              ))}
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
