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
} from "../../apis/recipeApi";
import { useAuth } from "../../auth/AuthContext";
import Loading from "../../components/Loading";
import ScrollTop from "../../components/ScrollTop";

import { handleApiError } from "../../hooks/errorHandler";
import { PageTitleBasic, Wrapper } from "../../styles/CommonStyles";
import { MemberRecipeWirteForm, TitleBox } from "../../styles/RecipeStyle";
import RecipeImageUpload from "./RecipeImageUpload";
import RecipeIngredientInputList from "./RecipeIngredientInputList";
import RecipeProcessListInput from "./RecipeProcessListInput";

export interface FocusableButton {
  focus: () => void;
}

function MemberRecipeWrite() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { recipeId } = useParams(); //레시피 아이디 파라미터 받아오기
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const navigate = useNavigate();
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [ingredients] = useState<{ name: string; amount: string }[]>([
    { name: "", amount: "" },
  ]);

  const [recipeProgress] = useState<
    {
      image: File | null;
      contents: string;
      imgId: string;
      isServerImgVisible: boolean;
    }[]
  >([{ image: null, contents: "", imgId: "", isServerImgVisible: false }]);

  const [isLoading, setIsLoading] = useState<boolean>(!!recipeId); // 로딩 상태 추가

  const imageUploadRef = useRef<FocusableButton | null>(null); //썸네일용
  const imageRefs = useRef<(FocusableButton | null)[]>([]); // FocusableButton 타입의 배열로 설정

  // 레시피작성에 필요한 카테고리 데이터 가져오기
  const fetchRecipeCategoryListForWirte = async () => {
    try {
      const params = {};
      const getRecipeCategoryList = await getRecipeCategoryListForWrite(params);
      console.log(getRecipeCategoryList);

      return getRecipeCategoryList.data;
    } catch (error) {
      handleApiError(error, navigate, t);
      //return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const { data: getRecipeCategoryList } = useQuery(
    "getRecipeCategoryList",
    fetchRecipeCategoryListForWirte,
    {
      refetchOnWindowFocus: false,

      onError: (error) => {
        handleApiError(error, navigate, t);
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
      handleApiError(error, navigate, t);
      //return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const [serverThumbnail, setServerThumbnail] = useState<any>(null);
  const { data: memberRecipe } = useQuery(
    ["memberRecipe", recipeId],
    fetchMemberRecipe,
    {
      enabled: !!recipeId,
      onSuccess: (data) => {
        if (data.success && data.data.memberRecipe.memberRecipeImages) {
          setServerThumbnail(data.data.memberRecipe.memberRecipeImages);
          setIsLoading(false);
        }
      },
      onError: (error) => {
        setIsLoading(false);
        handleApiError(error, navigate, t);
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
        if (data && data.success) {
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
        handleApiError(error, navigate, t);
      },
    }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      recipeInfo: {
        recipeId: recipeId ? recipeId || null : null,
        memberId: user?.memberId,
        title: recipeId ? memberRecipe?.data?.memberRecipe?.title || "" : "",
        recipeCategoryId: recipeId
          ? memberRecipe?.data?.memberRecipe?.recipeCategoryId || ""
          : "",
        method: recipeId
          ? memberRecipe?.data?.memberRecipe?.recipeMethodId || ""
          : "",
        imgId: recipeId ? memberRecipe?.data?.memberRecipe?.imgId || "" : "",
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
      thumbnail: null,
      recipeIngredients: recipeId
        ? memberRecipe?.data?.memberRecipeIngredient || ingredients
        : ingredients,

      recipeProcessItems: recipeId
        ? memberRecipe?.data?.memberRecipeProcessList.map((item: any) => ({
            ...item,
            isServerImgVisible: true,
          })) || recipeProgress
        : recipeProgress,
    },
    validationSchema: Yup.object({
      recipeInfo: Yup.object({
        title: Yup.string().required(),
        recipeCategoryId: Yup.string().required(),
        method: Yup.string().required(),
        serving: Yup.string().required(),
        level: Yup.string().required(),
        time: Yup.number().required(),
        calory: Yup.number().required(),
        tip: Yup.string().required(),
      }),
      thumbnail: Yup.mixed()
        .test(function (value) {
          return this.parent.recipeInfo.imgId ? true : !!value;
        })
        .nullable(), // imgId가 있으면 null 허용
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
            image: Yup.mixed()
              .test(function (value) {
                const { imgId, isServerImgVisible } = this.parent;
                if (imgId && isServerImgVisible) return true;
                return value !== null && value !== undefined;
              })
              .nullable(), // imgId가 있으면 null 허용
            contents: Yup.string().required(),
          })
        )
        .min(1)
        .required(),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append(
        "recipeInfo",
        new Blob([JSON.stringify(values.recipeInfo)], {
          type: "application/json",
        })
      );
      if (values.thumbnail) {
        formData.append("thumbnailImage", values.thumbnail);
      }

      formData.append(
        "recipeIngredients",
        new Blob([JSON.stringify(values.recipeIngredients)], {
          type: "application/json",
        })
      );
      formData.append(
        "recipeProcessItems",
        new Blob([JSON.stringify(values.recipeProcessItems.content)], {
          type: "application/json",
        })
      );

      values.recipeProcessItems.forEach((recipeProcessItem: any) => {
        const file =
          recipeProcessItem.image ||
          new Blob([], { type: "application/octet-stream" });

        formData.append("recipeProcessItems.image", file);
        formData.append(
          "recipeProcessItems.contents",
          recipeProcessItem.contents || ""
        );
        formData.append(
          "recipeProcessItems.imgId",
          recipeProcessItem.imgId || ""
        );
      });

      // mutation 호출 시 추가 데이터 포함
      mutation.mutate(formData as any);
    },
  });

  // 수동으로 폼 제출 처리
  const handleManualSubmit = async () => {
    const errors = await formik.validateForm();
    formik.handleSubmit();
  };

  // 내용 초기화
  useEffect(() => {
    if (!recipeId) {
      setIsLoading(false);
      // 새로운 게시글 작성 모드일 경우 폼 초기화
      formik.setValues({
        recipeInfo: {
          recipeId: "",
          memberId: user?.memberId,
          title: "",
          recipeCategoryId: "",
          method: "",
          imgId: "",
          serving: "",
          level: "",
          time: "",
          calory: "",
          tip: "",
        },
        thumbnail: null,
        recipeIngredients: ingredients,
        recipeProcessItems: recipeProgress,
      });
    }
  }, [recipeId]); // recipeId가 없을 때 폼 값을 초기화

  const handleImageChange = (file: File | null) => {
    formik.setFieldValue("thumbnail", file);
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("thumbnail", null);
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
  const recipeIngredientsTouched =
    (formik.touched.recipeIngredients as Array<{
      name?: boolean;
      amount?: boolean;
    }>) || [];

  const recipeProcessErrors = formik.errors.recipeProcessItems as
    | Array<{
        image?: File;
        contents?: string;
        imgId?: string;
      }>
    | undefined;
  const recipeProcessTouched =
    (formik.touched.recipeProcessItems as Array<{
      image?: boolean;
      contents?: boolean;
      imgId?: boolean;
    }>) || [];

  return (
    <Wrapper>
      <Box component="section" sx={{ width: "100%" }}>
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
                      name={"recipeInfo.imgId"}
                      ref={imageUploadRef}
                      image={formik.values.thumbnail}
                      serverImage={serverThumbnail}
                      onImageChange={(file) => handleImageChange(file)}
                      onRemoveImage={() => handleRemoveImage()}
                      isServerImgVisible={serverThumbnail ? true : false}
                      style={style}
                    />

                    {formik.touched?.thumbnail && formik.errors?.thumbnail && (
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
                      error={
                        formik.touched.recipeInfo?.level &&
                        Boolean(formik.errors.recipeInfo?.level)
                      }
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
                          {t("recipe.error.recipeLevelId")}
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
                  <RecipeIngredientInputList
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
      <ScrollTop />
    </Wrapper>
  );
}

export default MemberRecipeWrite;
