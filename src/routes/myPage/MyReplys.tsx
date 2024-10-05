import { useTranslation } from "react-i18next";
import { PageTitleBasic, SearchArea, TitleBox, Wrapper } from "../../styles/CommonStyles";
import { Box, Button, IconButton, InputAdornment, List, ListItem, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
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
import { MypageContentArea } from "../../styles/MypageStyle";

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
  const [page, setPage] = useState(0);
  const [pageSize] = useState(100); // 처음에 불러오는 데이터 갯수
  const [hasMore, setHasMore] = useState(true); // 더 로드할 데이터가 있는지 여부
  const [searchType, setSearchType] = useState("content"); // 기본값으로 'content'
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("comment");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sortDirection, setSortDirection] = useState("DESC"); // 정렬 방향 (DESC 또는 ASC)
  const [myReplies, setMyReplies] = useState<Reply[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [loading, setLoading] = useState(true);

  const memberId = user ? user.memberId.toString() : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   if (searchKeyword.trim()) {
  //     // 검색어가 있으면 검색 결과에 따라 정렬
  //     handleSearch();
  //   } else {
  //     // 검색어가 없으면 기본 댓글 로드
  //     loadReplies();
  //   }
  // }, [sortOption, sortDirection, page]);

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

  // 데이터 가져오기 시 로딩 상태 추가
  const getRepliesWithDelay = async () => {
    setLoading(true); // 로딩 상태 시작

    // 인위적인 지연 시간 추가
    await new Promise((resolve) => setTimeout(resolve, 100));

    const newReplies = await fetchMyReplies(
      memberId!,
      Math.max(page, 0), // 페이지 번호가 음수일 경우 0으로 처리,
      pageSize,
      sortOption,
      sortDirection
    );
    setMyReplies(newReplies);
    setLoading(false);
    return newReplies;
  };

  //데이터 받아오기
  const { data: newReplies, isLoading: RepliesLoading } = useQuery(
    "newReplies",
    getRepliesWithDelay
  );

  console.log(newReplies);
  console.log(myReplies);
  


  // const loadReplies = async () => {
  //   if (!memberId) {
  //     console.error("사용자 정보 없음");

  //     await Swal.fire({
  //       title: "잘못된 접근입니다",
  //       text: "사용자 정보가 없으므로 로그인 화면으로 이동합니다.",
  //       icon: "warning",
  //       confirmButtonText: "확인",
  //     });

  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     setLoading(true); // 로딩 상태 시작

  //     // 인위적인 지연 시간 추가
  //     await new Promise((resolve) => setTimeout(resolve, 100));

  //     const newReplies = await fetchMyReplies(
  //       memberId,
  //       Math.max(page, 0), // 페이지 번호가 음수일 경우 0으로 처리,
  //       pageSize,
  //       sortOption,
  //       sortDirection
  //     );
  //     if (page === 0) {
  //       setMyReplies(newReplies); // 처음 로드 시에는 새로 불러온 데이터로 초기화
  //     } else {
  //       // setMyReplies((prevReplies) => [...prevReplies, ...newReplies]); // 추가로 불러온 댓글은 기존 목록에 추가
  //     }
  //     setHasMore(newReplies.length === pageSize); // 더 로드할 댓글이 있는지 확인

  //     setLoading(false);

  //   } catch (error) {
  //     console.error("데이터 로딩 실패:", error);
  //   }
  // };

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
        // loadReplies();
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
  if (loading ) {
    return <Loading />;
  }

  console.log(myReplies);
  

  return(
    <Wrapper>
      <TitleBox>
        <PageTitleBasic>{t("mypage.myCommnet")}</PageTitleBasic>
        <Button variant="outlined">{t("text.go_back")}</Button>
      </TitleBox>
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
          <ListItem className="list-item header">
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">No.</Typography>
            </Box>
            <Box sx={{ flex: 2 }}>
              <Typography variant="h6">{t("text.recipe")} {t("text.title")}</Typography>
            </Box>
            <Box sx={{ flex: 3 }}>
              <Typography variant="h6">{t("text.comment")}</Typography>
            </Box>
            <Box sx={{ flex: 2 }}>
              <Typography variant="h6">{t("text.register_date")}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{t("text.delete")}</Typography>
            </Box>
          </ListItem>
          {myReplies && myReplies.length > 0 ? (
            myReplies.map((reply, index) => (
              <ListItem
                className="list-item"
                key={reply.commentId}
                // ref={index === myReplies.length - 1 ? lastReplyRef : null} // 마지막 댓글에 대한 ref 설정
              >
                <Box sx={{ flex: 1 }}>
                  <Typography>{index + 1}</Typography>
                </Box>
                <Box sx={{ flex: 2 }}>
                  <Typography>{reply.title || ""}</Typography>
                </Box>
                <Box sx={{ flex: 3 }}>
                  <Typography>
                    {reply.comment || ""}
                    {/* {reply.comment ? reply.comment.slice(0, 10) + "..." : ""} */}
                  </Typography>
                </Box>
                <Box sx={{ flex: 2 }}>
                  <Typography>
                    {dayjs(reply.regDt).format("YYYY-MM-DD HH:mm")}
                  </Typography>
                </Box>

                {/* 게시글 보기 섹션 */}
                {/* <Box sx={{ flex: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/recipe/member_recipe/${reply.recipeId}`)
                    }
                  >
                    레시피 보기
                  </Button>
                </Box> */}

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
                          reply.hasChildComment
                        );
                      }
                    }}
                  >
                    삭제
                  </Button>
                </Box>
              </ListItem>
            ))
          ) : (
            <Typography>{t("sentence.no_data")}</Typography>
          )}
        </List>
      </MypageContentArea>
      {/* <ContentsArea>
        <TableContainer className="table-container" component={Paper}>
          <Table
            className="table"
            sx={{ minWidth: 650 }}
            aria-label="board table"
          >
            <TableHead className="head">
              <TableRow>
                <TableCell className="no-cell">No.</TableCell>
                <TableCell className="category-cell">{t("text.recipe")}</TableCell>
                <TableCell className="title-cell">{t("text.comment")}</TableCell>
                <TableCell>{t("text.register_date")}</TableCell>
                <TableCell>{t("text.delete")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myReplies && myReplies.length > 0 ? (
                myReplies
                  .map((item: any, index: number) => (
                    <TableRow
                      className="row"
                      key={index}
                      // onClick={() => onClickDetail(boardItem.boardId)}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.comment}</TableCell>
                      <TableCell>
                        {dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell>
                        <DeleteIconButton
                          className="icon-btn"
                          // onClick={(event) => {
                          //   event.stopPropagation();
                          //   onClickDelete(categoryItem.boardCategoryId);
                          // }}
                        >
                          <DeleteForeverIcon
                            color="error"
                            className="delete-icon"
                          />
                        </DeleteIconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {t("sentence.no_data")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ContentsArea> */}
    </Wrapper>
  )
}

export default MyReplys;