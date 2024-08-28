import { useTranslation } from "react-i18next";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import { ContentsArea, CustomCategory, SearchArea } from "../BoardStyle";
import {
  Fab,
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
import { getBoardCategory, getBoardList } from "../api";
import { useQuery } from "react-query";
import Loading from "../../../components/Loading";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

function Notice() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 보드 리스트 조회 파라미터
  const getBoardListApi = () => {
    const params = {
      search: "",
      boardCategoryId: "",
      start: "",
      display: "",
    };
    return getBoardList(params);
  };

  const getBoardListWithCategory = async () => {
    try {
      // 보드 리스트 조회
      const boardList = await getBoardListApi();

      // NOTICE인 경우만 필터링
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

  // 데이터를 받아오기
  const { data: boardListWithCategory, isLoading: boardListLoading } = useQuery(
    "boardListWithCategory",
    getBoardListWithCategory
  );

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
          value={"all"}
        >
          <MenuItem value="all">{t("text.all")}</MenuItem>
        </Select>
        <TextField
          className="search-input"
          variant="standard"
          placeholder={t("sentence.searching")}
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
                    <TableCell>
                      {boardItem.title}
                      {/* <AttachFileIcon className="file-icon" /> */}
                    </TableCell>
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
