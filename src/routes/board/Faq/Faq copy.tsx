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
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { getBoard, getBoardCategory, getBoardList } from "../api";
import { useQuery } from "react-query";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import dompurify from "dompurify";
import Swal from "sweetalert2";
import moment from "moment";


function Faq() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [currentBoardContents, setCurrentBoardContents] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const sanitizer = dompurify.sanitize;

  // // 아코디언 패널 상태 관리
  const handleChange = (panel: string) => async (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
    if (isExpanded) {
      const contents = await getBoard(panel); // panel(boardId)로 내용을 가져옴
      
      setCurrentBoardContents(contents?.data.contents || null);
    } else {
      setCurrentBoardContents(null); 
    }
  };

  // const handleChange = (panel: string) => async (event: React.SyntheticEvent, isExpanded: boolean) => {
  //   setExpanded(isExpanded ? panel : false);

  //   if (isExpanded) {
  //     setLoadingContent(true);  // 로딩 시작
  //     try {
  //       const contents = await getBoard(panel);  // 패널(boardId)로 내용을 가져옴
  //       setCurrentBoardContents(contents?.data.contents || null);
  //     } catch (error) {
  //       console.error("Failed to load content:", error);
  //       setCurrentBoardContents(null);
  //     } finally {
  //       setLoadingContent(false);  // 로딩 완료
  //     }
  //   } else {
  //     setCurrentBoardContents(null);  // 닫힐 때 콘텐츠 초기화
  //   }
  // };

  

  // FAQ 데이터 가져오기 함수
  const getBoardListWithCategory = async () => {
    const params = {
      search: "",
      boardCategoryId: "",
      start: "",
      display: "",
    };

    const boardList = await getBoardList(params);

    console.log(boardList);
    
    const filteredBoardList = boardList.data.filter(
      (board: any) => board.boardDivision === "FAQ"
    );

    const boardListWithCategory = await Promise.all(
      filteredBoardList.map(async (board: any) => {
        const categoryData = await getBoardCategory(board.boardCategoryId);
        return {
          ...board,
          category: categoryData.data,
        };
      })
    );
    return boardListWithCategory;
  };

  // FAQ 리스트 데이터 받아오기
  const { data: boardListWithCategory, isLoading: boardListLoading } = useQuery(
    "boardListWithCategory",
    getBoardListWithCategory
  );

  console.log(boardListWithCategory);
  

  // 로딩 처리
  if (boardListLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <TitleCenter>{t("menu.board.FAQ")}</TitleCenter>
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
        {boardListWithCategory && boardListWithCategory.length > 0 ? (
          boardListWithCategory.map((boardItem: any, index: number) => (
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
                    <CustomCategory
                      style={{ color: `${boardItem.category.color}` }}
                      className="category"
                    >
                      [ {boardItem.category.name} ]
                    </CustomCategory>
                    <span className="title">{boardItem.title}</span>
                  </div>
                  <div className="info">
                    <span className="date">{moment(boardItem.regDt).format("YYYY-MM-DD")}</span>
                    <span className="border"></span>
                    <span className="member">{boardItem.memberId}</span>
                    <span className="border"></span>
                    <span className="hit">{t("text.hit")}</span>
                    <span className="viewCount">
                      {boardItem.viewCount}
                    </span>
                  </div>
                </AccordionTitle>
              </AccordionSummary>
              <AccordionDetails className="detail">
                <div
                  className="board-contents"
                  dangerouslySetInnerHTML={{
                    __html: expanded === boardItem.boardId ? sanitizer(currentBoardContents || "") : "",
                  }}
                ></div>
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
