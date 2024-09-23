import { KeyboardArrowUp } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  getMemberRecipe,
  getRecipeCategoryListForWrite,
  insertMemberRecipe,
  updateMemberRecipe,
} from "../../api";
import {
  PageTitleBasic,
  ScrollBtnFab,
  Wrapper,
} from "../../styles/CommonStyles";
import { MemberRecipeWirteForm, TitleBox } from "../../styles/RecipeStyle";
import RecipeImageUpload from "./RecipeImageUpload";
import RecipeProcessListInput from "./RecipeProcessListInput";
import RecpieIngredientInputList from "./RecpieIngredientInputList";
import LoadingNoMargin from "../../components/LoadingNoMargin";
import Loading from "../../components/Loading";

export interface FocusableButton {
  focus: () => void;
}

function MemberRecipeWrite({ isDarkMode }: { isDarkMode: boolean }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { recipeId } = useParams(); //레시피 아이디 파라미터 받아오기
  const navigate = useNavigate();
  const [touchedChanged, setTouchedChanged] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [ingredients] = useState<{ name: string; amount: string }[]>([
    { name: "", amount: "" },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(!!recipeId); // 로딩 상태 추가
  const [processItems] = useState<
    { image: File | null; serverImage: any; processContents: string }[]
  >([{ image: null, serverImage: "", processContents: "" }]);

  const imageUploadRef = useRef<FocusableButton | null>(null); //썸네일용
  const imageRefs = useRef<(FocusableButton | null)[]>([]); // FocusableButton 타입의 배열로 설정

  // 레시피작성에 필요한 카테고리 데이터 가져오기
  const fetchRecipeCategoryListForWirte = async () => {
    try {
      const params = {};
      const getRecipeCategoryList = await getRecipeCategoryListForWrite(params);
      return getRecipeCategoryList.data;
    } catch (error) {
      console.error(error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const { data: getRecipeCategoryList } = useQuery(
    "getRecipeCategoryList",
    fetchRecipeCategoryListForWirte,
    {
      refetchOnWindowFocus: false,

      onError: (err) => {
        console.error(err);
      },
      keepPreviousData: true,
    }
  );

  //수정일 경우 해당 레시피 데이터 가져오기
  const fetchMemberRecipe = async () => {
    const params = { recipeId, isUpdate: true };
    try {
      const publicRecipe = await getMemberRecipe(params);
      return publicRecipe.data;
    } catch (error) {
      console.error(error);
      return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const [serverThumbnail, setServerThumbnail] = useState<any>(null);
  const { data: memberRecipe } = useQuery(
    ["memberRecipe", recipeId],
    fetchMemberRecipe,
    {
      enabled: !!recipeId,
      onSuccess: (data) => {
        if (data.success && data.data.memberRecipeImages)
          setServerThumbnail(data.data.memberRecipeImages);

        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    }
  );

  //recipeId가 있을경우 수정, 없을경우 생성
  const mutation = useMutation(
    (values) =>
      recipeId
        ? updateMemberRecipe(recipeId, values)
        : insertMemberRecipe(values),
    {
      onSuccess: (data) => {
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: recipeId ? t("text.update") : t("text.save"),
            text: recipeId ? t("recipe.alert.update") : t("recipe.alert.save"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          });
          navigate("/recipe/member_recipe_list");
        } else {
          Swal.fire({
            icon: "error",
            title: recipeId ? t("text.update") : t("text.save"),
            text: t("CODE." + data.message),
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
      recipeInfo: {
        recipeId: recipeId ? recipeId || null : null,
        memberId: 1,
        title: recipeId ? memberRecipe?.data?.memberRecipe?.title || "" : "",
        recipeCategoryId: recipeId
          ? memberRecipe?.data?.memberRecipe?.recipeCategoryId || ""
          : "",
        method: recipeId
          ? memberRecipe?.data?.memberRecipe?.recipeMethodId || ""
          : "",
        //thumbnail: memberRecipe?.data?.memberRecipe?.memberRecipeImages,
        thumbnail: null,
        serving: recipeId
          ? memberRecipe?.data?.memberRecipe?.serving || ""
          : "",
        level: recipeId
          ? memberRecipe?.data?.memberRecipe?.recipeLevelId || ""
          : "",
        time: recipeId ? memberRecipe?.data?.memberRecipe?.time || "" : "",
        calory: recipeId ? memberRecipe?.data?.memberRecipe?.calory || "" : "",
        tip: recipeId ? memberRecipe?.data?.memberRecipe?.tip || "" : "",
      },
      recipeIngredients: recipeId
        ? memberRecipe?.data?.memberRecipeIngredient || ingredients
        : ingredients,
      recipeProcessItems: recipeId
        ? memberRecipe?.data?.memberRecipeProcessListForUpdate || processItems
        : processItems,
    },
    validationSchema: Yup.object({
      recipeInfo: Yup.object({
        title: Yup.string().required(),
        recipeCategoryId: Yup.string().required(),
        method: Yup.string().required(),
        //thumbnail: Yup.mixed().required(),
        serving: Yup.string().required(),
        level: Yup.string().required(),
        time: Yup.number().required(),
        calory: Yup.number().required(),
        tip: Yup.string().required(),
      }),
      recipeIngredients: Yup.array()
        .of(
          Yup.object({
            name: Yup.string().required(),
            amount: Yup.string().required(),
          })
        )
        .min(1)
        .required(),
      recipeProcessItems: Yup.array()
        .of(
          Yup.object({
            // image: Yup.mixed().required(),
            processContents: Yup.string().required(),
          })
        )
        .min(1)
        .required(),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const thumbnailElement = document.getElementsByName(
        "thumbnail_server_img_id"
      )[0] as HTMLInputElement;
      const thumbnailServerImgId = thumbnailElement.value;

      const dataToSubmit = {
        ...values, // 기존 formik의 values
        thumbnailServerImgId,
      };

      // mutation 호출 시 추가 데이터 포함
      mutation.mutate(dataToSubmit as any);
    },
  });

  // 오류가 있는 필드에 포커스하는 함수 정의
  const focusFirstErrorField = () => {
    if (formik.errors) {
      // recipeInfo 필드의 오류 처리
      const recipeInfoErrorFields = Object.keys(formik.errors.recipeInfo || {});
      const recipeInfoErrorFieldsToTouch = recipeInfoErrorFields.reduce(
        (acc, field) => {
          acc[field] = true;
          return acc;
        },
        {} as any
      );

      // recipeIngredients 필드의 오류 처리
      const recipeIngredientsErrors =
        (formik.errors.recipeIngredients as Array<{
          name?: string;
          amount?: string;
        }>) || [];

      // 각 오류 항목을 touched 상태로 설정
      const recipeIngredientsErrorFieldsToTouch =
        recipeIngredientsErrors.reduce((acc, _, index) => {
          acc[`${index}.name`] = true;
          acc[`${index}.amount`] = true;
          return acc;
        }, {} as Record<string, boolean>);

      // recipeProcessItems 필드의 오류 처리
      const recipeProcessItemsErrors =
        (formik.errors.recipeProcessItems as Array<{
          image?: File;
          processContents?: string;
        }>) || [];

      // 각 오류 항목을 touched 상태로 설정
      const recipeProcessItemsErrorFieldsToTouch =
        recipeProcessItemsErrors.reduce((acc, _, index) => {
          acc[`${index}.image`] = true;
          acc[`${index}.processContents`] = true;
          return acc;
        }, {} as Record<string, boolean>);

      // touched 상태 업데이트
      formik.setTouched({
        ...formik.touched,
        recipeInfo: {
          ...formik.touched.recipeInfo,
          ...recipeInfoErrorFieldsToTouch,
        },
        recipeIngredients: {
          ...((formik.touched.recipeIngredients as Record<string, boolean>) ||
            {}),
          ...recipeIngredientsErrorFieldsToTouch,
        },
        recipeProcessItems: {
          ...((formik.touched.recipeProcessItems as Record<string, boolean>) ||
            {}),
          ...recipeProcessItemsErrorFieldsToTouch,
        },
      });

      setTouchedChanged(true);
    }
  };

  // touched 상태가 업데이트된 후에 포커스를 이동시키는 useEffect
  useEffect(() => {
    if (touchedChanged) {
      // recipeInfo 필드의 오류와 touched 필드를 처리
      const recipeInfoErrorFields = Object.keys(formik.errors.recipeInfo || {});
      const recipeInfoTouchedFields = Object.keys(
        formik.touched.recipeInfo || {}
      );
      const recipeInfoErrorFieldsWithTouch = recipeInfoErrorFields.filter(
        (field) => recipeInfoTouchedFields.includes(field)
      );

      // recipeIngredients 필드의 오류와 touched 필드를 처리
      const recipeIngredientsErrors =
        (formik.errors.recipeIngredients as Array<{
          name?: string;
          amount?: string;
        }>) || [];
      const ingredientsTouchedFields = formik.touched
        .recipeIngredients as Record<
        string,
        { name?: boolean; amount?: boolean }
      >;

      // recipeProcessItems 필드의 오류와 touched 필드를 처리
      const recipeProcessItemsErrors =
        (formik.errors.recipeProcessItems as Array<{
          image?: File;
          processContents?: string;
        }>) || [];

      const processTouchedFields = formik.touched.recipeProcessItems as Record<
        string,
        { image?: File; processContents?: string }
      >;

      // 최초의 포커스 할 오류 필드 저장
      let focusElementId: string | null = null;

      if (recipeInfoErrorFieldsWithTouch.length > 0) {
        const firstErrorField = recipeInfoErrorFieldsWithTouch[0];
        if (firstErrorField === "thumbnail" && imageUploadRef.current) {
          setStyle({
            ...style,
            borderColor: "warning.dark", // 변경할 스타일 속성
          });
          imageUploadRef.current.focus();
        } else {
          const inputElement = document.getElementById(
            firstErrorField as string
          );
          if (inputElement) {
            setTimeout(() => {
              if (inputElement instanceof HTMLInputElement) {
                inputElement.focus();
              } else if (inputElement instanceof HTMLElement) {
                inputElement.focus();
              }
            }, 100);
          }
        }
      } else if (recipeIngredientsErrors.length > 0) {
        recipeIngredientsErrors.some((errors, index) => {
          const indexStr = index.toString();

          if (!errors) {
            return false; // null이면 처리하지 않고 다음 요소로 넘어감
          }
          // name 오류 체크
          if (errors.name && ingredientsTouchedFields[`${indexStr}.name`]) {
            focusElementId = `ingredient_name_${index}`;
            return true; // 오류 필드에 포커스 후 반복 종료
          }

          // amount 오류 체크
          if (errors.amount && ingredientsTouchedFields[`${indexStr}.amount`]) {
            focusElementId = `ingredient_amount_${index}`;
            return true; // 오류 필드에 포커스 후 반복 종료
          }

          return false;
        });
      } else {
        recipeProcessItemsErrors.some((errors, index) => {
          const indexStr = index.toString();

          if (!errors) {
            return false; // null이면 처리하지 않고 다음 요소로 넘어감
          }

          if (errors.image && processTouchedFields[`${indexStr}.image`]) {
            focusElementId = `recipe_process_image_${index}`;

            // 이미지가 비어있으면 해당 이미지 입력 필드에 포커스 설정
            if (imageRefs.current && imageRefs.current[index]) {
              setStyle({
                ...style,
                borderColor: "warning.dark", // 변경할 스타일 속성
              });

              imageRefs.current[index]?.focus();
            }

            return true; // 오류 필드에 포커스 후 반복 종료
          }

          // 내용 오류 체크
          if (
            errors.processContents &&
            processTouchedFields[`${indexStr}.processContents`]
          ) {
            focusElementId = `recipe_process_contents_${index}`;
            return true; // 오류 필드에 포커스 후 반복 종료
          }

          return false;
        });
      }

      // 포커스 할 요소가 있는 경우
      if (focusElementId) {
        const inputElement = document.getElementById(focusElementId);

        if (inputElement) {
          setTimeout(() => {
            if (inputElement instanceof HTMLInputElement) {
              inputElement.focus();
            } else if (inputElement instanceof HTMLElement) {
              inputElement.focus();
            }
          }, 100);
        }
      }
      setTouchedChanged(false);
    }
  }, [formik.touched, formik.errors, touchedChanged]);

  // 수동으로 폼 제출 처리
  const handleManualSubmit = async () => {
    const errors = await formik.validateForm();

    // recipeInfo 필드의 유효성 검사
    const recipeInfoErrors = Object.keys(errors.recipeInfo || {}).length > 0;

    // recipeIngredients 필드의 유효성 검사
    const recipeIngredientsErrors =
      Object.keys(errors.recipeIngredients || {}).length > 0;

    // recipeProcessItems 필드의 유효성 검사
    const recipeProcessItemsErrors =
      Object.keys(errors.recipeProcessItems || {}).length > 0;

    if (
      recipeInfoErrors ||
      recipeIngredientsErrors ||
      recipeProcessItemsErrors
    ) {
      focusFirstErrorField();
    } else {
      formik.handleSubmit();
    }
  };

  // 내용 초기화
  useEffect(() => {
    if (!recipeId) {
      setIsLoading(false);
      // 새로운 게시글 작성 모드일 경우 폼 초기화
      formik.setValues({
        recipeInfo: {
          recipeId: "",
          memberId: 1,
          title: "",
          recipeCategoryId: "",
          method: "",
          thumbnail: null,
          serving: "",
          level: "",
          time: "",
          calory: "",
          tip: "",
        },
        recipeIngredients: ingredients,
        recipeProcessItems: processItems,
      });
    }
  }, [recipeId]); // recipeId가 없을 때 폼 값을 초기화

  const handleImageChange = (file: File | null) => {
    formik.setFieldValue("recipeInfo.thumbnail", file);
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("recipeInfo.thumbnail", null);
  };

  //글 작성 취소
  const onClickCancel = () => {
    Swal.fire({
      icon: "warning",
      title: t("text.cancel"),
      text: t("recipe.alert.cancel"),
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

  const recipeIngredientsErrors = formik.errors.recipeIngredients as
    | Array<{ name?: string; amount?: string }>
    | undefined;
  const recipeIngredientsTouched = formik.touched.recipeIngredients as
    | Record<string, boolean>
    | undefined;

  const recipeProcessErrors = formik.errors.recipeProcessItems as
    | Array<{
        image?: File;
        processContents?: string;
      }>
    | undefined;
  const recipeProcessTouched = formik.touched.recipeProcessItems as
    | Record<string, boolean>
    | undefined;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Wrapper>
      <Box component="section">
        <TitleBox>
          <PageTitleBasic>
            {t("text.member_recipe")}{" "}
            {recipeId ? t("text.update") : t("text.write")}
          </PageTitleBasic>
        </TitleBox>
        <Divider />
        {!isLoading ? (
          <MemberRecipeWirteForm>
            <form className="recipe-form" onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={1} className="width-max">
                <Grid item xs={12}>
                  <FormControl className="width-max">
                    <InputLabel htmlFor="title">{t("text.title")}</InputLabel>
                    <OutlinedInput
                      id="title"
                      name="recipeInfo.title"
                      label={t("text.title")}
                      value={formik.values.recipeInfo.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.recipeInfo?.title &&
                        typeof formik.errors.recipeInfo?.title === "string" &&
                        Boolean(formik.errors.recipeInfo?.title)
                      }
                    />
                    {formik.touched.recipeInfo?.title &&
                      formik.errors.recipeInfo?.title && (
                        <FormHelperText error>
                          {t("recipe.error.title")}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box margin={"20px 0"}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <FormControl className="width-max">
                    <InputLabel htmlFor="recipeCategoryId">
                      {t("text.category")}
                    </InputLabel>
                    <Select
                      id="recipeCategoryId"
                      name="recipeInfo.recipeCategoryId"
                      variant="outlined"
                      className="category-select"
                      label={t("text.category")}
                      value={formik.values.recipeInfo.recipeCategoryId || ""}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "recipeInfo.recipeCategoryId",
                          e.target.value
                        )
                      }
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.recipeInfo?.recipeCategoryId &&
                        Boolean(formik.errors.recipeInfo?.recipeCategoryId)
                      }
                    >
                      {(getRecipeCategoryList?.data.categoryList || []).map(
                        (category: any) => (
                          <MenuItem
                            key={category.recipeCategoryId}
                            value={category.recipeCategoryId}
                          >
                            {currentLang === "ko"
                              ? category.name
                              : category.name_en}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {formik.touched.recipeInfo?.recipeCategoryId &&
                      formik.errors.recipeInfo?.recipeCategoryId && (
                        <FormHelperText error>
                          {t("recipe.error.recipeCategoryId")}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl className="width-max">
                    <InputLabel htmlFor="method">
                      {t("text.cooking-method")}
                    </InputLabel>
                    <Select
                      id="method"
                      name="recipeInfo.method"
                      variant="outlined"
                      className="category-select"
                      label={t("text.cooking-method")}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "recipeInfo.method",
                          e.target.value
                        )
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.recipeInfo.method}
                      error={
                        formik.touched.recipeInfo?.method &&
                        Boolean(formik.errors.recipeInfo?.method)
                      }
                    >
                      {(getRecipeCategoryList?.data.methodList || []).map(
                        (category: any) => (
                          <MenuItem
                            key={category.recipeCategoryId}
                            value={category.recipeCategoryId}
                          >
                            {currentLang === "ko"
                              ? category.name
                              : category.name_en}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {formik.touched.recipeInfo?.method &&
                      formik.errors.recipeInfo?.method && (
                        <FormHelperText error>
                          {t("recipe.error.recipeMethodId")}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box margin={"20px 0"}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography>{t("text.thumbnail")}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box maxWidth={"300px"}>
                    <RecipeImageUpload
                      id={"thumbnail"}
                      name={"thumbnail"}
                      ref={imageUploadRef}
                      image={formik.values.recipeInfo.thumbnail}
                      serverImage={serverThumbnail}
                      onImageChange={(file) => handleImageChange(file)}
                      onRemoveImage={() => handleRemoveImage()}
                      isServerImgVisible={serverThumbnail ? true : false}
                      style={style}
                    />

                    {formik.touched.recipeInfo?.thumbnail &&
                      formik.errors.recipeInfo?.thumbnail && (
                        <FormHelperText error>
                          {t("recipe.error.thumbnail")}
                        </FormHelperText>
                      )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box margin={"20px 0"}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography>{t("text.recipe_info")}</Typography>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <FormControl className="width-max">
                    <InputLabel htmlFor="serving">
                      {t("text.serving")}
                    </InputLabel>
                    <OutlinedInput
                      id="serving"
                      name="recipeInfo.serving"
                      label={t("text.serving")}
                      endAdornment={
                        <InputAdornment position="end">
                          {t("text.serving")}
                        </InputAdornment>
                      }
                      value={formik.values.recipeInfo.serving}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.recipeInfo?.serving &&
                        Boolean(formik.errors.recipeInfo?.serving)
                      }
                    />
                    {formik.touched.recipeInfo?.serving &&
                      formik.errors.recipeInfo?.serving && (
                        <FormHelperText error>
                          {t("recipe.error.serving")}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControl className="width-max">
                    <InputLabel htmlFor="level">
                      {t("text.difficulty-level")}
                    </InputLabel>
                    <Select
                      id="level"
                      name="recipeInfo.level"
                      variant="outlined"
                      className="category-select"
                      label={t("text.difficulty-level")}
                      onChange={(e) =>
                        formik.setFieldValue("recipeInfo.level", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.recipeInfo.level}
                    >
                      {(getRecipeCategoryList?.data.levelList || []).map(
                        (category: any) => (
                          <MenuItem
                            key={category.recipeCategoryId}
                            value={category.recipeCategoryId}
                          >
                            {currentLang === "ko"
                              ? category.name
                              : category.name_en}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {formik.touched.recipeInfo?.level &&
                      formik.errors.recipeInfo?.level && (
                        <FormHelperText error>
                          {t("recipe.error.level")}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControl className="width-max">
                    <InputLabel htmlFor="cooking-time">
                      {t("text.cooking-time")}
                    </InputLabel>
                    <OutlinedInput
                      id="time"
                      name="recipeInfo.time"
                      label={t("text.cooking-time")}
                      endAdornment={
                        <InputAdornment position="end">
                          {t("text.minute-short")}
                        </InputAdornment>
                      }
                      value={formik.values.recipeInfo.time}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.recipeInfo?.time &&
                        Boolean(formik.errors.recipeInfo?.time)
                      }
                    />
                    {formik.touched.recipeInfo?.time &&
                      formik.errors.recipeInfo?.time && (
                        <FormHelperText error>
                          {t("recipe.error.time")}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControl className="width-max">
                    <InputLabel htmlFor="calories">
                      {t("text.calories")}
                    </InputLabel>
                    <OutlinedInput
                      id="calory"
                      name="recipeInfo.calory"
                      label={t("text.calories")}
                      endAdornment={
                        <InputAdornment position="end">kcal</InputAdornment>
                      }
                      value={formik.values.recipeInfo.calory}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.recipeInfo?.calory &&
                        Boolean(formik.errors.recipeInfo?.calory)
                      }
                    />
                    {formik.touched.recipeInfo?.calory &&
                      formik.errors.recipeInfo?.calory && (
                        <FormHelperText error>
                          {t("recipe.error.calory")}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box margin={"20px 0"}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography>{t("text.ingredient")}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <RecpieIngredientInputList
                    values={formik.values.recipeIngredients}
                    errors={recipeIngredientsErrors || []}
                    touched={recipeIngredientsTouched || {}}
                    setFieldValue={formik.setFieldValue}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box margin={"20px 0"}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography>{t("text.recipe_process")}</Typography>
                </Grid>
                <Grid item xs={12}>
                  {
                    <RecipeProcessListInput
                      values={formik.values.recipeProcessItems}
                      errors={recipeProcessErrors || []}
                      touched={recipeProcessTouched || {}}
                      setFieldValue={formik.setFieldValue}
                      imageRefs={imageRefs}
                      style={style}
                    />
                  }
                </Grid>
                <Grid item xs={12}>
                  <Box margin={"20px 0"}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  {t("text.tip")}
                </Grid>
                <Grid item xs={12} marginBottom={"20px"}>
                  <FormControl className="width-max">
                    <InputLabel htmlFor="tip">{t("text.tip")}</InputLabel>
                    <OutlinedInput
                      id="tip"
                      name="recipeInfo.tip"
                      label={t("text.tip")}
                      multiline
                      rows={3}
                      value={formik.values.recipeInfo.tip}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.recipeInfo?.tip &&
                        Boolean(formik.errors.recipeInfo?.tip)
                      }
                    />
                    {formik.touched.recipeInfo?.tip &&
                      formik.errors.recipeInfo?.tip && (
                        <FormHelperText error>
                          {t("recipe.error.tip")}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
              </Grid>

              <Divider />
              <Grid container className="recipe-btn-wrap" margin={"20px 0"}>
                <Grid item>
                  <Button
                    className="cancel-btn"
                    type="button"
                    variant="outlined"
                    color="warning"
                    onClick={() => onClickCancel()}
                  >
                    {t("text.cancel")}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    className="save-btn"
                    type="button"
                    onClick={handleManualSubmit}
                    variant="contained"
                  >
                    {t("text.recipe_write")}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </MemberRecipeWirteForm>
        ) : (
          <>
            <Loading />
          </>
        )}
      </Box>
      {showScrollButton && (
        <ScrollBtnFab color="primary" size="small" onClick={scrollToTop}>
          <KeyboardArrowUp />
        </ScrollBtnFab>
      )}
    </Wrapper>
  );
}

export default MemberRecipeWrite;
