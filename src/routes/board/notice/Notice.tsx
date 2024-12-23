import { useTranslation } from "react-i18next";
import {
  CustomPagination,
  SearchArea,
  TitleCenter,
  Wrapper,
} from "../../../styles/CommonStyles";
import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  List,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  getBoardCategory,
  getBoardCategoryList,
  getBoardList,
} from "../../../apis/boardApi";
import { useQuery } from "react-query";
import Loading from "../../../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../../auth/AuthContext";
import {
  BoardHeaderListItem,
  BoardRowListItem,
  ContentsArea,
  CustomCategory,
} from "../../../styles/BoardStyle";
import dayjs from "dayjs";
import NoData from "../../../components/NoData";

function Notice() {
  const { user } = useAuth(); //로그인 상태관리
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(""); //검색어
  const [searchType, setSearchType] = useState("all"); // 검색 유형
  const [category, setCategory] = useState("all");
  const [triggerSearch, setTriggerSearch] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalCount, setTotalCount] = useState(0); // 총 게시물 수
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language;

  const display = 10; // 한 페이지에 표시할 게시물 수

  // 검색 파라미터 URL 업데이트
  useEffect(() => {
    setSearchParams({
      search: search,
      searchType: searchType,
      currentPage: currentPage.toString(),
      category: category,
    });
  }, [search, searchType, currentPage, category, setSearchParams]);

  //notice의 카테고리 데이터 받아오기
  const getBoardCategoryListApi = async () => {
    const params = {
      search: "",
      start: "",
      searchType: "",
      display: "",
    };
    const response = await getBoardCategoryList(params);
    if (response && response.data) {
      return response.data.filter(
        (category: any) => category.division === "NOTICE"
      );
    }

    return [];
  };
  const { data: boardCategoryList, isLoading: boardCategoryLoading } = useQuery(
    "boardCategoryList",
    getBoardCategoryListApi
  );

  // 데이터를 불러오는 API 호출 함수
  const getBoardListApi = async () => {
    const params = {
      division: "NOTICE",
      search: searchType === "category" ? "" : search,
      searchType: searchType,
      boardCategoryId: category,
      currentPage: currentPage, // 페이지 번호
      display: display, //페이지당 표시할 갯수
    };
    const response = await getBoardList(params);
    setTotalCount(response.data.length);
    return response;
  };

  const getBoardListWithCategory = async () => {
    try {
      const boardList = await getBoardListApi();

      // 각 보드의 카테고리 조회
      const boardListWithCategory = await Promise.all(
        boardList.data.map(async (board: any) => {
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
  } = useQuery("boardListWithCategory", getBoardListWithDelay, {
    enabled: triggerSearch, // 검색 트리거 활성화 시 쿼리 실행
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

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
    if (category) {
      setTriggerSearch(true);
      refetch();
    }
  }, [category, refetch]);

  // 검색 유형 select 변경 이벤트
  const handleSearchTypeChange = (e: any) => {
    setSearchType(e.target.value);
    // 카테고리를 선택할 경우 search 값 초기화
    if (e.target.value === "category") {
      setSearch(""); // 카테고리 검색에서는 검색어 초기화
    } else {
      setCategory(""); // 카테고리 외 검색 유형에서는 카테고리 초기화
    }
  };

  //카테고리 핸들러
  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (event: any, page: any) => {
    setCurrentPage(page);
    setTriggerSearch(true); // 페이지 변경 시 검색 트리거 활성화
    refetch();
  };

  //상세 페이지로 이동
  const onClickDetail = (boardId: string) => {
    navigate(`/notice/${boardId}`);
  };
  //추가 페이지로 이동
  const onClickAdd = () => {
    navigate(`/notice/form`);
  };

  //로딩
  if (loading || boardListLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <TitleCenter>
        {t("menu.board.notice")}
        {user?.role === "0" ? (
          <Tooltip title={t("text.add")}>
            <Fab
              className="add-btn"
              size="small"
              color="primary"
              aria-label="add"
              onClick={onClickAdd}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        ) : (
          <></>
        )}
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
          <MenuItem value="category">{t("text.category")}</MenuItem>
        </Select>
        {searchType === "category" ? (
          <Select
            className="select-category-item"
            variant="standard"
            labelId="select-category"
            value={category}
            onChange={handleCategoryChange}
          >
            <MenuItem value={"all"}>{t("text.all")}</MenuItem>
            {boardCategoryList?.map((category: any) => (
              <MenuItem
                key={category.boardCategoryId}
                value={category.boardCategoryId}
              >
                {currentLang === "ko" ? category.name : category.nameEn}
              </MenuItem>
            ))}
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
      <ContentsArea>
        <List>
          <BoardHeaderListItem className="list-item header">
            <Box className="no">
              <span>No.</span>
            </Box>
            <Box className="category">
              <span>{t("text.category")}</span>
            </Box>
            <Box className="title">
              <span>{t("text.title")}</span>
            </Box>
            <Box className="writer">
              <span>{t("text.writer")}</span>
            </Box>
            <Box className="date">
              <span>{t("text.register_date")}</span>
            </Box>
            <Box className="date">
              <span>{t("text.update_date")}</span>
            </Box>
            <Box className="view">
              <span>{t("text.view_count")}</span>
            </Box>
          </BoardHeaderListItem>
          {boardListWithCategory && boardListWithCategory.length > 0 ? (
            boardListWithCategory
              ?.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10)
              .map((item, index) => (
                <BoardRowListItem
                  className="list-item"
                  key={item.boardId}
                  onClick={() => onClickDetail(item.boardId)}
                >
                  <Box className="no">
                    {(currentPage - 1) * display + index + 1}
                  </Box>
                  <Box className="title-area">
                    <Box className="category">
                      <CustomCategory
                        style={{ color: `${item.category.color}` }}
                        className="category"
                      >
                        [{" "}
                        {currentLang === "ko"
                          ? item.category.name
                          : item.category.nameEn}{" "}
                        ]
                      </CustomCategory>
                    </Box>
                    <Box className="title">
                      <span>{item.title}</span>
                    </Box>
                  </Box>
                  <Box className="writer">
                    <span>{item.userName}</span>
                  </Box>
                  <Box className="date">
                    <span>{dayjs(item.udtDt).format("YYYY-MM-DD HH:mm")}</span>
                  </Box>
                  <Box className="date">
                    <span>{dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}</span>
                  </Box>
                  <Box className="view">
                    <span>{item.viewCount}</span>
                  </Box>
                </BoardRowListItem>
              ))
          ) : (
            <NoData/>
          )}
        </List>
        <CustomPagination className="pagination" spacing={2}>
          <Pagination
            className="pagination-btn"
            count={Math.ceil(totalCount / display)} // 총 페이지 수 계산
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </CustomPagination>
      </ContentsArea>
    </Wrapper>
  );
}

export default Notice;
