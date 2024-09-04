import { useTranslation } from "react-i18next";
import { useAuth } from "../../../auth/AuthContext";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import { useNavigate, useParams } from "react-router-dom";
import { getBoard, getBoardCategory, insertBoard, updateBoard } from "../api";
import { useMutation, useQuery } from "react-query";
import { BoardButtonArea, ContentsInputArea, TitleInputArea } from "../BoardStyle";
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import QuillEditer from "../QuillEditer";
import dompurify from "dompurify";

function AnswerForm(){
  const sanitizer = dompurify.sanitize;
  const { user, isLoggedIn } = useAuth(); //로그인 상태관리
  const { t } = useTranslation();
  const { boardId } = useParams(); //부모게시글 아이디 파라미터 받아오기
  const { answerId } = useParams(); //답글 아이디 파라미터 받아오기
  const navigate = useNavigate();

  const pBoardId = boardId; //부모 게시글 아이디

  //카테고리 포함 부모글 데이터 받아오기
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

  //answerId가 있을경우 수정, 없을경우 생성
  const mutation = useMutation(
    (values) => answerId ? updateBoard(answerId, values) : insertBoard(values),
    {
      onSuccess: (data) => {
        Swal.fire({
          icon: 'success',
          title: t("text.save"),
          text: t("menu.board.alert.save"),
          showConfirmButton: true,
          confirmButtonText: t("text.check")
        });
        navigate(-1); 
        
      },
      onError: (error) => {
        // 에러 처리
      },
    }
  );

const formik = useFormik({
  enableReinitialize: true,
  initialValues: {
    memberId: "1",
    title: boardId ? boardWithCategory?.data?.title || "" : "",
    boardCategoryId: boardId
      ? boardWithCategory?.category?.boardCategoryId || ""
      : "",
    contents: "",
    status: "1", //답글
    boardDivision: "QNA",
    pBoardId: pBoardId, //질문글 아이디
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

  
    // // 카테고리 선택시 값 업데이트
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    formik.setFieldValue("boardCategoryId", event.target.value);
    formik.setFieldTouched("boardCategoryId", true); // 필드를 touched로 표시
    formik.validateForm(); // 유효성 검사 트리거
  };

    //글 작성 취소
    const onClickCancel = () => {
      Swal.fire({
        icon: 'warning',
        title: t("text.cancel"),
        text: t("menu.board.alert.cancel"),
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: t("text.yes"),
        cancelButtonText: t("text.no"),
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(-1);
        }
      });
    };
  
  
  return(
    <Wrapper>
      <TitleCenter>{t("menu.board.A_create")}</TitleCenter>
      <form className="form" onSubmit={formik.handleSubmit}>
        <TitleInputArea>
          <div className="category">
            <FormControl className="form-select">
              <InputLabel htmlFor="boardCategoryId">
                {t("menu.board.category")}
              </InputLabel>
              <OutlinedInput
                disabled
                id="category"
                label={t("text.category")}
                value={formik.values.boardCategoryId}
              />
            </FormControl>
          </div>
          <div className="title">
            <FormControl className="form-input">
              <InputLabel htmlFor="title">{t("text.title")}</InputLabel>
              <OutlinedInput
                disabled
                id="title"
                label={t("text.title")}
                value={formik.values.title}
              />
              {formik.touched.title && formik.errors.title && (
                <FormHelperText error>{t("menu.board.error.title")}</FormHelperText>
              )}
            </FormControl>
          </div>
        </TitleInputArea>
        <ContentsInputArea>
          <div className="parent-content">
            <div className="q-contents"
              dangerouslySetInnerHTML={{
                __html: sanitizer(`${boardWithCategory?.data.contents}`),
              }}
            />
          </div>
          <hr/>
          <div className="sub-title">{t("text.answer")}</div>
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
            variant="outlined"
            color="warning"
            onClick={() => onClickCancel()}
          >
            {t("text.cancel")}
          </Button>
          <Button className="save-btn" type="submit" variant="contained" >
            {t("text.save")}
          </Button>
        </BoardButtonArea>
      </form>
    </Wrapper>
  )
}

export default AnswerForm;