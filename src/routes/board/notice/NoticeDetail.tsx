import { useTranslation } from "react-i18next";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { deleteBoard, getBoard, getBoardCategory } from "../api";
import {
  BoardButtonArea,
  CustomCategory,
  DetailContents,
  TitleArea,
} from "../BoardStyle";
import Loading from "../../../components/Loading";
import moment from "moment";
import { Button } from "@mui/material";
import dompurify from "dompurify";
import Swal from "sweetalert2";

function NoticeDetail() {
  // 스크립트를 활용하여 javascript와 HTML로 악성 코드를 웹 브라우저에 심어,
  // 사용자 접속시 그 악성코드가 실행되는 것을 XSS, 보안을 위해 sanitize 추가
  const sanitizer = dompurify.sanitize;

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
  //데이터 받아오기
  const { data: boardWithCategory, isLoading: boardLoading } = useQuery(
    "boardWithCategory",
    getBoardWithCategory
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
        navigate(-1); 
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
  const onClickDelete = () => {
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


  //수정 페이지로 이동
  const onClickRegister = () => {
    navigate(`/notice/form/${boardId}`);
  };

  //로딩
  if (boardLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <TitleCenter>{t("menu.board.notice")}</TitleCenter>
      <TitleArea>
        <div className="board-title">
          <CustomCategory
            style={{ color: `${boardWithCategory.category.color}` }}
          >
            [ {boardWithCategory?.category.name} ]
          </CustomCategory>
          <span className="title">{boardWithCategory?.data.title}</span>
        </div>
        <div className="board-info">
          <span className="date">
            {moment(boardWithCategory?.data.udtDt).format("YYYY-MM-DD")}
          </span>
          <span className="border"></span>
          <span className="member">{boardWithCategory?.data.userName}</span>
          <span className="border"></span>
          <span className="hit">{t("text.hit")}</span>
          <span className="viewCount">{boardWithCategory?.data.viewCount}</span>
        </div>
      </TitleArea>
      <DetailContents>
        <div className="board-contents"
        dangerouslySetInnerHTML={{ __html : sanitizer(`${boardWithCategory?.data.contents}`) }}
        ></div>
      </DetailContents>
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

export default NoticeDetail;
