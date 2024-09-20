import { useTranslation } from "react-i18next";
import { useAuth } from "../../../auth/AuthContext";
import {  Wrapper } from "../../../styles/CommonStyles";
import { getBoard, getBoardCategory, insertBoard, updateBoard } from "../api";
import {  useMutation, useQuery } from "react-query";
import {  BoardButtonArea, ContentsInputArea} from "../BoardStyle";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import QuillEditer from "../QuillEditer";
import dompurify from "dompurify";
import { Button, FormHelperText } from "@mui/material";

function AnswerForm(reBoardId : any){
  const sanitizer = dompurify.sanitize;
  const { user } = useAuth(); //로그인 상태관리
  const { t } = useTranslation();


  console.log(reBoardId);
  

  // 데이터를 받아오기 
  const getBoardWithCategory = async () => {
    try {
      // 보드 데이터 가져오기
      const board = await getBoard(reBoardId.reBoardId);

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

  console.log(boardWithCategory);
  
  const mutation = useMutation(
    (values) => reBoardId ? updateBoard(reBoardId.reBoardId, values) : insertBoard(values),
    {
      onSuccess: (data) => {
        Swal.fire({
          icon: 'success',
          title: t("text.save"),
          text: t("menu.board.alert.save"),
          showConfirmButton: true,
          confirmButtonText: t("text.check")
        });
      },
      onError: (error) => {
        // 에러 처리
      },
    }
  );


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      memberId: user?.memberId,
      userName : user?.name,
      title: t("menu.board.answer"),
      boardCategoryId: boardWithCategory?.category?.boardCategoryId || "",
      contents: boardWithCategory?.data?.contents || "" ,
      status: "1", //답글
      boardDivision: "QNA",
      pboardId: boardWithCategory?.data?.pboardId, //질문글 아이디
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


  return(
    <Wrapper>
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
            className="update-btn"
            type="submit"
            variant="contained"
          >
            {t("text.save")}
          </Button>
        </BoardButtonArea>
      </form>
    </Wrapper>
  )
}

export default AnswerForm;