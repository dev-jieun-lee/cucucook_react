import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { Button, FormHelperText, IconButton, Tooltip } from "@mui/material";
import dompurify from "dompurify";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  deleteBoard,
  getBoardCategory,
  getBoardWithReplies,
  insertBoard,
  updateBoard,
} from "../../../apis/boardApi";
import { useAuth } from "../../../auth/AuthContext";
import {
  AnswerButton,
  AnswerContainer,
  BoardButtonArea,
  ContentsInputArea,
  CustomCategory,
  ParentBoardData,
  QnaContentsArea,
  TitleArea,
  TitleAreaAnswer,
} from "../../../styles/BoardStyle";
import Loading from "../../../components/Loading";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import BoardFilesList from "../BoardFilesList";
import QuillEditer from "../QuillEditer";
import dayjs from "dayjs";

function QnaDetail() {
  const sanitizer = dompurify.sanitize;
  const { user } = useAuth(); //로그인 상태관리
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { boardId } = useParams(); //보드 아이디 파라미터 받아오기
  const [isReply, setIsReply] = useState(false);
  const [pBoardData, setPBoardData] = useState<any[]>([]); // 부모글 상태
  const [reBoardId, setReBoardId] = useState("");
  const [reBoardData, setReBoardData] = useState<any[]>([]); // 답글 상태
  const [isEditing, setIsEditing] = useState(false); // 답글 수정 상태

  const editorRef = useRef(null); // QuillEditer에 사용할 ref

  //카테고리 포함 데이터 받아오기
  const getBoardWithCategory = async () => {
    try {
      // 보드 데이터 가져오기
      const board = await getBoardWithReplies(boardId);

      // 보드의 카테고리 정보 가져오기
      const categoryData = await getBoardCategory(
        board.data[0].boardCategoryId
      );

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
          setIsReply(true);
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
  const {
    data: boardWithCategory,
    isLoading: boardLoading,
    refetch,
  } = useQuery("boardWithCategory", getBoardWithDelay, {
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (reBoardData.length > 0) {
      setReBoardId(reBoardData[0].boardId);
    }
  }, [reBoardData]);

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
  const onClickDelete = (id: string) => {
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
        deleteBoardMutation(id as string);
      }
    });
  };

  //답글 등록/ 수정
  const mutation = useMutation(
    (values) =>
      reBoardId ? updateBoard(reBoardId, values) : insertBoard(values),
    {
      onSuccess: (data) => {
        // 새로고침 전에 localStorage에 성공 상태 저장
        localStorage.setItem("isSaved", "true");
        window.location.reload();
      },
      onError: (error) => {},
    }
  );

  // 새로고침 후 알림을 확인하는 useEffect
  useEffect(() => {
    const isSaved = localStorage.getItem("isSaved");
    if (isSaved === "true") {
      // 알림을 띄우고, 저장된 상태를 제거
      Swal.fire({
        icon: "success",
        title: t("text.save"),
        text: t("menu.board.alert.save"),
        showConfirmButton: true,
        confirmButtonText: t("text.check"),
      });

      // 알림이 뜬 후 localStorage에서 해당 키를 제거하여 반복되지 않게 함
      localStorage.removeItem("isSaved");
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      memberId: user?.memberId,
      userName: user?.name,
      title: t("menu.board.is_answer"),
      boardCategoryId: boardWithCategory?.category?.boardCategoryId || "",
      contents: reBoardData[0]?.contents || "",
      status: "1", //답글
      boardDivision: "QNA",
      pboardId: pBoardData[0]?.boardId, //질문글 아이디
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      boardCategoryId: Yup.string().required(),
      contents: Yup.string().required(),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log(values);

      mutation.mutate(values as any); // mutation 실행
    },
  });

  //질문글 수정 페이지로 이동
  const onClickRegister = (id: string) => {
    navigate(`/qna/form/${id}`);
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
        {t("menu.board.QNA")}
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
              <p className="title">{pBoardData[0]?.title}</p>
            </div>
            <div className="board-info">
              <div className="date-area">
                <span className="hit">{t("text.register_date")}</span>
                <span className="date">
                  {dayjs(pBoardData[0]?.regDt).format("YYYY-MM-DD HH:mm")}
                </span>
                <span className="border"></span>
                <span className="hit">{t("text.update_date")}</span>
                <span className="date">
                  {dayjs(pBoardData[0]?.udtDt).format("YYYY-MM-DD HH:mm")}
                </span>
              </div>
              <div className="hit-area">
                <span className="border m-border"></span>
                <span className="member">{pBoardData[0]?.userName}</span>
                <span className="border"></span>
                <span className="hit">{t("text.hit")}</span>
                <span className="viewCount">{pBoardData[0]?.viewCount}</span>
              </div>
            </div>
          </TitleArea>
          <QnaContentsArea>
            <div
              className="board-contents"
              dangerouslySetInnerHTML={{
                __html: sanitizer(`${pBoardData[0]?.contents}`),
              }}
            ></div>
            <BoardFilesList boardId={pBoardData[0]?.boardId || ""} />
            {user?.memberId === pBoardData[0]?.memberId ? (
              <div className="btn-area">
                <Button
                  className="update-btn"
                  type="button"
                  color="primary"
                  variant="outlined"
                  onClick={() => onClickRegister(pBoardData[0]?.boardId)}
                >
                  {t("text.question")} {t("text.update")}
                </Button>
                <Button
                  className="delete-btn"
                  type="button"
                  color="warning"
                  variant="outlined"
                  onClick={() => onClickDelete(pBoardData[0]?.boardId)}
                >
                  {t("text.question")} {t("text.delete")}
                </Button>
              </div>
            ) : (
              <></>
            )}
          </QnaContentsArea>
        </ParentBoardData>
      ) : (
        <></>
      )}
      <div style={{ marginTop: "-50px", width: "100%" }}>
        <TitleAreaAnswer style={{ display: "flex", alignItems: "center" }}>
          <div className="board-title">
            <AnswerContainer className="answer-container">
              <SubdirectoryArrowRightIcon className="answer-icon" />
              {isReply ? (
                <span className="answer-title">{reBoardData[0]?.title}</span>
              ) : (
                <span className="answer-title">
                  {t("menu.board.answer_no")}
                </span>
              )}
            </AnswerContainer>
          </div>
          <div className="board-info">
            {user?.role === "0" && !isReply && !isEditing ? (
              <AnswerButton
                onClick={() => setIsEditing(true)}
                variant="contained"
                className="btn"
              >
                {t("menu.board.A_create")}
              </AnswerButton>
            ) : (
              <>
                <span className="date">
                  {dayjs(reBoardData[0]?.udtDt).format("YYYY-MM-DD HH:mm")}
                </span>
                <span className="border"></span>
                <span className="member">{reBoardData[0]?.userName}</span>
              </>
            )}
          </div>
        </TitleAreaAnswer>
        <>
          {!isEditing ? (
            <QnaContentsArea>
              {isReply ? (
                <>
                  <div
                    className="board-contents"
                    dangerouslySetInnerHTML={{
                      __html: sanitizer(`${reBoardData[0]?.contents}`),
                    }}
                  ></div>
                  <BoardFilesList boardId={reBoardId || ""} />
                  {user?.role === "0" ? (
                    <div className="btn-area">
                      <Button
                        className="update-btn"
                        type="button"
                        color="primary"
                        variant="contained"
                        onClick={() => setIsEditing(true)}
                      >
                        {t("menu.board.answer")} {t("text.update")}
                      </Button>
                      <Button
                        className="delete-btn"
                        type="button"
                        color="warning"
                        variant="contained"
                        onClick={() => onClickDelete(reBoardId)}
                      >
                        {t("menu.board.answer")} {t("text.delete")}
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </QnaContentsArea>
          ) : (
            <>
              <form className="form" onSubmit={formik.handleSubmit}>
                <ContentsInputArea>
                  <div className="answer-editor">
                    <QuillEditer
                      ref={editorRef}
                      value={formik.values.contents}
                      onChange={(text: any) =>
                        formik.setFieldValue("contents", text)
                      }
                      error={
                        formik.touched.contents &&
                        Boolean(formik.errors.contents)
                      }
                    />
                    {formik.touched.contents && formik.errors.contents && (
                      <FormHelperText error>
                        {t("menu.board.error.contents")}
                      </FormHelperText>
                    )}
                  </div>
                </ContentsInputArea>
                <BoardButtonArea>
                  <Button
                    className="cancel-btn"
                    type="button"
                    color="warning"
                    variant="outlined"
                    onClick={() => setIsEditing(false)} // 취소 버튼 클릭 시 원래 상태로
                  >
                    {t("text.cancel")}
                  </Button>
                  <Button
                    className="update-btn"
                    type="submit"
                    variant="contained"
                  >
                    {t("text.save")}
                  </Button>
                </BoardButtonArea>
              </form>
            </>
          )}
        </>
      </div>
    </Wrapper>
  );
}

export default QnaDetail;
