import { useTranslation } from "react-i18next";
import { TitleCenter, Wrapper } from "../../styles/CommonStyles";
import { AccordionTitle, BoardWrapper, ContentsArea, SearchArea } from "./BoardStyle";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { getBoardList } from "./api";
import { useQuery } from "react-query";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Loading from "../../components/Loading";

function Notice() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // 파라미터를 생성하고 데이터를 받아옴
  const fetchBoardList = () => {
    const params = {
      search: "",
      boardCategoryId: "",
      start: "",
      display: "",
    };

    return getBoardList(params);
  };

  // 데이터 받아오기
  const { data: boardList, isLoading: boardListLoading } = useQuery(
    "boardList",
    fetchBoardList
  );

  console.log(boardList);
  

  //로딩
  if (boardListLoading) {
    return <Loading/>;
  }

  return (
    <Wrapper>
      <TitleCenter>{t("menu.board.notice")}</TitleCenter>
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
          <Table className="table" sx={{ minWidth: 650 }} aria-label="board table">
            <TableHead className="head">
              <TableRow >
                <TableCell>{t("text.category")}</TableCell>
                <TableCell>{t("text.title")}</TableCell>
                <TableCell>{t("text.writer")}</TableCell>
                <TableCell>{t("text.create_date")}</TableCell>
                <TableCell>{t("text.update_date")}</TableCell>
                <TableCell>{t("text.view_count")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boardList?.data && boardList.data.length > 0 ? (
                boardList.data.map((boardItem: any, index: number) => (
                  <TableRow className="row" key={index}>
                    <TableCell component="th" scope="row">
                      {boardItem.category}
                    </TableCell>
                    <TableCell >{boardItem.title}<AttachFileIcon className="file-icon"/></TableCell>
                    <TableCell >{boardItem.memberId}</TableCell>
                    <TableCell >{boardItem.regDt}</TableCell>
                    <TableCell >{boardItem.udtDt}</TableCell>
                    <TableCell >{boardItem.viewCount}</TableCell>
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
      </ContentsArea>
    </Wrapper>
  );
}

export default Notice;
