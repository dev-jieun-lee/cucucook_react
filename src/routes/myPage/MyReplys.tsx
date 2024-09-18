import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  Fab,
  TextField,
} from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { activityStyles, scrollButtonStyles } from "./myPageStyles";
import { Wrapper } from "../../styles/CommonStyles";
import { fetchMyReplies, deleteReply, searchReplies } from "./api";
import { useAuth } from "../../auth/AuthContext";
import dayjs from "dayjs"; // 날짜 형식화를 위해 dayjs 라이브러리를 사용
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface Reply {
  id: string;
  content: string;
  title?: string; // 게시글 제목 (선택적으로 추가)
  recipeId?: string; // recipeId를 postId로 사용
  comment?: string; // 댓글 내용
  regDt?: string; // 댓글 작성 시간
  commentId?: string; // 댓글아이디
  pcommentId?: string; // 대댓글아이디
}

interface MyReplysProps {
  isDarkMode: boolean;
}

const MySwal = withReactContent(Swal);

const MyReplys: React.FC<MyReplysProps> = ({ isDarkMode }) => {
  const [myReplies, setMyReplies] = useState<Reply[]>([]);
  const [page, setPage] = useState(0); // page 상태 정의
  const [pageSize] = useState(20); // pageSize 상태 정의
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("comment"); // 정렬 옵션 추가
  const navigate = useNavigate();
  const { user } = useAuth();
  let memberId = user ? user.memberId.toString() : null;

  useEffect(() => {
    loadReplies();
  }, [sortOption]); // 정렬 옵션 변경 시 댓글 다시 불러오기

  const loadReplies = async () => {
    if (!memberId) {
      console.error("사용자 정보 없음");

      // SweetAlert로 경고 메시지 표시
      await MySwal.fire({
        title: "잘못된 접근입니다",
        text: "사용자 정보가 없으므로 로그인 화면으로 이동합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });

      // 로그인 화면으로 이동
      navigate("/login");
      return;
    }

    try {
      const newReplies = await fetchMyReplies(memberId, page, pageSize);
      console.log("데이터 로딩 성공:", newReplies);

      // 정렬 로직 추가
      const sortedReplies = [...newReplies].sort((a, b) => {
        if (sortOption === "comment") {
          return a.comment.localeCompare(b.comment); // 댓글 내용을 기준으로 정렬
        } else if (sortOption === "recipeId") {
          return (a.recipeId || "").localeCompare(b.recipeId || ""); // 레시피 번호를 기준으로 정렬
        }
        return 0;
      });

      setMyReplies(sortedReplies);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchKeyword.trim() && memberId) {
        const searchedReplies = await searchReplies(
          searchKeyword,
          page,
          pageSize
        );
        console.log("검색 결과:", searchedReplies);
        setMyReplies(searchedReplies);
      } else {
        loadReplies();
      }
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  const handleDelete = async (commentId: string, pcommentId?: string) => {
    if (pcommentId) {
      console.error("대댓글이 있을 경우 삭제 불가");

      // SweetAlert로 경고 메시지 표시
      await MySwal.fire({
        title: "삭제 불가한 댓글입니다.",
        text: "대댓글이 존재합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
    try {
      await deleteReply(commentId);
      console.log("댓글 삭제 성공:", commentId);
      setMyReplies((prev) => prev.filter((reply) => reply.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const truncateComment = (comment: string) => {
    return comment.length > 10 ? comment.slice(0, 10) + "..." : comment;
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
            <Typography variant="subtitle1">내가 쓴 댓글</Typography>
            <Button variant="outlined" onClick={handleGoBack}>
              뒤로 가기
            </Button>
          </Box>

          {/* 검색창과 정렬 버튼 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <TextField
              label="검색"
              variant="outlined"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              sx={{ width: "60%" }} // 검색창 너비 설정
            />

            {/* 정렬 버튼들 */}
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant={sortOption === "regDt" ? "contained" : "outlined"}
                onClick={() => setSortOption("regDt")}
              >
                댓글 적은 순
              </Button>
              <Button
                variant={sortOption === "recipeId" ? "contained" : "outlined"}
                onClick={() => setSortOption("recipeId")}
              >
                레시피 번호순
              </Button>
            </Box>
          </Box>

          {/* 댓글 리스트 */}
          <List
            sx={{
              width: "100%",
              overflowY: "auto",
              maxHeight: "calc(100% - 48px)",
            }}
          >
            {myReplies.map((reply, index) => (
              <ListItem
                key={reply.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {/* No 섹션 */}
                <Box sx={{ flex: 1 }}>
                  <Typography>{index + 1}</Typography>
                </Box>

                {/* 게시글 제목 섹션 */}
                <Box sx={{ flex: 2 }}>
                  <Typography>{reply.title || ""}</Typography>
                </Box>

                {/* 댓글 내용 섹션 */}
                <Box sx={{ flex: 3 }}>
                  <Typography>
                    {truncateComment(reply.comment || "")}
                  </Typography>
                </Box>

                {/* 작성 시간 섹션 */}
                <Box sx={{ flex: 2 }}>
                  <Typography>
                    {reply.regDt
                      ? dayjs(reply.regDt).format("YYYY-MM-DD HH:mm")
                      : "시간 없음"}
                  </Typography>
                </Box>

                {/* 게시글 보기 섹션 */}
                <Box sx={{ flex: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/getMemberRecipe/${reply.recipeId}`)
                    } // 게시글 보기로 이동
                  >
                    게시글 보기
                  </Button>
                </Box>

                {/* 삭제 버튼 섹션 */}
                <Box sx={{ flex: 1 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(reply.id)} // 삭제 처리
                  >
                    삭제
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
        {showScrollButton && (
          <Fab
            color="primary"
            size="small"
            sx={scrollButtonStyles}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <KeyboardArrowUp />
          </Fab>
        )}
      </Box>
    </Wrapper>
  );
};

export default MyReplys;
