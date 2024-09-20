import { useTranslation } from "react-i18next";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteBoard, getBoard, getBoardCategory, getBoardWithReplies } from "../api";
import {
  AnswerButton,
  AnswerContainer,
  BoardButtonArea,
  CustomCategory,
  DetailContents,
  ParentBoardData,
  TitleArea,
} from "../BoardStyle";
import Loading from "../../../components/Loading";
import moment from "moment";
import { Button, IconButton, Tooltip } from "@mui/material";
import dompurify from "dompurify";
import Swal from "sweetalert2";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useAuth } from "../../../auth/AuthContext";
import { useState } from "react";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

function QnaDetail() {
  const sanitizer = dompurify.sanitize;
  const { user } = useAuth(); //로그인 상태관리
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { boardId } = useParams(); //보드 아이디 파라미터 받아오기
  const location = useLocation();
  const isReply = location.state?.isReply || false;  // 답글 여부 확인
  const [pBoardData, setPBoardData] = useState<any[]>([]); // 부모글 상태
  const [reBoardData, setReBoardData] = useState<any[]>([]); // 답글 상태

  //카테고리 포함 데이터 받아오기
  const getBoardWithCategory = async () => {
    try {
      // 보드 데이터 가져오기
      const board = await getBoardWithReplies(boardId);

      // 보드의 카테고리 정보 가져오기
      const categoryData = await getBoardCategory(board.data[0].boardCategoryId);

      // 카테고리 정보 추가
      const boardWithCategory = {
        ...board,
        category: categoryData.data,
      };

      const parentPosts: any[] = [];
      const replyPosts: any[] = [];

      boardWithCategory.data.forEach((item: { status: string }) => {
        if (item.status === "0") {
          parentPosts.push(item); // 부모글
        } else if (item.status === "1") {
          replyPosts.push(item); // 답글
        }
      });

      setPBoardData(parentPosts);
      setReBoardData(replyPosts);

      return boardWithCategory;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  //데이터 받아오기
  const { data: boardWithCategory, isLoading: boardLoading } = useQuery(
    "boardWithCategory",
    getBoardWithCategory
  );

  console.log(reBoardData);
  
  
  //삭제
  const { mutate: deleteBoardMutation } = useMutation(
    (boardId: string) => deleteBoard(boardId),
    {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: t("text.delete"),
          text: t("menu.board.alert.delete"),
          showConfirmButton: true,
          confirmButtonText: t("text.check"),
        });
        navigate(-1);
      },
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: t("text.delete"),
          text: t("menu.board.alert.delete_error"),
          showConfirmButton: true,
          confirmButtonText: t("text.check"),
        });
      },
    }
  );
  const onClickDelete = () => {
    Swal.fire({
      icon: "warning",
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

  //수정 페이지로 이동
  const onClickRegister = () => {
    navigate(`/qna/form/${boardId}`);
  };

  //답변등록 페이지로 이동
  const onClickAnswer = () => {
    navigate(`/qna/form/${boardId}/answer`, {
      state: {
        isReply: true,  // 답글임을 나타내는 상태
        parentBoardId: boardId  // 부모글의 ID 전달
      }
    });
  };
  
  //로딩
  if (boardLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <TitleCenter>
        <Tooltip title={t("text.go_back")}>
          <IconButton
            color="primary"
            aria-label="add"
            style={{ marginTop: "-5px" }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Tooltip>
        {t("menu.board.QNA")}
        {user?.role === "1" && !isReply ? (
          <AnswerButton
            onClick={onClickAnswer}
            variant="outlined"
            className="btn"
          >
            {t("menu.board.A_create")}
          </AnswerButton>
        ) : (
          <></>
        )}
      </TitleCenter>
      {pBoardData ? (
        <ParentBoardData>
          <TitleArea>
            <div className="board-title">
              <CustomCategory
                style={{ color: `${boardWithCategory.category.color}` }}
              >
                [ {boardWithCategory?.category.name} ]
              </CustomCategory>
              <span className="title">{pBoardData[0]?.title}</span>
            </div>
            <div className="board-info">
              <span className="date">
                {moment(pBoardData[0]?.udtDt).format("YYYY-MM-DD")}
              </span>
              <span className="border"></span>
              <span className="member">{pBoardData[0]?.userName}</span>
              <span className="border"></span>
              <span className="hit">{t("text.hit")}</span>
              <span className="viewCount">{reBoardData[0]?.viewCount}</span>
            </div>
          </TitleArea>
          <div className="contents-area">
            <div
              className="board-contents"
              dangerouslySetInnerHTML={{
                __html: sanitizer(`${pBoardData[0]?.contents}`),
              }}
            ></div>
          </div>
        </ParentBoardData>
      ) : (
        <></>
      )}
      {reBoardData.length <= 0 ? (
        <></>
      ) : (
        <>
          <TitleArea>
            <div className="board-title">
              <AnswerContainer className="answer-container">
                <QuestionAnswerIcon className="answer-icon" />
                <span className="answer-title">{reBoardData[0]?.title}</span>
              </AnswerContainer>
            </div>
            <div className="board-info">
              <span className="date">
                {moment(reBoardData[0]?.udtDt).format("YYYY-MM-DD")}
              </span>
              <span className="border"></span>
              <span className="member">{reBoardData[0]?.userName}</span>
            </div>
          </TitleArea>
          <DetailContents>
            <div
            className="board-contents"
            dangerouslySetInnerHTML={{
              __html: sanitizer(`${reBoardData[0]?.contents}`),
            }}></div>
          </DetailContents>

        </>
      )}

        <BoardButtonArea>
          <Button
            className="delete-btn"
            type="button"
            variant="outlined"
            color="warning"
            onClick={() => onClickDelete()}
          >
            {t("text.delete")}
          </Button>
          <Button
            className="update-btn"
            type="button"
            variant="contained"
            onClick={() => onClickRegister()}
          >
            {t("text.update")}
          </Button>
        </BoardButtonArea>
    </Wrapper>
  );
}

export default QnaDetail;
