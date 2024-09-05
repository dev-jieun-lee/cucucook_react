import { useTranslation } from "react-i18next";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Fab, IconButton, InputAdornment, MenuItem, Pagination, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { ContentsArea, CustomCategory, SearchArea } from "../BoardStyle";
import React, { useEffect, useState } from "react";
import { getBoardCategory, getBoardCategoryList, getBoardList } from "../api";
import { useQuery } from "react-query";
import Loading from "../../../components/Loading";
import moment from "moment";
import { useAuth } from "../../../auth/AuthContext";

function Qna() {
  const { user } = useAuth(); //로그인 상태관리
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(""); //검색어
  const [searchType, setSearchType] = useState("all"); // 검색 유형
  const [category, setCategory] = useState("all");
  const [triggerSearch, setTriggerSearch] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalCount, setTotalCount] = useState(0); // 총 게시물 수
  const { t } = useTranslation();
  const navigate = useNavigate();

  const display = 10; // 한 페이지에 표시할 게시물 수

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
      (category: any) => category.division === "QNA"
    );
  };
  const { data: boardCategoryList, isLoading: boardCategoryLoading } = useQuery(
    "boardCategoryList",
    getBoardCategoryListApi
  );

  // 데이터를 불러오는 API 호출 함수
  const getBoardListApi = async () => {
    const params = {
      division: "QNA",
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

    // 데이터 가져오기
    const {
      data: boardListWithCategory,
      isLoading: boardListLoading,
      refetch,
    } = useQuery("boardListWithCategory", getBoardListWithCategory, {
      enabled: triggerSearch, // 검색 트리거가 활성화될 때 쿼리 실행
    });
  
console.log(boardListWithCategory);


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
      console.log(page);
  
      setCurrentPage(page);
      setTriggerSearch(true); // 페이지 변경 시 검색 트리거 활성화
      refetch();
    };
  
    //상세 페이지로 이동
    const onClickDetail = (boardId: string) => {
      navigate(`/qna/${boardId}`);
    };
    //추가 페이지로 이동
    const onClickAdd = () => {
      navigate(`/qna/form`);
    };
  
    //로딩
    if (boardListLoading) {
      return <Loading />;
    }
  


  return(
    <Wrapper>
      <TitleCenter>
        {t("menu.board.QNA")}
        {user? (
          <Tooltip title={t("text.writing")}>
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
                {category.name}
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
                // 데이터를 부모 글과 답글로 그룹화
                boardListWithCategory
                  .reduce((acc: any[], boardItem: any) => {
                    if (boardItem.status === "0") {
                      // 부모 글
                      acc.push({ ...boardItem, isParent: true });
                    } else if (boardItem.status === "1" && boardItem.pBoardId === boardItem.boardId) {
                      // 답글
                      const parentIndex = acc.findIndex(
                        (item) => item.boardId === boardItem.pBoardId && item.isParent
                      );
                      if (parentIndex !== -1) {
                        // 부모 글 바로 밑에 답글을 삽입
                        acc.splice(parentIndex + 1, 0, { ...boardItem, isParent: false });
                      }
                    }
                    return acc;
                    }, [])
                    ?.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10)
                    .map((boardItem: any, index: number) => (
                      <React.Fragment key={index}>
                        {/* 부모 글 렌더링 */}
                        {boardItem.isParent && (
                          <TableRow
                            className="row"
                            onClick={() => onClickDetail(boardItem.boardId)}
                          >
                            <TableCell component="th" scope="row">
                              {(currentPage - 1) * display + index + 1}
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
                        )}
                        {/* 답글 렌더링 */}
                        {!boardItem.isParent && (
                          <TableRow
                            className="row reply-row"
                            onClick={() => onClickDetail(boardItem.boardId)}
                          >
                            <TableCell component="th" scope="row" style={{ paddingLeft: "40px" }}>
                              ↳ {(currentPage - 1) * display + index + 1}
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
                        )}
                      </React.Fragment>
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
          <Pagination
            className="pagination-btn"
            count={Math.ceil(totalCount / display)} // 총 페이지 수 계산
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </ContentsArea>
    </Wrapper>
  )
}

export default Qna;