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
  FormControl,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { SearchArea, TitleCenter, Wrapper } from "../../styles/CommonStyles";
import {
  fetchMyReplies,
  deleteReply,
  searchReplies,
} from "../../apis/mypageApi";
import { useAuth } from "../../auth/AuthContext";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { activityStyles, scrollButtonStyles } from "./myPageStyles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SearchIcon from "@mui/icons-material/Search";
import { MypageContentArea, MypageHeaderListItem, MypageRowListItem } from "../../styles/MypageStyle";
import { DeleteIconButton } from "../../styles/AdminStyle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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
  hasChildComment?: string;
}

const MyReplys: React.FC<{}> = () => {
  const { t } = useTranslation();
  const [myReplies, setMyReplies] = useState<Reply[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(100); // 처음에 5개씩 불러오도록 설정
  const [hasMore, setHasMore] = useState(true); // 더 로드할 데이터가 있는지 여부
  const [searchType, setSearchType] = useState("content"); // 기본값으로 'content'
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
    if (searchKeyword.trim()) {
      // 검색어가 있으면 검색 결과에 따라 정렬
      handleSearch();
    } else {
      // 검색어가 없으면 기본 댓글 로드
      loadReplies();
    }
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
      memberId!,
      page,
      pageSize,
      sortOption,
      sortDirection,
      // "",
      // searchType
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
    // 검색 상태에 따라 검색 결과 유지
    if (searchKeyword.trim()) {
      handleSearch(); // 검색 상태 유지
    } else {
      setMyReplies([]); // 검색어가 없으면 댓글 목록 초기화
    }
  };

  //댓글 검색
  const handleSearch = async () => {
    setPage(0); // 페이지 초기화
    try {
      if (searchKeyword.trim() && memberId) {
        const searchedReplies = await searchReplies(
          searchKeyword,
          searchType,
          memberId,
          0, // 페이지는 항상 처음부터 검색
          pageSize,
          sortOption,
          sortDirection
        );
        // 검색된 결과만 상태에 저장, 이전 데이터 제거
        setMyReplies(searchedReplies);
      } else {
        // 검색어가 없을 경우 기존 로딩 로직 실행
        loadReplies();
      }
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  const handleDelete = async (
    memberId: string,
    commentId: string,
    hasChildComment: string | undefined
  ) => {
    if (!hasChildComment) {
      try {
        const success = await deleteReply(memberId, commentId);

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
      <TitleCenter>
        <Tooltip title={t("text.go_back")}>
          <IconButton
            color="primary"
            aria-label="add"
            style={{ marginTop: "-5px" }}
            onClick={() => navigate("/mypage/activity")}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Tooltip>
        {t("mypage.mycommnet")}
      </TitleCenter>
      <SearchArea>
        <Select
          className="select-category"
          variant="standard"
          labelId="select-category"
          value={searchType}
          // onChange={handleSearchTypeChange}
        >
          <MenuItem value="all">
            {t("text.all")}
          </MenuItem>
          <MenuItem value="title">{t("text.recipe")}</MenuItem>
          <MenuItem value="contents">{t("text.comment")}</MenuItem>
        </Select>
        <TextField
          className="search-input"
          variant="standard"
          placeholder={t("sentence.searching")}
          // value={search}
          // onChange={(e) => setSearch(e.target.value)}
          // onKeyDown={handleKeyDown} // 엔터 키로 검색
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  // color="primary"
                  aria-label="toggle password visibility"
                  // onClick={handleSearchClick}
                  edge="end"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </SearchArea>
      <MypageContentArea>
        <List>
          <MypageHeaderListItem className="list-item header">
            <Box className="no">
              <span>No.</span>
            </Box>
            <Box className="recipe">
              <span>{t("text.recipe")} {t("text.title")}</span>
            </Box>
            <Box className="comment">
              <span>{t("text.comment")}</span>
            </Box>
            <Box className="date">
              <span>{t("text.register_date")}</span>
            </Box>
            <Box className="delete">
              <span>{t("text.delete")}</span>
            </Box>
          </MypageHeaderListItem>
          {myReplies && myReplies.length > 0 ? (
            myReplies.map((item : any, index : any) => (
              <MypageRowListItem
                className="list-item"
                key={item.commentId}
                // onClick={() => onClickDetail(item.boardId, item.boardDivision)}
                // ref={index === myReplies.length - 1 ? lastReplyRef : null} // 마지막 댓글에 대한 ref 설정
              >
                <Box className="no">
                  {/* <span>{(currentPage - 1) * itemsPerPage + index + 1}</span> */}
                  <span>{index +1}</span>
                </Box>
                <Box className="content">
                  <Box className="recipe">
                    <span>{item.title}</span>
                  </Box>
                  <Box className="comment">
                    <span>{item.comment}</span>
                  </Box>
                </Box>
                <Box className="date">
                  <span>{dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}</span>
                </Box>
                <Box className="delete">
                  <DeleteIconButton
                    className="icon-btn"
                    // onClick={(event) => {
                    //   event.stopPropagation();
                    //   onClickDelete(categoryItem.boardCategoryId);
                    // }}
                  >
                    <DeleteForeverIcon color="error" className="delete-icon" />
                  </DeleteIconButton>
                </Box>
              </MypageRowListItem>
            ))
          ) : (
            <Typography>{t("sentence.no_data")}</Typography>
          )}
        </List>
        {/* <CustomPagination className="pagination" spacing={2}>
          <Pagination
            className="pagination-btn"
            color="primary"
            count={totalPages} // 전체 페이지 수
            page={currentPage} // 현재 페이지
            onChange={handlePageChange} // 페이지 변경 시 실행되는 핸들러
          />
        </CustomPagination> */}
      </MypageContentArea>
    </Wrapper>
  );
};

export default MyReplys;