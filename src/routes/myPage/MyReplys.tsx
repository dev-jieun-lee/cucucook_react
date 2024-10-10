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
  Pagination,
} from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomPagination, SearchArea, TitleCenter, Wrapper } from "../../styles/CommonStyles";
import {
  deleteReply,
  fetchMyReplies,
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
import { useMutation, useQuery } from "react-query";
import Loading from "../../components/Loading";


const MyReplys: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1); // 페이지는 1부터 시작
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태 추가
  const [search, setSearch] = useState(""); //검색어
  const [searchType, setSearchType] = useState("all"); // 검색 유형
  const [triggerSearch, setTriggerSearch] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortDirection, setSortDirection] = useState("DESC"); // 정렬 방향 (DESC 또는 ASC)
  const [sortOption, setSortOption] = useState("comment");

  let memberId = user ? user.memberId.toString() : null;

  const itemsPerPage = 10; // 페이지 당 보여줄 아이템 수

  // 검색 파라미터 URL 업데이트
  useEffect(() => {
    setSearchParams({
      search: search,
      searchType: searchType,
      currentPage: currentPage.toString()
    });
  }, [search, searchType, currentPage, setSearchParams]);

  // 데이터를 불러오는 API 호출 함수
  const getCommentListApi = async () => {
    const writesData = await fetchMyReplies(
      memberId!,
      currentPage,
      itemsPerPage,
      sortOption,
      sortDirection,
      search,
      searchType
    ); 
    setTotalPages(Math.ceil(writesData.totalItems / itemsPerPage));
    return writesData;
  };

  // 데이터 가져오기 시 로딩 상태 추가
  const getCommentWithDelay = async () => {
    setLoading(true); // 로딩 상태 시작

    // 인위적인 지연 시간 추가
    await new Promise((resolve) => setTimeout(resolve, 100));

    const comments= await getCommentListApi(); // 데이터 불러오기

    setLoading(false);
    return comments.comments;
  };

  

  const {
    data: commentList,
    isLoading: commentListLoading,
    refetch,
  } = useQuery(["comments", currentPage], getCommentWithDelay, {
    enabled: triggerSearch, // 검색 트리거 활성화 시 쿼리 실행
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
  console.log(commentList);


  // 트리거 변경 시 데이터 초기화 및 로딩 처리
  useEffect(() => {
    if (triggerSearch) {
      refetch(); // 데이터 가져오기
      setTriggerSearch(false); // 트리거를 false로 초기화
    }
  }, [triggerSearch, refetch]);

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

  // 페이지 변경 핸들러
  const handlePageChange = (event: any, page: any) => {
    setCurrentPage(page);
    setTriggerSearch(true); // 페이지 변경 시 검색 트리거 활성화
    refetch();
  };

  // 검색 유형 select 변경 이벤트
  const handleSearchTypeChange = (e: any) => {
    setSearchType(e.target.value);
  };

  //상세 페이지로 이동
  const onClickDetail = (id: string) => {
    navigate(`/recipe/member_recipe/${id}`);
  };
  
  //삭제
  const { mutate: deleteCommentMutation } = useMutation(
    (commentId : string) => deleteReply(memberId!, commentId),
    {
      onSuccess: (data) => {
        Swal.fire({
          icon: 'success',
          title: t("text.delete"),
          text: t("menu.board.alert.delete"),
          showConfirmButton: true,
          confirmButtonText: t("text.check")
        });
        window.location.reload();
      },
      onError: (error : any) => {
        const errorCode = error.response?.data.errorCode ;
        Swal.fire({
          icon: 'error',
          title: t("text.delete"),
          text:  t("menu.board.alert.delete_error"),
          showConfirmButton: true,
          confirmButtonText: t("text.check")
        });
      },
    }
  );
  const onClickDelete = (commentId : string, hasChildComment : boolean) => {
    if(hasChildComment === true){
      Swal.fire({
        icon: 'error',
        title: t("text.delete"),
        text: t("mypage.comment_delete_error"),
        showConfirmButton: true,
        confirmButtonText: t("text.check")
      });
    }
    else{
      Swal.fire({
        icon: 'warning',
        title: t("text.delete"),
        text:  t("mypage.confirm_delete", { value: t("text.comment") }),
        showCancelButton: true,
        confirmButtonText: t("text.delete"),
        cancelButtonText: t("text.cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          // 삭제 API 호출
          deleteCommentMutation(commentId as string);
        }
      });
    }
  };
  


  //로딩
  if (loading || commentListLoading ) {
    return <Loading />;
  }


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
          onChange={handleSearchTypeChange}
        >
          <MenuItem value="all">
            {t("text.all")}
          </MenuItem>
          <MenuItem value="title">{t("text.recipe")}</MenuItem>
          <MenuItem value="comment">{t("text.comment")}</MenuItem>
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
          {commentList && commentList.length > 0 ? (
            commentList.map((item : any, index : any) => (
              <MypageRowListItem
                className="list-item"
                key={item.commentId}
                onClick={() => onClickDetail(item.recipeId)}
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
                    onClick={(event) => {
                      event.stopPropagation();
                      onClickDelete(item.commentId, item.hasChildComment);
                    }}
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
  );
};

export default MyReplys;