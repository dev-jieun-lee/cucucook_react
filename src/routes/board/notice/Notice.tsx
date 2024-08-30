import { useTranslation } from "react-i18next";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import { ContentsArea, CustomCategory, SearchArea } from "../BoardStyle";
import {
  Fab,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { getBoardCategory, getBoardCategoryList, getBoardList } from "../api";
import { useQuery } from "react-query";
import Loading from "../../../components/Loading";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

function Notice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(""); //검색어
  const [searchType, setSearchType] = useState("all"); // 검색 유형
  const [category, setCategory] = useState("");
  const [boardCategoryId, setBoardCategoryId] = useState(""); // 카테고리 ID 상태
  const [triggerSearch, setTriggerSearch] = useState(true); // 검색 실행 트리거 상태
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 검색 파라미터 URL 업데이트
  useEffect(() => {
    setSearchParams({ search, searchType, category });
  }, [search, searchType, category, setSearchParams]);


  //notice의 카테고리 데이터 받아오기
  const getBoardCategoryListApi = async () => {
    const params = {
      search: "",
      start: "",
      display: "",
    };
    const response = await getBoardCategoryList(params);
    return response.data.filter(
      (category: any) => category.division === "NOTICE"
    );
  };
  const { data: boardCategoryList, isLoading: boardCategoryLoading } = useQuery(
    "boardCategoryList",
    getBoardCategoryListApi
  );

  // 데이터를 불러오는 API 호출 함수
  const getBoardListApi = () => {
    const params = {
      search: searchType === "category" ? "" : search,
      searchType: searchType,
      boardCategoryId: category,
      start: 1,
      display: 10,
    };
    return getBoardList(params);
  };

  const getBoardListWithCategory = async () => {
    try {

      const boardList = await getBoardListApi();

      //NOTICE일 경우만 필터링
      const filteredBoardList = boardList.data.filter(
        (board: any) => board.boardDivision === "NOTICE"
      );

      // 각 보드의 카테고리 조회
      const boardListWithCategory = await Promise.all(
        filteredBoardList.map(async (board: any) => {
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

  // 데이터 가져오기
  const {
    data: boardListWithCategory,
    isLoading: boardListLoading,
    refetch,
  } = useQuery("boardListWithCategory", getBoardListWithCategory, {
    enabled: triggerSearch, // 검색 트리거가 활성화될 때 쿼리 실행
  });

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    setTriggerSearch(true); // 검색 트리거를 true로 설정하여 검색 실행
    refetch(); // refetch를 호출해 쿼리를 수동으로 실행
  };

  // 엔터 키로 검색 실행 핸들러
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  //검색 select 변경 이벤트
  const handleSearchTypeChange = (e: any) => {
    setSearchType(e.target.value);
    // 카테고리를 선택할 경우 search 값 초기화
    if (e.target.value !== "category") {
      setSearch("");
    }
  };

  //카테고리 핸들러, 카테고리 검색
  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
    setTriggerSearch(true); 
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
  if (boardListLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <TitleCenter>
        {t("menu.board.notice")}
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
            <MenuItem value={""} >{t("sentence.choose")}</MenuItem>
            {boardCategoryList?.map((category: any) => (
              <MenuItem
                key={category.boardCategoryId}
                value={category.boardCategoryId}
              >
                {category.name}
              </MenuItem>
            ))}
          </Select>
        ):(<></>) }
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
      <ContentsArea>
        <TableContainer className="table-container" component={Paper}>
          <Table
            className="table"
            sx={{ minWidth: 650 }}
            aria-label="board table"
          >
            <TableHead className="head">
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>{t("text.category")}</TableCell>
                <TableCell>{t("text.title")}</TableCell>
                <TableCell>{t("text.writer")}</TableCell>
                <TableCell>{t("text.register_date")}</TableCell>
                <TableCell>{t("text.view_count")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boardListWithCategory && boardListWithCategory.length > 0 ? (
                boardListWithCategory.map((boardItem: any, index: number) => (
                  <TableRow
                    className="row"
                    key={index}
                    onClick={() => onClickDetail(boardItem.boardId)}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <CustomCategory
                        style={{ color: `${boardItem.category.color}` }}
                        className="category"
                      >
                        [ {boardItem.category.name} ]
                      </CustomCategory>
                    </TableCell>
                    <TableCell>{boardItem.title}</TableCell>
                    <TableCell>{boardItem.userName}</TableCell>
                    <TableCell>
                      {moment(boardItem.udtDt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>{boardItem.viewCount}</TableCell>
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
        <Stack className="pagination" spacing={2}>
          <Pagination className="pagination-btn" count={10} color="primary" />
        </Stack>
      </ContentsArea>
    </Wrapper>
  );
}

export default Notice;
