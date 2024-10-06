import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
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
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteRecipeCategory,
  getRecipeCategoryListForAdmin,
} from "../../../apis/recipeApi";
import { useAuth } from "../../../auth/AuthContext";
import Loading from "../../../components/Loading";
import { DeleteIconButton } from "../../../styles/AdminStyle";
import { ContentsArea, CustomCategory } from "../../../styles/BoardStyle";
import {
  CustomPagination,
  SearchArea,
  TitleCenter,
  Wrapper,
} from "../../../styles/CommonStyles";
import RecipeCategoryDialog from "./RecipeCategoryDialog";
import { handleApiError } from "../../../hooks/errorHandler";

function RecipeCategoryManage() {
  const navigate = useNavigate();
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

  const recipeDivision = [
    { value: "C", label: t("text.category") },
    { value: "M", label: t("text.cooking-method") },
    { value: "L", label: t("text.difficulty-level") },
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
      search,
      searchType,
      display,
      start: (currentPage - 1) * display,
    };
    const response = await getRecipeCategoryListForAdmin(params);
    setTotalCount(response.data.addData.totalCnt);
    return response.data;
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
    data: recipeCategoryList,
    isLoading: recipeCategoryListLoading,
    refetch,
  } = useQuery(["recipeCategoryList", currentPage], getCategoryListWithDelay, {
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
    } else {
      setSearch("");
    }

    setTriggerSearch(true);
  };

  //삭제
  const { mutate: deleteCategoryMutation } = useMutation(
    (recipeCategoryId: string) => {
      const params = { recipeCategoryId };
      return deleteRecipeCategory(params);
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: t("text.delete"),
            text: t("recipe.alert.delete_recipe_category_sucecss"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: t("text.delete"),
            text:
              data.message === "ERR_CG_01"
                ? t("recipe.error.ERR_CG_01")
                : t("recipe.alert.delete_recipe_category_error"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          });
        }
      },
      onError: (error) => {
        handleApiError(error, navigate, t);
      },
    }
  );
  const onClickDelete = (recipeCategoryId: string) => {
    Swal.fire({
      icon: "warning",
      title: t("text.delete"),
      text: t("recipe.alert.delete_recipe_category_confirm"),
      showCancelButton: true,
      confirmButtonText: t("text.delete"),
      cancelButtonText: t("text.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // 삭제 API 호출
        deleteCategoryMutation(recipeCategoryId as string);
      }
    });
  };

  //추가, 다이얼로그 열기
  const onClickDialog = (recipeCategoryId?: string) => {
    setSelectedCategoryId(recipeCategoryId);
    setDialogOpen(true);
  };

  // 다이얼로그 닫기
  const handleDialogClose = () => {
    setSelectedCategoryId(undefined);
    setDialogOpen(false);
  };

  //로딩
  if (loading || recipeCategoryListLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      {/* 다이얼로그창 컴포넌트 */}
      <RecipeCategoryDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        categoryId={selectedCategoryId}
      />
      <TitleCenter>
        {t("menu.admin.category_recipe")}
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
          <MenuItem value="name">{t("menu.recipe.category_name")}</MenuItem>
          <MenuItem value="nameEn">
            {t("menu.recipe.category_name_en")}
          </MenuItem>
          <MenuItem value="division">{t("menu.recipe.division")}</MenuItem>
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
            {recipeDivision?.map((division: any) => (
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
            aria-label="recipe table"
          >
            <TableHead className="head">
              <TableRow>
                <TableCell className="no-cell">No.</TableCell>
                <TableCell className="name-cell">
                  {t("menu.recipe.division")}
                </TableCell>
                <TableCell className="name-cell">
                  {t("menu.recipe.category_name")}
                </TableCell>
                <TableCell className="name-cell">
                  {t("menu.recipe.category_name_en")}
                </TableCell>
                <TableCell>{t("text.register_date")}</TableCell>
                <TableCell>{t("text.update_date")}</TableCell>
                <TableCell>{t("text.delete")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipeCategoryList && recipeCategoryList.length > 0 ? (
                recipeCategoryList.map((categoryItem: any, index: number) => (
                  <TableRow
                    className="row"
                    key={index}
                    onClick={() => onClickDialog(categoryItem.recipeCategoryId)}
                  >
                    <TableCell component="th" scope="row">
                      {(currentPage - 1) * display + index + 1}
                    </TableCell>
                    <TableCell>
                      {categoryItem.division === "C" ? (
                        t("text.category")
                      ) : categoryItem.division === "M" ? (
                        t("text.cooking-method")
                      ) : categoryItem.division === "L" ? (
                        t("text.difficulty-level")
                      ) : (
                        <></>
                      )}
                    </TableCell>
                    <TableCell>
                      <CustomCategory className="category">
                        {categoryItem.name}
                      </CustomCategory>
                    </TableCell>
                    <TableCell>
                      <CustomCategory className="category">
                        {categoryItem.nameEn}
                      </CustomCategory>
                    </TableCell>
                    <TableCell>
                      {dayjs(categoryItem.regDt).format("YYYY-MM-DD HH:mm")}
                    </TableCell>
                    <TableCell>
                      {categoryItem.uptDt === null
                        ? ""
                        : dayjs(categoryItem.uptDt).format("YYYY-MM-DD HH:mm")}
                    </TableCell>
                    <TableCell>
                      <DeleteIconButton
                        className="icon-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          onClickDelete(categoryItem.recipeCategoryId);
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

export default RecipeCategoryManage;
