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
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { deleteBoard, getBoard, getBoardCategory, getBoardList } from "../api";
import { useMutation, useQuery } from "react-query";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import dompurify from "dompurify";
import Swal from "sweetalert2";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";


function Faq() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | false>(false);
  const sanitizer = dompurify.sanitize;

  // // 아코디언 패널 상태 관리
  const handleChange = (panel: string) => async (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);

  };

  

  // FAQ 데이터 가져오기 함수
  const getBoardListWithCategory = async () => {
    const params = {
      search: "",
      boardCategoryId: "",
      start: "",
      display: "",
    };

    const boardList = await getBoardList(params);
    
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
  if (boardListLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <TitleCenter>
        {t("menu.board.FAQ")}
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
                    <span className="q">Q.</span>
                    <span className="title">{boardItem.title}</span>
                  </div>
                  {/* <div className="info">
                    <span className="date">{moment(boardItem.regDt).format("YYYY-MM-DD")}</span>
                    <span className="border"></span>
                    <span className="member">{boardItem.memberId}</span>
                    <span className="border"></span>
                    <span className="hit">{t("text.hit")}</span>
                    <span className="viewCount">
                      {boardItem.viewCount}
                    </span>
                  </div> */}
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
                    variant="outlined"
                    onClick={() => onClickRegister(boardItem.boardId)}
                  >
                    {t("text.update")}
                  </Button>
                  <Button
                    className="delete-btn"
                    type="button"
                    color="warning"
                    variant="outlined"
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
      </ContentsArea>
    </Wrapper>
  );
}

export default Faq;
