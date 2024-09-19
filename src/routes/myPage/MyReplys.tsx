import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
import dayjs from "dayjs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const MySwal = withReactContent(Swal);

interface Reply {
  id: string;
  memberId: string;
  content: string;
  title?: string;
  recipeId?: string;
  comment?: string;
  regDt?: string;
  commentId?: string;
  pcommentId?: string;
}

interface MyReplysProps {
  isDarkMode: boolean;
}
const MyReplys: React.FC<MyReplysProps> = ({ isDarkMode }) => {
  const { t } = useTranslation();
  const [myReplies, setMyReplies] = useState<Reply[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(5); // 처음에 5개씩 불러오도록 설정
  const [hasMore, setHasMore] = useState(true); // 더 로드할 데이터가 있는지 여부
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("comment");
  const navigate = useNavigate();
  const { user } = useAuth();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sortDirection, setSortDirection] = useState("DESC"); // 정렬 방향 (DESC 또는 ASC)
  let memberId = user ? user.memberId.toString() : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadReplies();
  }, [sortOption, sortDirection, page]);

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

  const loadReplies = async () => {
    if (!memberId) {
      console.error("사용자 정보 없음");

      await MySwal.fire({
        title: "잘못된 접근입니다",
        text: "사용자 정보가 없으므로 로그인 화면으로 이동합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });

      navigate("/login");
      return;
    }

    try {
      const newReplies = await fetchMyReplies(
        memberId,
        page,
        pageSize,
        sortOption,
        sortDirection
      );
      if (page === 0) {
        setMyReplies(newReplies); // 처음 로드 시에는 새로 불러온 데이터로 초기화
      } else {
        setMyReplies((prevReplies) => [...prevReplies, ...newReplies]); // 추가로 불러온 댓글은 기존 목록에 추가
      }
      setHasMore(newReplies.length === pageSize); // 더 로드할 댓글이 있는지 확인
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  // 정렬 옵션과 방향을 토글하는 함수
  const handleSortChange = (newSortOption: string) => {
    if (newSortOption === sortOption) {
      // 이미 선택된 정렬 기준이면 방향을 토글
      setSortDirection((prevDirection) =>
        prevDirection === "ASC" ? "DESC" : "ASC"
      );
    } else {
      // 새로운 정렬 기준이 선택되면 기본으로 내림차순
      setSortOption(newSortOption);
      setSortDirection("DESC");
    }
    setPage(0); // 페이지 초기화
    setMyReplies([]); // 댓글 목록 초기화
  };
  const handleSearch = async () => {
    try {
      if (searchKeyword.trim() && memberId) {
        const searchedReplies = await searchReplies(
          searchKeyword,
          page,
          pageSize
        );
        setMyReplies(searchedReplies);
      } else {
        loadReplies();
      }
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  const handleDelete = async (
    memberId: string,
    commentId: string,
    pcommentId: string | undefined
  ) => {
    if (!pcommentId) {
      try {
        const success = await deleteReply(
          memberId,
          commentId,
          pcommentId ?? ""
        );

        if (success) {
          MySwal.fire({
            title: "삭제 완료",
            text: "댓글이 삭제되었습니다!",
            icon: "success",
            confirmButtonText: "확인",
          });

          setMyReplies((prevReplies) =>
            prevReplies.filter((reply) => reply.commentId !== commentId)
          );
        } else {
          MySwal.fire({
            title: "삭제 실패",
            text: "댓글 삭제에 실패했습니다. 다시 시도해 주세요.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        MySwal.fire({
          title: "삭제 실패",
          text: "댓글 삭제 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    } else {
      await MySwal.fire({
        title: "삭제 불가한 댓글입니다.",
        text: "대댓글이 존재합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const lastReplyRef = (node: HTMLElement | null) => {
    if (!hasMore || !node) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1); // 페이지를 증가시켜 추가 댓글 로드
      }
    });

    observerRef.current.observe(node);
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
            <div className="title">
              <span>{t("mypage.mycommnet")}</span>
            </div>
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
              sx={{ width: "60%" }}
            />

            {/* 정렬 버튼들 */}
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant={sortOption === "regDt" ? "contained" : "outlined"}
                onClick={() => handleSortChange("regDt")}
                endIcon={
                  sortOption === "regDt" &&
                  (sortDirection === "DESC" ? (
                    <ArrowDownward />
                  ) : (
                    <ArrowUpward />
                  ))
                }
              >
                댓글 적은 순
              </Button>
              <Button
                variant={sortOption === "recipeId" ? "contained" : "outlined"}
                onClick={() => handleSortChange("recipeId")}
                endIcon={
                  sortOption === "recipeId" &&
                  (sortDirection === "DESC" ? (
                    <ArrowDownward />
                  ) : (
                    <ArrowUpward />
                  ))
                }
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
                ref={index === myReplies.length - 1 ? lastReplyRef : null} // 마지막 댓글에 대한 ref 설정
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
                    {reply.comment ? reply.comment.slice(0, 10) + "..." : ""}
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
                    }
                  >
                    게시글 보기
                  </Button>
                </Box>

                {/* 삭제 버튼 섹션 */}
                <Box sx={{ flex: 1 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      if (reply.commentId) {
                        handleDelete(
                          reply.memberId,
                          reply.commentId, // commentId가 있을 경우에만 실행
                          reply.pcommentId
                        );
                      }
                    }}
                  >
                    삭제
                  </Button>
                </Box>
              </ListItem>
            ))}
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

export default MyReplys;
