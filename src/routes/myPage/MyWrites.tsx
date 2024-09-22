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
  const [boardDivision, setBoardDivision] = useState("QNA");
  const [writes, setWrites] = useState<Write[]>([]);

  const loadWrites = async (currentPage: number) => {
    if (!memberId) return; // memberId가 없을 때는 함수 종료

    console.log(
      "Fetching data with memberId:",
      memberId,
      "page:",
      currentPage,
      "boardDivision:",
      boardDivision
    );
    const response = await fetchMyWrites(
      memberId,
      currentPage,
      5,
      boardDivision
    );
    console.log("Response data for page", currentPage, ":", response);

    if (currentPage === 0) {
      setWrites(response); // 첫 페이지 데이터 로드
    } else {
      setWrites((prev) => [...prev, ...response]); // 다음 페이지 데이터 추가
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  }, []); // 의존성 배열이 비어 있으므로 처음 마운트될 때만 실행

  useEffect(() => {
    if (memberId) {
      loadWrites(0); // 페이지 처음 로드 시
    }
  }, [memberId]);

  useEffect(() => {
    loadWrites(0); // boardDivision이 변경될 때마다 첫 페이지 데이터 로드
  }, [boardDivision]);

  const handleBoardDivisionChange = (event: SelectChangeEvent<string>) => {
    const newDivision = event.target.value;
    if (newDivision !== boardDivision) {
      console.log("셀렉박스 선택값:", newDivision);
      setBoardDivision(newDivision);
      setWrites([]); // 이전 데이터 초기화
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

          {/* 셀렉트 박스 */}
          <Box sx={{ marginBottom: 2 }}>
            <Select
              value={boardDivision}
              onChange={handleBoardDivisionChange}
              displayEmpty
              inputProps={{ "aria-label": "Board Division Select" }}
            >
              <MenuItem value="QNA">QNA</MenuItem>
              <MenuItem value="FAQ">FAQ</MenuItem>
              <MenuItem value="NOTICE">NOTICE</MenuItem>
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
