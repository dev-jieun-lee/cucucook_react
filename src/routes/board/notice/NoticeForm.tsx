import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  getBoard,
  getBoardCategory,
  getBoardCategoryList,
  getBoardFilesList,
  insertBoard,
  updateBoard,
} from "../../../apis/boardApi";
import { useAuth } from "../../../auth/AuthContext";
import Loading from "../../../components/Loading";
import {
  BoardButtonArea,
  ContentsInputArea,
  TitleInputArea,
} from "../../../styles/BoardStyle";
import { TitleCenter, Wrapper } from "../../../styles/CommonStyles";
import { convertFileSize } from "../../utils/commonUtil";
import BoardFilesUpload from "../BoardFilesUpload";
import QuillEditer from "../QuillEditer";

//첨부파일
interface UploadFiles {
  file: File | null;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileId: String;
}

function NoticeForm() {
  const { user } = useAuth(); //로그인 상태관리
  const { t } = useTranslation();
  const { boardId } = useParams(); //보드 아이디 파라미터 받아오기
  const navigate = useNavigate();
  const [uploadFiles, setUploadFiles] = useState<UploadFiles[]>([]);
  const [delFileIds, setDelFileIds] = useState<string[]>([]);
  const [uploadFileList, setUploadFileList] = useState<UploadFiles[]>([
    { file: null, fileName: "", fileType: "", fileSize: "", fileId: "" },
  ]);

  //notice의 카테고리 데이터 받아오기
  const getBoardCategoryListApi = async () => {
    const params = {
      search: "",
      start: "",
      display: "",
      searchType: "NOTICE",
    };
    const response = await getBoardCategoryList(params);
    if (response && response.data) {
      return response.data.filter(
        (category: any) => category.division === "NOTICE"
      );
    }

    return [];
  };
  const { data: boardCategoryList, isLoading: boardCategoryLoading } = useQuery(
    "boardCategoryList",
    getBoardCategoryListApi
  );

  //수정일 경우 카테고리 포함 보드 데이터 가져오기
  const getBoardWithCategory = async () => {
    try {
      // 보드 데이터 가져오기
      const board = await getBoard(boardId);

      // 보드의 카테고리 정보 가져오기
      const categoryData = await getBoardCategory(board.data.boardCategoryId);

      //파일데이터 가져오기
      const uploadFileListApi = await getBoardFilesList(boardId);
      const uploadFileData: UploadFiles[] = uploadFileListApi.data.map(
        (item: any) => ({
          file: item.file,
          fileName: item.orgFileName,
          fileType: item.fileType,
          fileSize: convertFileSize(item.fileSize),
          fileId: item.fileId,
        })
      );

      // 카테고리 정보 추가
      const boardWithCategory = {
        ...board,
        category: categoryData.data,
        uploadFileList: uploadFileData,
      };

      return boardWithCategory;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // 데이터 받아오기
  const { data: boardWithCategory, isLoading: boardLoading } = useQuery(
    "boardWithCategory",
    getBoardWithCategory,
    {
      enabled: !!boardId, // boardId가 존재할 때만 실행
    }
  );

  //boardId가 있을경우 수정, 없을경우 생성
  const mutation = useMutation(
    (values) => (boardId ? updateBoard(boardId, values) : insertBoard(values)),
    {
      onSuccess: (data) => {
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: t("text.save"),
            text: t("menu.board.alert.save"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          });
          navigate(-1);
        } else {
          Swal.fire({
            icon: "error",
            title: t("text.save"),
            text: t("CODE.E_ADD_DATA"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          });
        }
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
      userName: user?.name,
      title: boardId ? boardWithCategory?.data?.title || "" : "",
      boardCategoryId: boardId
        ? boardWithCategory?.category?.boardCategoryId || ""
        : "",
      contents: boardId ? boardWithCategory?.data?.contents || "" : "",
      status: "0",
      boardDivision: "NOTICE",
      uploadFileList: boardId ? boardWithCategory?.uploadFileList || [] : [],
      delFileIds: delFileIds,
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      boardCategoryId: Yup.string().required(),
      contents: Yup.string().required(),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      //json값에 uploadFileList를 제외한 value 값 넣기
      const { uploadFileList, ...jsonValues } = values;

      const formData = new FormData();
      formData.append(
        "board",
        new Blob([JSON.stringify(jsonValues)], {
          type: "application/json",
        })
      );

      //uploadFileListInfo값에 파일만 추출해서 formdata에 넣어주기
      uploadFileList.map((uploadFileItem: any) => {
        const file =
          uploadFileItem.file ||
          new Blob([], { type: "application/octet-stream" });
        console.log(file);
        formData.append("uploadFileList", file);
      });

      mutation.mutate(formData as any); // mutation 실행
    },
  });

  // 내용 초기화
  useEffect(() => {
    if (!boardId) {
      // 새로운 게시글 작성 모드일 경우 폼 초기화
      formik.setValues({
        memberId: user?.memberId,
        userName: user?.name,
        title: "",
        boardCategoryId: "",
        contents: "",
        status: "0",
        boardDivision: "NOTICE",
        uploadFileList: [],
        delFileIds: delFileIds,
      });
    }
  }, [boardId]); // boardId가 없을 때 폼 값을 초기화

  // // 카테고리 선택시 값 업데이트
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    formik.setFieldValue("boardCategoryId", event.target.value);
    formik.setFieldTouched("boardCategoryId", true); // 필드를 touched로 표시
    formik.validateForm(); // 유효성 검사 트리거
  };

  // // 타이틀 값 업데이트
  // const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   formik.setFieldValue("title", event.target.value);
  //   formik.setFieldTouched("title", true);
  //   formik.validateForm();
  // };

  // // contents 값 업데이트
  // const handleContentChange = (contents: string) => {
  //   formik.setFieldValue("contents", contents);
  //   formik.setFieldTouched("contents", true);
  //   formik.validateForm();
  // };

  //글 작성 취소
  const onClickCancel = () => {
    Swal.fire({
      icon: "warning",
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

  //로딩
  if (boardLoading || boardCategoryLoading) {
    return <Loading />;
  }

  //첨부파일 변경 시
  const handleUploadFileSelect = (uploadFileList: UploadFiles[]) => {
    setUploadFiles(uploadFileList);
    formik.setFieldValue("uploadFileList", uploadFileList);
  };

  //첨부파일 삭제 시 (기등록된 파일만)
  const handleDeleteFile = (
    uploadFileList: UploadFiles[],
    updateDelFileIds: string[]
  ) => {
    formik.setFieldValue("uploadFileList", uploadFileList);
    formik.setFieldValue("delFileIds", [
      ...formik.values.delFileIds,
      ...updateDelFileIds,
    ]);
  };

  return (
    <Wrapper>
      {boardId ? (
        <TitleCenter>{t("menu.board.notice_modify")}</TitleCenter>
      ) : (
        <TitleCenter>{t("menu.board.notice_create")}</TitleCenter>
      )}
      <form className="form" onSubmit={formik.handleSubmit}>
        <TitleInputArea>
          <div className="category">
            <FormControl className="form-select">
              <InputLabel htmlFor="boardCategoryId">
                {t("menu.board.category")}
              </InputLabel>
              <Select
                variant="outlined"
                className="category-select"
                value={formik.values.boardCategoryId}
                onChange={handleCategoryChange}
                label={t("menu.board.category")}
                required
                // error={formik.touched.boardCategoryId && Boolean(formik.errors.boardCategoryId)}
              >
                {(boardCategoryList || []).map((category: any) => (
                  <MenuItem
                    key={category.boardCategoryId}
                    value={category.boardCategoryId}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {/* {formik.touched.boardCategoryId && formik.errors.boardCategoryId && (
                <FormHelperText error>{t("menu.board.error.category")}</FormHelperText>
              )} */}
            </FormControl>
          </div>
          <div className="title">
            <FormControl className="form-input">
              <InputLabel htmlFor="title">{t("text.title")}</InputLabel>
              <OutlinedInput
                id="title"
                label={t("text.title")}
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
              />
              {formik.touched.title && formik.errors.title && (
                <FormHelperText error>
                  {t("menu.board.error.title")}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </TitleInputArea>
        <ContentsInputArea>
          <QuillEditer
            value={formik.values.contents}
            onChange={(text: any) => formik.setFieldValue("contents", text)}
            error={formik.touched.contents && Boolean(formik.errors.contents)}
          />
          {formik.touched.contents && formik.errors.contents && (
            <FormHelperText error>
              {t("menu.board.error.contents")}
            </FormHelperText>
          )}
        </ContentsInputArea>
        <Box margin={"0 0 20px 0"}>
          <BoardFilesUpload
            values={formik.values.uploadFileList}
            onChangeFile={handleUploadFileSelect}
            onDeleteFile={handleDeleteFile}
          />
        </Box>
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
          <Button className="save-btn" type="submit" variant="contained">
            {t("text.save")}
          </Button>
        </BoardButtonArea>
      </form>
    </Wrapper>
  );
}

export default NoticeForm;
