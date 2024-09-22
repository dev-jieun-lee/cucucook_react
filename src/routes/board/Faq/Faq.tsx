import { useTranslation } from "react-i18next";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import {
  AccordionTitle,
  ContentsArea,
  CustomCategory,
  SearchArea,
} from "../BoardStyle";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Fab,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { deleteBoard, getBoard, getBoardCategory, getBoardCategoryList, getBoardList } from "../api";
import { useMutation, useQuery } from "react-query";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Loading from "../../../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import dompurify from "dompurify";
import Swal from "sweetalert2";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../../auth/AuthContext";

function Faq() {
  const { user } = useAuth(); //로그인 상태관리
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(""); //검색어
  const [searchType, setSearchType] = useState("all"); // 검색 유형
  const [category, setCategory] = useState("all");
  const [triggerSearch, setTriggerSearch] = useState(true); // 검색 실행 트리거 
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 
  const [totalCount, setTotalCount] = useState(0); // 총 게시물 수
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | false>(false);
  const sanitizer = dompurify.sanitize;
  

  // // 아코디언 패널 상태 관리
  const handleChange = (panel: string) => async (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);

  };

  const display = 10; // 한 페이지에 표시할 게시물 수

  // 검색 파라미터 URL 업데이트
  useEffect(() => {
    setSearchParams({ search, searchType, category });
  }, [search, searchType, category, setSearchParams]);


  //FAQ 카테고리 데이터 받아오기
  const getBoardCategoryListApi = async () => {
    const params = {
      search: "",
      start: "",
      display: "",
    };
    const response = await getBoardCategoryList(params);
    return response.data.filter(
      (category: any) => category.division === "FAQ"
    );
  };
  const { data: boardCategoryList, isLoading: boardCategoryLoading } = useQuery(
    "boardCategoryList",
    getBoardCategoryListApi
  );


  // 데이터를 불러오는 API 호출 함수
  const getBoardListApi = async () => {
    const params = {
      division : "FAQ",
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

  // 데이터 가져오기
  const {
    data: boardListWithCategory,
    isLoading: boardListLoading,
    refetch,
  } = useQuery("boardListWithCategory", getBoardListWithDelay, {
    enabled: triggerSearch, // 검색 트리거가 활성화될 때 쿼리 실행
  });

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

  //삭제
  const { mutate: deleteBoardMutation } = useMutation(
    (boardId : string) => deleteBoard(boardId),
    {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: t("text.delete"),
          text: t("menu.board.alert.delete"),
          showConfirmButton: true,
          confirmButtonText: t("text.check")
        });
        window.location.reload();
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: t("text.delete"),
          text: t("menu.board.alert.delete_error"),
          showConfirmButton: true,
          confirmButtonText: t("text.check")
        });
      },
    }
  );
  const onClickDelete = (boardId : string) => {
    Swal.fire({
      icon: 'warning',
      title: t("text.delete"),
      text: t("menu.board.alert.delete_confirm"),
      showCancelButton: true,
      confirmButtonText: t("text.delete"),
      cancelButtonText: t("text.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // 삭제 API 호출
        deleteBoardMutation(boardId as string);
      }
    });
    };

  //추가 페이지로 이동
  const onClickAdd = () => {
    navigate(`/faq/form`);
  };

  //수정 페이지로 이동
  const onClickRegister = (boardId:string) => {
    navigate(`/faq/form/${boardId}`);
  };


  // 로딩 처리
  if (loading || boardListLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <TitleCenter>
        {t("menu.board.FAQ")}
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
        {boardListWithCategory && boardListWithCategory.length > 0 ? (
          boardListWithCategory
           ?.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10).map((boardItem: any, index: number) => (
            <Accordion
              key={boardItem.boardId}
              className="accordion"
              expanded={expanded === boardItem.boardId}
              onChange={handleChange(boardItem.boardId)}
            >
              <AccordionSummary
                className="summary"
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <AccordionTitle>
                  <div className="title-area">
                    {/* <div className="index">{(currentPage - 1) * display + index + 1}</div> */}
                    <CustomCategory
                      style={{ color: `${boardItem.category.color}` }}
                      className="category"
                    >
                      [ {boardItem.category.name} ]
                    </CustomCategory>
                    <span className="q">Q.</span>
                    <span className="title">{boardItem.title}</span>
                  </div>
                </AccordionTitle>
              </AccordionSummary>
              <AccordionDetails className="detail">
                <div
                  className="board-contents"
                  dangerouslySetInnerHTML={{
                    __html: expanded === boardItem.boardId ? sanitizer(`A. ${boardItem?.contents}` || "") : "",
                  }}
                ></div>
                <div className="btn-area">
                  <Button
                    className="update-btn"
                    type="button"
                    color="primary"
                    variant="contained"
                    onClick={() => onClickRegister(boardItem.boardId)}
                  >
                    {t("text.update")}
                  </Button>
                  <Button
                    className="delete-btn"
                    type="button"
                    color="warning"
                    variant="contained"
                    onClick={() => onClickDelete(boardItem.boardId)}
                  >
                    {t("text.delete")}
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <div>{t("sentence.no_data")}</div>
        )}
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
  );
}

export default Faq;
