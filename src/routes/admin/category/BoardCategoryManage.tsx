import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { deleteBoardCategory, getBoardCategoryList } from "../../../apis/boardApi";
import { useMutation, useQuery } from "react-query";
import Loading from "../../../components/Loading";
import {
  CustomPagination,
  SearchArea,
  TitleCenter,
  Wrapper,
} from "../../../styles/CommonStyles";
import {
  Fab,
  IconButton,
  InputAdornment,
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { ColorDots, DeleteIconButton } from "../../../styles/AdminStyle";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BoardCategoryDialog from "./BoardCategoryDialog";
import Swal from "sweetalert2";
import { ContentsArea, CustomCategory } from "../../../styles/BoardStyle";

function BoardCategoryManage() {
  const { user } = useAuth(); //로그인 상태관리
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(""); //검색어
  const [searchType, setSearchType] = useState("name"); // 검색 유형
  const [division, setDivision] = useState("all");
  const [triggerSearch, setTriggerSearch] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalCount, setTotalCount] = useState(0); // 총 게시물 수
  const { t } = useTranslation();

  const display = 10; // 한 페이지에 표시할 게시물 수

  const boardDivision = [
    { value: "NOTICE", label: t("menu.board.notice") },
    { value: "FAQ", label: t("menu.board.FAQ") },
    { value: "QNA", label: t("menu.board.QNA") },
  ];

  // 검색 파라미터 URL 업데이트
  useEffect(() => {
    setSearchParams({
      search: search,
      searchType: searchType,
      currentPage: currentPage.toString(),
    });
  }, [search, searchType, currentPage, setSearchParams]);

  // 데이터를 불러오는 API 호출 함수
  const getCategoryListApi = async () => {
    const params = {
      search: search,
      searchType: searchType,
      currentPage: currentPage, // 페이지 번호
      display: display, //페이지당 표시할 갯수
    };
    const response = await getBoardCategoryList(params);
    setTotalCount(response.data.length);
    return response;
  };

  // 데이터 가져오기 시 로딩 상태 추가
  const getCategoryListWithDelay = async () => {
    setLoading(true); // 로딩 상태 시작

    // 인위적인 지연 시간 추가
    await new Promise((resolve) => setTimeout(resolve, 100));

    const categoryList = await getCategoryListApi(); // 데이터 불러오기
    setLoading(false);
    return categoryList.data;
  };


  const {
    data: boardCategoryList,
    isLoading: boardCategoryListLoading,
    refetch,
  } = useQuery("memberList", getCategoryListWithDelay, {
    enabled: triggerSearch, // 검색 트리거 활성화 시 쿼리 실행
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

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

  // 카테고리 핸들러
  const handleCategoryChange = (e: any) => {
    const selectedDivision = e.target.value;
    setDivision(selectedDivision); 
    setSearch(selectedDivision); // 선택한 값을 즉시 검색어로 설정
    setTriggerSearch(true); // 트리거 활성화
  };


  // 검색 유형 select 변경 이벤트
  const handleSearchTypeChange = (e: any) => {
    setSearchType(e.target.value);
  
    if (e.target.value === "division") {
      setSearch("all"); 
      setDivision("all");
    } 
    else {
      setSearch(""); 
    }
  
    // setTriggerSearch(true); 
  };
  

  //삭제
  const { mutate: deleteCategoryMutation } = useMutation(
    (categoryId : string) => deleteBoardCategory(categoryId),
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
          text: errorCode === "ERR_CG_01" ? t("menu.board.error.ERR_CG_01") : t("menu.board.alert.delete"),
          showConfirmButton: true,
          confirmButtonText: t("text.check")
        });
      },
    }
  );
  const onClickDelete = (categoryId : string) => {
    Swal.fire({
      icon: 'warning',
      title: t("text.delete"),
      text: t("menu.board.alert.delete_confirm_category"),
      showCancelButton: true,
      confirmButtonText: t("text.delete"),
      cancelButtonText: t("text.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // 삭제 API 호출
        deleteCategoryMutation(categoryId as string);
      }
    });
  };

  //추가, 다이얼로그 열기
  const onClickDialog = (categoryId?: string) => {
    setSelectedCategoryId(categoryId);
    setDialogOpen(true);
  };

  // 다이얼로그 닫기
  const handleDialogClose = () => {
    setSelectedCategoryId(undefined);
    setDialogOpen(false);
  };

  //로딩
  if (loading || boardCategoryListLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      {/* 다이얼로그창 컴포넌트 */}
      <BoardCategoryDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        categoryId={selectedCategoryId}
      />
      <TitleCenter>
        {t("menu.admin.category_board")}
        <Tooltip title={t("text.add")}>
          <Fab
            className="add-btn"
            size="small"
            color="primary"
            aria-label="add"
            onClick={() => onClickDialog()}
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
          <MenuItem value="name">{t("menu.board.category_name")}</MenuItem>
          <MenuItem value="nameEn">
            {t("menu.board.category_name_en")}
          </MenuItem>
          <MenuItem value="division">{t("menu.board.division")}</MenuItem>
        </Select>
        {searchType === "division" ? (
          <Select
            className="select-category-item"
            variant="standard"
            labelId="select-category"
            value={division}
            onChange={handleCategoryChange}
          >
            <MenuItem value={"all"}>{t("text.all")}</MenuItem>
            {boardDivision?.map((division: any) => (
              <MenuItem key={division.value} value={division.value}>
                {division.label}
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
                <TableCell className="no-cell">No.</TableCell>
                <TableCell className="name-cell">
                  {t("menu.board.division")}
                </TableCell>
                <TableCell className="name-cell">
                  {t("menu.board.category_name")}
                </TableCell>
                <TableCell className="name-cell">
                  {t("menu.board.category_name_en")}
                </TableCell>
                <TableCell className="name-cell">{t("text.color")}</TableCell>
                <TableCell>{t("text.register_date")}</TableCell>
                <TableCell>{t("text.update_date")}</TableCell>
                <TableCell>{t("text.delete")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boardCategoryList && boardCategoryList.length > 0 ? (
                boardCategoryList
                  ?.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10)
                  .map((categoryItem: any, index: number) => (
                    <TableRow
                      className="row"
                      key={index}
                      onClick={() =>
                        onClickDialog(categoryItem.boardCategoryId)
                      }
                    >
                      <TableCell component="th" scope="row">
                        {(currentPage - 1) * display + index + 1}
                      </TableCell>
                      <TableCell>
                        {categoryItem.division === "NOTICE" ? (
                          t("menu.board.notice")
                        ) : categoryItem.division === "FAQ" ? (
                          t("menu.board.FAQ")
                        ) : categoryItem.division === "QNA" ? (
                          t("menu.board.QNA")
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell>
                        <CustomCategory
                          style={{ color: `${categoryItem.color}` }}
                          className="category"
                        >
                          {categoryItem.name}
                        </CustomCategory>
                      </TableCell>
                      <TableCell>
                        <CustomCategory
                          style={{ color: `${categoryItem.color}` }}
                          className="category"
                        >
                          {categoryItem.nameEn}
                        </CustomCategory>
                      </TableCell>
                      <TableCell>
                        <ColorDots
                          style={{ backgroundColor: `${categoryItem.color}` }}
                        >
                          {" "}
                        </ColorDots>
                      </TableCell>
                      <TableCell>
                        {dayjs(categoryItem.regDt).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell>
                        {dayjs(categoryItem.udtDt).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell>
                        <DeleteIconButton
                          className="icon-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                            onClickDelete(categoryItem.boardCategoryId);
                          }}
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

export default BoardCategoryManage;
