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
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  Tooltip,
} from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { activityStyles, scrollButtonStyles } from "./myPageStyles";
import {
  CustomPagination,
  PageTitleBasic,
  SearchArea,
  TitleBox,
  TitleCenter,
  Wrapper,
} from "../../styles/CommonStyles";
import { fetchMyWrites } from "../../apis/mypageApi";
import { getBoardCategory, getBoardCategoryList } from "../../apis/boardApi";
import { useAuth } from "../../auth/AuthContext";
import { useQuery } from "react-query";
import SearchIcon from "@mui/icons-material/Search";
import {
  MypageContentArea,
  MypageHeaderListItem,
  MypageRowListItem,
} from "../../styles/MypageStyle";
import dayjs from "dayjs";
import { DeleteIconButton } from "../../styles/AdminStyle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Loading from "../../components/Loading";



const MyWrites: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberId = user ? user.memberId.toString() : null;
  const [currentPage, setCurrentPage] = useState(1); // 페이지는 1부터 시작
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태 추가
  const [boardDivision, setBoardDivision] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(""); //검색어
  const [searchType, setSearchType] = useState("all"); // 검색 유형
  const [triggerSearch, setTriggerSearch] = useState(true);

  const itemsPerPage = 10; // 페이지 당 보여줄 아이템 수

  // 검색 파라미터 URL 업데이트
  useEffect(() => {
    setSearchParams({
      search: search,
      searchType: searchType,
      currentPage: currentPage.toString(),
      boardDivision : boardDivision
    });
  }, [search, searchType, currentPage, boardDivision, setSearchParams]);

  //카테고리 포함 게시글 리스트 받아오기
  const getBoardListWithCategory = async () => {
    try {
      const writesData = await fetchMyWrites(
        memberId!,
        currentPage,
        itemsPerPage,
        boardDivision,
        search,
        searchType
      ); // 게시글 리슽 조회
      setTotalPages(Math.ceil(writesData.totalItems / itemsPerPage));


      // 각 보드의 카테고리 조회
      const boardListWithCategory = await Promise.all(
        writesData.boards.map(async (board: any) => {
          const categoryData = await getBoardCategory(board.boardCategoryId); // 카테고리 조회
          return {
            ...board,
            category: categoryData.data, // 카테고리 정보를 추가
          };
        })
      );
      return boardListWithCategory;
    } catch (error) {
      console.error(error);
      return [];
    }
  };



  // 데이터 가져오기 시 로딩 상태 추가
  const getBoardListWithDelay = async () => {
    setLoading(true); // 로딩 상태 시작

    // 인위적인 지연 시간 추가
    await new Promise((resolve) => setTimeout(resolve, 100));

    const boardList = await getBoardListWithCategory(); // 데이터 불러오기
    setLoading(false);
    return boardList;
  };

  const {
    data: boardListWithCategory,
    isLoading: boardListLoading,
    refetch,
  } = useQuery(
    ["boardListWithCategory", currentPage, search, searchType, boardDivision],
    getBoardListWithDelay,
    {
      enabled: triggerSearch, // 검색 트리거 활성화 시 쿼리 실행
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
    }
  );



  // 트리거 변경 시 데이터 초기화 및 로딩 처리
  useEffect(() => {
    if (triggerSearch) {
      setTriggerSearch(false); // 트리거를 false로 초기화
      refetch(); // 데이터 가져오기
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

  // 카테고리 변경 시 검색 트리거 활성화 및 데이터 불러오기
  useEffect(() => {
    if (boardDivision) {
      setTriggerSearch(true);
      refetch();
    }
  }, [boardDivision, refetch]);

  // 검색 유형 select 변경 이벤트
  const handleSearchTypeChange = (e: any) => {
    setSearchType(e.target.value);
    // 카테고리를 선택할 경우 search 값 초기화
    if (e.target.value === "boardDivision") {
      setSearch(""); // 카테고리 검색에서는 검색어 초기화
    } else {
      setBoardDivision("all"); // 카테고리 외 검색 유형에서는 카테고리 초기화
    }
  };

  //카테고리 핸들러
  const handleCategoryChange = (e: any) => {
    setBoardDivision(e.target.value);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (event: any, page: number) => {
    setCurrentPage(page);
    setTriggerSearch(true); // 페이지 변경 시 검색 트리거 활성화
    refetch();
  };

  //상세 페이지로 이동
  const onClickDetail = (boardId: string, division: string) => {
    switch (division) {
      case "NOTICE":
        navigate(`/notice/${boardId}`);
        break;
    
        ///////추가 구현 필요!!!! 넘어가면 해당 게시글 열리도록?
      case "FAQ":
        navigate(`/faq`);
        break;
    
      case "QNA":
        navigate(`/qna/${boardId}`);
        break;
    
      default:
        break;
    }
  };


  //로딩
  if (loading || boardListLoading ) {
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
        {t("mypage.myWriting")}
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
            {t("text.title")} + {t("text.content")}
          </MenuItem>
          <MenuItem value="title">{t("text.title")}</MenuItem>
          <MenuItem value="contents">{t("text.content")}</MenuItem>
          <MenuItem value="division">{t("menu.board.division")}</MenuItem>
        </Select>
        {searchType === "division" ? (
          <Select
            className="select-category-item"
            variant="standard"
            labelId="select-category"
            value={boardDivision}
            onChange={handleCategoryChange}
          >
            <MenuItem value={"all"}>{t("text.all")}</MenuItem>
            <MenuItem value={"NOTICE"}>{t("menu.board.notice")}</MenuItem>
            <MenuItem value={"FAQ"}>{t("menu.board.FAQ")}</MenuItem>
            <MenuItem value={"QNA"}>{t("menu.board.QNA")}</MenuItem>
          </Select>
        ) : (
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
        )} 
      </SearchArea>
      <MypageContentArea>
        <List>
          <MypageHeaderListItem className="list-item header">
            <Box className="no">
              <span>No.</span>
            </Box>
            <Box className="division">
              <span>{t("menu.board.division")}</span>
            </Box>
            <Box className="title">
              <span>{t("text.title")}</span>
            </Box>
            <Box className="date">
              <span>{t("text.register_date")}</span>
            </Box>
            {/* <Box className="delete">
              <span>{t("text.delete")}</span>
            </Box> */}
          </MypageHeaderListItem>
          {boardListWithCategory && boardListWithCategory.length > 0 ? (
            boardListWithCategory.map((item, index) => (
              <MypageRowListItem
                className="list-item"
                key={item.boardId}
                onClick={() => onClickDetail(item.boardId, item.boardDivision)}
              >
                <Box className="no">
                  <span>{(currentPage - 1) * itemsPerPage + index + 1}</span>
                </Box>
                <Box className="content">
                  <Box className="division">
                    {item.boardDivision === "NOTICE" ? (
                      t("menu.board.notice")
                    ) : item.boardDivision === "FAQ" ? (
                      t("menu.board.FAQ")
                    ) : item.boardDivision === "QNA" ? (
                      t("menu.board.QNA")
                    ) : (
                      <></>
                    )}
                  </Box>
                  <Box className="title">
                    <span>{item.title}</span>
                  </Box>
                </Box>
                <Box className="date">
                  <span>{dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}</span>
                </Box>
                {/* <Box className="delete">
                  <DeleteIconButton
                    className="icon-btn"
                    // onClick={(event) => {
                    //   event.stopPropagation();
                    //   onClickDelete(categoryItem.boardCategoryId);
                    // }}
                  >
                    <DeleteForeverIcon color="error" className="delete-icon" />
                  </DeleteIconButton>
                </Box> */}
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

export default MyWrites;
