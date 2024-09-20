import { useTranslation } from "react-i18next";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteBoard, getBoard, getBoardCategory, getBoardWithReplies, insertBoard, updateBoard } from "../api";
import {
  AnswerButton,
  AnswerContainer,
  BoardButtonArea,
  ContentsInputArea,
  CustomCategory,
  DetailContents,
  ParentBoardData,
  QnaContentsArea,
  TitleArea,
} from "../BoardStyle";
import Loading from "../../../components/Loading";
import moment from "moment";
import { Button, FormHelperText, IconButton, Tooltip } from "@mui/material";
import dompurify from "dompurify";
import Swal from "sweetalert2";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useAuth } from "../../../auth/AuthContext";
import { useEffect, useState } from "react";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AnswerForm from "./AnswerForm";
import QuillEditer from "../QuillEditer";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';


function QnaDetail() {
  const sanitizer = dompurify.sanitize;
  const { user } = useAuth(); //로그인 상태관리
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { boardId } = useParams(); //보드 아이디 파라미터 받아오기
  const [isReply, setIsReply] = useState(false); 
  const [pBoardData, setPBoardData] = useState<any[]>([]); // 부모글 상태
  const [reBoardId, setReBoardId] = useState("");
  const [reBoardData, setReBoardData] = useState<any[]>([]); // 답글 상태
  const [isEditing, setIsEditing] = useState(false); // 답글 수정 상태

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
  //데이터 받아오기
  const { data: boardWithCategory, isLoading: boardLoading, refetch } = useQuery(
    "boardWithCategory",
    getBoardWithCategory,
    { refetchOnWindowFocus: false, staleTime: 0 }
  );
  
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
  const onClickDelete = (id : string) => {
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
    (values) => reBoardId ? updateBoard(reBoardId, values) : insertBoard(values),
    {
      onSuccess: (data) => {
        // 새로고침 전에 localStorage에 성공 상태 저장
        localStorage.setItem('isSaved', 'true');
        window.location.reload();
      },
      onError: (error) => {
      },
    }
  );
  
  // 새로고침 후 알림을 확인하는 useEffect
  useEffect(() => {
    const isSaved = localStorage.getItem('isSaved');
    if (isSaved === 'true') {
      // 알림을 띄우고, 저장된 상태를 제거
      Swal.fire({
        icon: 'success',
        title: t("text.save"),
        text: t("menu.board.alert.save"),
        showConfirmButton: true,
        confirmButtonText: t("text.check"),
      });
  
      // 알림이 뜬 후 localStorage에서 해당 키를 제거하여 반복되지 않게 함
      localStorage.removeItem('isSaved');
    }
  }, []);
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      memberId: user?.memberId,
      userName : user?.name,
      title: t("menu.board.is_answer"),
      boardCategoryId: boardWithCategory?.category?.boardCategoryId || "",
      contents: reBoardData[0]?.contents || "" ,
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
  const onClickRegister = (id : string) => {
    navigate(`/qna/form/${id}`);
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
              <span className="viewCount">{pBoardData[0]?.viewCount}</span>
            </div>
          </TitleArea>
          <QnaContentsArea>
            <div
              className="board-contents"
              dangerouslySetInnerHTML={{
                __html: sanitizer(`${pBoardData[0]?.contents}`),
              }}
            ></div>
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
      <div style={{marginTop : '-50px', width : '100%'}}>
      <TitleArea>
        <div className="board-title">
          <AnswerContainer className="answer-container">
            <SubdirectoryArrowRightIcon className="answer-icon" />
            {isReply ? (
              <span className="answer-title">{reBoardData[0]?.title}</span>
            ) : (
              <span className="answer-title">{t("menu.board.answer_no")}</span>
            )}
          </AnswerContainer>
        </div>
        <div className="board-info">
          {user?.role === "1" && !isReply && !isEditing ? ( 
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
                {moment(reBoardData[0]?.udtDt).format("YYYY-MM-DD")}
              </span>
              <span className="border"></span>
              <span className="member">{reBoardData[0]?.userName}</span>
            </>
          )}
        </div>
      </TitleArea>
        <>
          {!isEditing ? (
            <QnaContentsArea>
              {isReply ? (
                <>
                  <div
                  className="board-contents"
                  dangerouslySetInnerHTML={{
                    __html: sanitizer(`${reBoardData[0]?.contents}`),
                  }}></div>
                  {user?.role === "1" ? (
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
                <>
                </>
              )}

            </QnaContentsArea>
          ) : (
            <>
              <form className="form" onSubmit={formik.handleSubmit}>
                <ContentsInputArea>
                  <div className="answer-editor">
                    <QuillEditer
                      value={formik.values.contents}
                      onChange={(text: any) => formik.setFieldValue('contents', text)}
                      error={formik.touched.contents && Boolean(formik.errors.contents)}
                    />
                    {formik.touched.contents && formik.errors.contents && (
                      <FormHelperText error>{t("menu.board.error.contents")}</FormHelperText>
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
