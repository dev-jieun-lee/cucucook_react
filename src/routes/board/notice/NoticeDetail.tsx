import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Button, IconButton, Tooltip } from "@mui/material";
import dompurify from "dompurify";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteBoard,
  getBoard,
  getBoardCategory,
} from "../../../apis/boardApi";
import { useAuth } from "../../../auth/AuthContext";
import {
  BoardButtonArea,
  CustomCategory,
  DetailContents,
  TitleArea,
} from "../../../styles/BoardStyle";
import Loading from "../../../components/Loading";
import dayjs from "dayjs";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import BoardFilesList from "../BoardFilesList";

function NoticeDetail() {
  // 스크립트를 활용하여 javascript와 HTML로 악성 코드를 웹 브라우저에 심어,
  // 사용자 접속시 그 악성코드가 실행되는 것을 XSS, 보안을 위해 sanitize 추가
  const sanitizer = dompurify.sanitize;

  const { user } = useAuth(); //로그인 상태관리
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { boardId } = useParams(); //보드 아이디 파라미터 받아오기

  //카테고리 포함 데이터 받아오기
  const getBoardWithCategory = async () => {
    try {
      // 보드 데이터 가져오기
      const board = await getBoard(boardId);

      // 보드의 카테고리 정보 가져오기
      const categoryData = await getBoardCategory(board.data.boardCategoryId);

      // 카테고리 정보 추가
      const boardWithCategory = {
        ...board,
        category: categoryData.data,
      };

      return boardWithCategory;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // 데이터 가져오기 시 로딩 상태 추가
  const getBoardWithDelay = async () => {
    setLoading(true); // 로딩 상태 시작

    // 인위적인 지연 시간 추가
    await new Promise((resolve) => setTimeout(resolve, 100));

    const boardList = await getBoardWithCategory(); // 데이터 불러오기
    setLoading(false);
    return boardList;
  };

  //데이터 받아오기
  const { data: boardWithCategory, isLoading: boardLoading } = useQuery(
    "boardWithCategory",
    getBoardWithDelay
  );

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
    navigate(`/notice/form/${boardId}`);
  };

  //로딩
  if (loading || boardLoading) {
    return <></>;
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
        {t("menu.board.notice")}
      </TitleCenter>
      <TitleArea>
        <div className="board-title">
          <CustomCategory
            style={{ color: `${boardWithCategory.category.color}` }}
          >
            [ {boardWithCategory?.category.name} ]
          </CustomCategory>
          <p className="title">{boardWithCategory?.data.title}</p>
        </div>
        <div className="board-info">
          <div className="date-area">
            <span className="hit">{t("text.register_date")}</span>
            <span className="date">
              {dayjs(boardWithCategory?.data.regDt).format("YYYY-MM-DD HH:mm")}
            </span>
            <span className="border"></span>
            <span className="hit">{t("text.update_date")}</span>
            <span className="date">
              {dayjs(boardWithCategory?.data.udtDt).format("YYYY-MM-DD HH:mm")}
            </span>
          </div>
          <div className="hit-area">
            <span className="border m-border"></span>
            <span className="member">{boardWithCategory?.data.userName}</span>
            <span className="border"></span>
            <span className="hit">{t("text.hit")}</span>
            <span className="viewCount">
              {boardWithCategory?.data.viewCount}
            </span>
          </div>
        </div>
      </TitleArea>
      <DetailContents>
        <div
          className="board-contents"
          dangerouslySetInnerHTML={{
            __html: sanitizer(`${boardWithCategory?.data.contents}`),
          }}
        ></div>
      </DetailContents>
      <BoardFilesList boardId={boardId || ""} />
      {user?.role === "0" ? (
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
      ) : (
        <></>
      )}
    </Wrapper>
  );
}

export default NoticeDetail;
