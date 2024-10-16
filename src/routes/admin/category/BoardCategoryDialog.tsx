import { Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
import { HexColorPicker } from "react-colorful";
import { useMutation, useQuery } from "react-query";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useFormik } from "formik";
import { BoardButtonArea } from "../../../styles/BoardStyle";
import { DialogForm, DialogTitleArea } from "../../../styles/CommonStyles";
import { deleteBoardCategory, getBoardCategory, insertBoardCategory, updateBoardCategory } from "../../../apis/adminApi";

interface BoardCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  categoryId?: string;
}

interface CategoryData {
  boardCategoryId: string;
  name: string;
  nameEn: string;
  division: string;
  color: string;
}

function BoardCategoryDialog({ open, onClose, categoryId }: BoardCategoryDialogProps) {
  const { t } = useTranslation();
  const [color, setColor] = useState("#000000"); 
  const [showPicker, setShowPicker] = useState(false); //
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);


  const boardDivision = [
    { value: "NOTICE", label: t("menu.board.notice") },
    { value: "FAQ", label: t("menu.board.FAQ")  },
    { value: "QNA", label: t("menu.board.QNA")  }
  ];

  // 색상 선택 함수
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    // setShowPicker(false); 
  };

  useEffect(() => {
    if (open && categoryId) {
      // 다이얼로그가 열리고 categoryId가 있을 때만 API 호출
      const fetchData = async () => {
        try {
          const data = await getBoardCategory(categoryId);
          setCategoryData(data.data);
        } catch (error) {
          console.error("Failed to fetch category data:", error);
        }
      };
  
      fetchData();
    }
  }, [open, categoryId]);

  //categoryId 있을경우 수정, 없을경우 생성
  const mutation = useMutation(
    (values) => (categoryId ? updateBoardCategory(categoryId, values) : insertBoardCategory(values)),
    {
      onSuccess: (data) => {
        Swal.fire({
          icon: "success",
          title: t("text.save"),
          text: t("menu.board.alert.save"),
          showConfirmButton: true,
          confirmButtonText: t("text.check")
        });
        onClose();
        window.location.reload();
      },
      onError: (error) => {
        // 에러 처리
      },
    }
  );


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: categoryId ? categoryData?.name || "" : "",
      nameEn: categoryId ? categoryData?.nameEn || "" : "",
      division : categoryData?.division || "",
      color: categoryId ? categoryData?.color || "" : "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required(t("error.required", { value: t("menu.board.category_name") })) 
        .max(10, t("error.max_length", { value: t("menu.board.category_name"), length : 10 })),
        nameEn: Yup.string()
        .required(t("error.required", { value: t("menu.board.category_name_en") })) 
        .max(30, t("error.max_length", { value: t("menu.board.category_name_en"), length : 30 })),
      division: Yup.string().required(t("error.required", { value: t("menu.board.division") })) 
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      // color가 선택되지 않았으면 기본값 검정색
      if (!values.color) {
        values.color = "#000000"; 
      }
      
      mutation.mutate(values as any); // mutation 실행
    },
  });


  // 내용 초기화
  useEffect(() => {
    if (!categoryId) {
      // 새로운 게시글 작성 모드일 경우 폼 초기화
      formik.setValues({
        name: "",
        nameEn: "",
        division : "",
        color: "",
      });
    }
  }, [categoryId]);


  useEffect(() => {
    if (open) {
      setShowPicker(false); // 다이얼로그 열릴 때 color picker 닫기
    }
  }, [open]);
  
  // color picker 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showPicker && 
        event.target instanceof HTMLElement &&
        !event.target.closest(".color-picker-container")
      ) {
        setShowPicker(false); // 외부 클릭 시 color picker 닫기
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);
  
  // 다이얼로그 닫기 처리 및 상태 초기화
  const handleClose = () => {
    onClose(); 
    setColor(""); 
    setShowPicker(false); // Picker 닫기
  };

  // // 카테고리 선택시 값 업데이트
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    formik.setFieldValue("division", event.target.value);
    formik.setFieldTouched("division", true); // 필드를 touched로 표시
    formik.validateForm(); // 유효성 검사 트리거
  };
  
  //삭제
  const { mutate: deleteCategoryMutation } = useMutation(
    (categoryId : string) => deleteBoardCategory(categoryId),
    {
      onSuccess: (data) => {
        Swal.fire({
          icon: 'success',
          title: t("text.delete"),
          text: t("menu.board.alert.delete"),
          showConfirmButton: true,
          confirmButtonText: t("text.check")
        });
        window.location.reload();
      },
      onError: (error : any) => {
        const errorCode = error.response?.data.errorCode ;
        Swal.fire({
          icon: 'error',
          title: t("text.delete"),
          text: errorCode === "ERR_CG_01" ? t("menu.board.error.ERR_CG_01") : t("menu.board.alert.delete"),
          showConfirmButton: true,
          confirmButtonText: t("text.check")
        });
      },
    }
  );
  const onClickDelete = (categoryId : string) => {
    Swal.fire({
      icon: 'warning',
      title: t("text.delete"),
      text: t("menu.board.alert.delete_confirm_category"),
      showCancelButton: true,
      confirmButtonText: t("text.delete"),
      cancelButtonText: t("text.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // 삭제 API 호출
        deleteCategoryMutation(categoryId as string);
      }
    });
  };


  return (
    <Dialog 
      onClose={handleClose} 
      open={open} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        style: { overflow: "visible"} 
      }}
    >
      <DialogTitleArea>
        <DialogTitle>
          {categoryId? (
            <span className="title">
              {t("text.category")} {t("text.update")}
            </span>
          ) : (
            <span className="title">
              {t("text.category")} {t("text.add")}
            </span>
          )}
        </DialogTitle>
        <IconButton
          className="close-btn"
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitleArea>
      <DialogContent dividers>
        <DialogForm onSubmit={formik.handleSubmit}>
          <FormControl className="input-form form-select">
            <InputLabel htmlFor="boardCategoryId">
              {t("menu.board.division")}
            </InputLabel>
            <Select
              fullWidth
              variant="outlined"
              className="category-select"
              value={formik.values.division}
              label={t("menu.board.division")}
              required
              disabled={!!categoryId}
              onChange={handleCategoryChange}
              // error={formik.touched.division && Boolean(formik.errors.division)}
            >
              {boardDivision?.map((division: any) => (
                <MenuItem key={division.value} value={division.value}>
                  {division.label}
                </MenuItem>
              ))}
            </Select>
            {/* {formik.touched.division && formik.errors.division && (
              <FormHelperText error>{t("menu.board.error.category")}</FormHelperText>
            )} */}
          </FormControl>
          <FormControl className="input-form">
            <TextField
              fullWidth
              id="name"
              name="name"
              label={t("menu.board.category_name")}
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name} 
            />
          </FormControl>
          <FormControl className="input-form">
            <TextField
              fullWidth
              id="nameEn"
              name="nameEn"
              label={t("menu.board.category_name_en")}
              value={formik.values.nameEn}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.nameEn && Boolean(formik.errors.nameEn)}
              helperText={formik.touched.nameEn && formik.errors.nameEn} 
            />
          </FormControl>
          <FormControl className="input-form">
            <TextField
              fullWidth
              id="color"
              name="color"
              label="Color"
              value={formik.values.color}
              InputProps={{ readOnly: true }} 
              onClick={() => setShowPicker((prev) => !prev)} // input 클릭 시 ColorPicker 표시/닫기
            />

            {showPicker && (
              <div 
                className="color-picker-container"
                style={{
                  position: "absolute",
                  zIndex: 1,
                  bottom: "100%", // input 위에 표시되게 설정
                }}
              >
                <HexColorPicker 
                  color={formik.values.color || color} // formik의 컬러 값 반영
                  onChange={(newColor) => {
                    handleColorChange(newColor); 
                    formik.setFieldValue("color", newColor); // formik의 컬러 값 업데이트
                  }}
                />
              </div>
            )}
          </FormControl>

          <BoardButtonArea>
            {categoryId ? (
              <Button
                className="cancel-btn"
                type="button"
                variant="outlined"
                color="warning"
                onClick={() => onClickDelete(categoryId)}
              >
                {t("text.delete")}
              </Button>
            ) : (
              <></>
            )}
            <Button className="save-btn" type="submit" variant="contained">
              {t("text.save")}
            </Button>
          </BoardButtonArea>
        </DialogForm>
      </DialogContent>
    </Dialog>
  );
}
export default BoardCategoryDialog;