import { useTranslation } from "react-i18next";
import { CustomPagination, PageTitleBasic, SearchArea, TitleBox, TitleCenter, Wrapper } from "../../styles/CommonStyles";
import { Box, Button, IconButton, InputAdornment, List, ListItem, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteReply, fetchMyReplies, searchReplies } from "../../apis/mypageApi";
import { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { ContentsArea } from "../../styles/BoardStyle";
import dayjs from "dayjs";
import { DeleteIconButton } from "../../styles/AdminStyle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import Loading from "../../components/Loading";
import { useQuery } from "react-query";
import { MypageContentArea, MypageHeaderListItem, MypageRowListItem } from "../../styles/MypageStyle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";


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


function MyReplys(){
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("");
  const [sortDirection, setSortDirection] = useState(""); // 정렬 방향 (DESC 또는 ASC)
  const [myReplies, setMyReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(""); //검색어
  const [searchType, setSearchType] = useState(""); // 검색 유형
  const [triggerSearch, setTriggerSearch] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 페이지는 1부터 시작
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태 추가

  const memberId = user ? user.memberId.toString() : null;

  const itemsPerPage = 10; // 페이지 당 보여줄 아이템 수

  // 검색 파라미터 URL 업데이트
  useEffect(() => {
    setSearchParams({
      search: search,
      searchType: searchType,
      currentPage: currentPage.toString()
    });
  }, [search, searchType, currentPage, setSearchParams]);

  // 데이터 가져오기 시 로딩 상태 추가
  const getCommentWithDelay = async () => {
    setLoading(true); // 로딩 상태 시작

    // 인위적인 지연 시간 추가
    await new Promise((resolve) => setTimeout(resolve, 50));

    const commentData = await fetchMyReplies(
      memberId!,
      currentPage, //page
      itemsPerPage, //pageSize
      sortOption,
      sortDirection,
      // search,
      // searchType
    );// 데이터 불러오기

    setTotalPages(Math.ceil(commentData.totalItems / itemsPerPage));

    setLoading(false);
    return commentData.comments;
  };

  //데이터 받아오기
  const { data: commentData, isLoading: commentDataLoading, refetch } = useQuery(
    "commentData",
    getCommentWithDelay
  );

  console.log(commentData);
  
  // 페이지 변경 핸들러
  // const handlePageChange = (event: any, page: number) => {
  //   setCurrentPage(page); // 선택한 페이지로 변경
  //   refetch(); // 해당 페이지의 데이터를 가져오기 위해 refetch 호출
  // };
  const handlePageChange = (event: any, page: number) => {
    setCurrentPage(page); // 선택한 페이지로 변경
    setLoading(true); // 페이지 변경 시 로딩 상태 시작
    setTriggerSearch(true); // 트리거를 true로 설정하여 refetch
  };

  // 검색 유형 select 변경 이벤트
  const handleSearchTypeChange = (e: any) => {
    setSearchType(e.target.value);
    // 카테고리를 선택할 경우 search 값 초기화
    if (e.target.value === "boardDivision") {
      setSearch(""); // 카테고리 검색에서는 검색어 초기화
    } else {
      // setBoardDivision("all"); // 카테고리 외 검색 유형에서는 카테고리 초기화
    }
  };

  // 트리거 변경 시 데이터 초기화 및 로딩 처리
  useEffect(() => {
    if (triggerSearch) {
        setTriggerSearch(false); // 트리거를 false로 초기화
        refetch(); // 데이터 가져오기
    }
  }, [triggerSearch, refetch, currentPage, search, searchType]);

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    setCurrentPage(1);
    setTriggerSearch(true); // 검색 트리거를 true로 설정하여 검색 실행
    refetch(); // refetch를 호출해 쿼리를 수동으로 실행
  };

  // 엔터 키로 검색 실행 핸들러
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearchClick();
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
          Swal.fire({
            title: "삭제 완료",
            text: "댓글이 삭제되었습니다!",
            icon: "success",
            confirmButtonText: "확인",
          });

          setMyReplies((prevReplies) =>
            prevReplies.filter((reply) => reply.commentId !== commentId)
          );
        } else {
          Swal.fire({
            title: "삭제 실패",
            text: "댓글 삭제에 실패했습니다. 다시 시도해 주세요.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        Swal.fire({
          title: "삭제 실패",
          text: "댓글 삭제 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    } else {
      await Swal.fire({
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

  // const lastReplyRef = (node: HTMLElement | null) => {
  //   if (!hasMore || !node) return;

  //   if (observerRef.current) observerRef.current.disconnect();

  //   observerRef.current = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting) {
  //       setPage((prevPage) => prevPage + 1); // 페이지를 증가시켜 추가 댓글 로드
  //     }
  //   });

  //   observerRef.current.observe(node);
  // };


  
  //로딩
  if (loading || commentDataLoading) {
    return <Loading />;
  }

  console.log(commentData);
  

  return(
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
          onChange={handleSearchTypeChange}
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown} // 엔터 키로 검색
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  // color="primary"
                  aria-label="toggle password visibility"
                  onClick={handleSearchClick}
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
          {commentData && commentData.length > 0 ? (
            commentData.map((item : any, index : any) => (
              <MypageRowListItem
                className="list-item"
                key={item.commentId}
                // onClick={() => onClickDetail(item.boardId, item.boardDivision)}
                // ref={index === myReplies.length - 1 ? lastReplyRef : null} // 마지막 댓글에 대한 ref 설정
              >
                <Box className="no">
                  <span>{(currentPage - 1) * itemsPerPage + index + 1}</span>
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
        <CustomPagination className="pagination" spacing={2}>
          <Pagination
            className="pagination-btn"
            color="primary"
            count={totalPages} // 전체 페이지 수
            page={currentPage} // 현재 페이지
            onChange={handlePageChange} // 페이지 변경 시 실행되는 핸들러
          />
        </CustomPagination>
      </MypageContentArea>
    </Wrapper>
  )
}

export default MyReplys;