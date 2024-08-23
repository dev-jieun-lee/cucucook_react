import { useTranslation } from "react-i18next";
import { TitleCenter, Wrapper } from "../../styles/CommonStyles";
import { AccordionTitle, BoardWrapper, ContentsArea, SearchArea } from "./BoardStyle";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { getBoardList } from "./api";
import { useQuery } from "react-query";
import VisibilityIcon from '@mui/icons-material/Visibility';

function Faq(){
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
    return <div>{t("loading")}</div>;
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
        {boardList.data && boardList.data.length > 0 ? (
          boardList.data.map((boardItem: any, index: number) => (
            <Accordion
              key={index}
              className="accordion"
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                className="summary"
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <AccordionTitle>
                  <div className="title-area">
                    <span className="category">[ {boardItem.boardCategoryId} ]</span>
                    <span className="title">{boardItem.title}</span>
                  </div>
                  <div className="info">
                    <span className="date">{boardItem.udtDt}</span>
                    <span className="border"></span>
                    <span className="member">{boardItem.memberId}</span>
                    <span className="border"></span>
                    <span className="viewCount"><VisibilityIcon className="view-icon"/>{boardItem.viewCount}</span>
                  </div>
                </AccordionTitle>
              </AccordionSummary>
              <AccordionDetails className="detail">
                <span>{boardItem.contents}</span>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <div>{t("sentence.no_data")}</div>
        )}
      </ContentsArea>
    </Wrapper>
  );
}

export default Faq;