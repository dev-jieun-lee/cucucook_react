import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { handleApiError } from "../../../hooks/errorHandler";
import { DialogForm, DialogTitleArea } from "../../../styles/CommonStyles";
import { BoardButtonArea } from "../../../styles/BoardStyle";
import {
  deleteRecipeCategory,
  getRecipeCategory,
  insertRecipeCategory,
  updateRecipeCategory,
} from "../../../apis/adminApi";

interface RecipeCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  categoryId?: string;
}

interface CategoryData {
  recipeCategoryId: string;
  name: string;
  nameEn: string;
  division: string;
  color: string;
}

function RecipeCategoryDialog({
  open,
  onClose,
  categoryId,
}: RecipeCategoryDialogProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);

  const recipeDivision = [
    { value: "C", label: t("text.category") },
    { value: "M", label: t("text.cooking-method") },
    { value: "L", label: t("text.difficulty-level") },
  ];

  useEffect(() => {
    if (open && categoryId) {
      // 다이얼로그가 열리고 categoryId가 있을 때만 API 호출
      const fetchData = async () => {
        try {
          const params = { recipeCategoryId: categoryId };
          const data = await getRecipeCategory(params);
          setCategoryData(data.data.data);
        } catch (error) {
          handleApiError(error, navigate, t);
          //          console.error("Failed to fetch category data:", error);
        }
      };

      fetchData();
    }
  }, [open, categoryId]);

  //categoryId 있을경우 수정, 없을경우 생성
  const mutation = useMutation(
    (values) => {
      const params = { recipeCategoryId: categoryId };
      return categoryId
        ? updateRecipeCategory(params, values)
        : insertRecipeCategory(values);
    },
    {
      onSuccess: (data) => {
        if (data && data.success) {
          Swal.fire({
            icon: "success",
            title: categoryId ? t("text.update") : t("text.save"),
            text: categoryId ? t("CODE.S_UPDATE_DATA") : t("CODE.S_ADD_DATA"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          }).then(() => {
            onClose();
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: categoryId ? t("text.update") : t("text.save"),
            text: categoryId ? t("CODE.E_UPDATE_DATA") : t("CODE.E_ADD_DATA"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          });
        }
      },
      onError: (error) => {
        handleApiError(error, navigate, t);
      },
    }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: categoryId ? categoryData?.name || "" : "",
      nameEn: categoryId ? categoryData?.nameEn || "" : "",
      division: categoryData?.division || "",
      color: categoryId ? categoryData?.color || "" : "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required(
          t("recipe.error.required", {
            value: t("menu.recipe.category_name"),
          })
        )
        .max(
          10,
          t("recipe.error.max_length", {
            value: t("menu.recipe.category_name"),
            length: 10,
          })
        ),
      nameEn: Yup.string()
        .required(
          t("recipe.error.required", {
            value: t("menu.recipe.category_name_en"),
          })
        )
        .max(
          15,
          t("recipe.error.max_length", {
            value: t("menu.recipe.category_name_en"),
            length: 15,
          })
        ),
      division: Yup.string().required(t("menu.board.error.division_required")),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
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
        division: "",
        color: "",
      });
    }
  }, [categoryId]);

  // 다이얼로그 닫기 처리 및 상태 초기화
  const handleClose = () => {
    onClose();
  };

  // // 카테고리 선택시 값 업데이트
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    formik.setFieldValue("division", event.target.value);
    formik.setFieldTouched("division", true); // 필드를 touched로 표시
    formik.validateForm(); // 유효성 검사 트리거
  };

  //삭제
  const { mutate: deleteCategoryMutation } = useMutation(
    (recipeCategoryId: string) => {
      const params = { recipeCategoryId };
      return deleteRecipeCategory(params);
    },
    {
      onSuccess: (data) => {
        if (data && data.success) {
          Swal.fire({
            icon: "success",
            title: t("text.delete"),
            text: t("recipe.alert.delete_recipe_category_sucecss"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          }).then(() => {
            onClose();
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: t("text.delete"),
            text:
              data.message === "ERR_CG_01"
                ? t("recipe.error.ERR_CG_01")
                : t("recipe.alert.delete_recipe_category_error"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          });
        }
      },
      onError: (error) => {
        handleApiError(error, navigate, t);
      },
    }
  );
  const onClickDelete = (categoryId: string) => {
    Swal.fire({
      icon: "warning",
      title: t("text.delete"),
      text: t("recipe.alert.delete_recipe_category_confirm"),
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
        style: { overflow: "visible" },
      }}
    >
      <DialogTitleArea>
        <DialogTitle>
          {categoryId ? (
            <span className="title">
              {t("text.category")} {t("text.update")}
            </span>
          ) : (
            <span className="title">
              {t("text.category")} {t("text.add")}
            </span>
          )}
        </DialogTitle>
        <IconButton className="close-btn" aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitleArea>
      <DialogContent dividers>
        <DialogForm onSubmit={formik.handleSubmit}>
          <FormControl className="input-form form-select">
            <InputLabel htmlFor="recipeCategoryId">
              {t("menu.recipe.division")}
            </InputLabel>
            <Select
              fullWidth
              variant="outlined"
              className="category-select"
              value={formik.values.division}
              label={t("menu.recipe.division")}
              required
              disabled={!!categoryId}
              onChange={handleCategoryChange}
            >
              {recipeDivision?.map((division: any) => (
                <MenuItem key={division.value} value={division.value}>
                  {division.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className="input-form">
            <TextField
              fullWidth
              id="name"
              name="name"
              label={t("menu.recipe.category_name")}
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
              label={t("menu.recipe.category_name_en")}
              value={formik.values.nameEn}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.nameEn && Boolean(formik.errors.nameEn)}
              helperText={formik.touched.nameEn && formik.errors.nameEn}
            />
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
export default RecipeCategoryDialog;
