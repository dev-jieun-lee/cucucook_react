import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { recipeCommonStyles } from "./RecipeStyle";
import RecipeImageUpload from "./RecipeImageUpload";
import { RefObject } from "react";
import { FocusableButton } from "./MemberRecipeWrite";

interface Process {
  image: File | null;
  contents: string;
  isServerImgVisible: boolean;
  memberRecipeImages: any;
}

interface RecipeIngredientInputListProps {
  values: Process[]; // Formik에서 값을 직접 받아옴
  errors: Array<{
    image?: File;
    contents?: string;
  }>;
  touched: Record<string, boolean>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  imageRefs: RefObject<(FocusableButton | null)[]>; // 부모로부터 전달받은 ref 배열
  style?: React.CSSProperties; // 스타일 props 추가(이미지용)
}

const RecipeProcessListInput: React.FC<RecipeIngredientInputListProps> = ({
  values,
  errors,
  touched,
  setFieldValue,
  imageRefs,
  style,
}) => {
  const customStyles = recipeCommonStyles();
  const { t } = useTranslation();

  const handleAddInputs = () => {
    setFieldValue("recipeProcessItems", [
      ...values,
      { image: null, contents: "", isServerImgVisible: false },
    ]);
  };

  const handleDeleteInputs = (delIndex: number) => {
    if (values.length <= 1) {
      alert(t("recipe.error.ingredient_min_cnt"));
      return;
    }
    setFieldValue(
      "recipeProcessItems",
      values.filter((_, index) => index !== delIndex)
    );
  };
  const handleImageChange = (index: number, file: File | null) => {
    setFieldValue(
      "recipeProcessItems",
      values.map((item, idx) =>
        idx === index
          ? { ...item, image: file, isServerImgVisible: false }
          : item
      )
    );
  };

  const handleRemoveImage = (index: number) => {
    setFieldValue(
      "recipeProcessItems",
      values.map((item, idx) =>
        idx === index
          ? { ...item, image: null, isServerImgVisible: false }
          : item
      )
    );
  };

  return (
    <Box sx={{ padding: 2 }}>
      {values.map((input, index) => {
        const indexStr = index.toString();
        // errors와 touched 상태 가져오기
        const hasErrorImage = errors[index] && errors[index].image;
        const isTouchedImage = touched[`${indexStr}.contents`];
        const hasErrorContents = errors[index] && errors[index].contents;
        const isTouchedContetns = touched[`${indexStr}.contents`];

        return (
          <Grid
            container
            spacing={2}
            key={index}
            sx={{
              ...customStyles.resetMuiGrid,
              "& > .MuiGrid-item": {
                borderColor: "divider",
                padding: "0 5px",
              },
              margin: "10px 0",
            }}
          >
            <Grid item xs={12} sm={3} marginBottom={"10px"}>
              <RecipeImageUpload
                id={"recipe_process_image_" + index}
                name={"recipe_process_image"}
                image={input.image}
                serverImage={input.memberRecipeImages}
                onImageChange={(file) => handleImageChange(index, file)}
                onRemoveImage={() => handleRemoveImage(index)}
                isServerImgVisible={
                  input.isServerImgVisible
                    ? input.isServerImgVisible
                    : input.memberRecipeImages
                    ? true
                    : false
                }
                ref={(el) => {
                  imageRefs.current && (imageRefs.current[index] = el);
                }} // 이미지 입력 필드를 부모에서 참조할 수 있도록 설정
                style={style}
              />

              {hasErrorImage && isTouchedImage && (
                <FormHelperText error>
                  {t("recipe.error.processImage")}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={9}>
              <Grid
                sx={{
                  display: "grid",
                  gap: "16px",
                  gridTemplateColumns: "1fr 40px",
                  alignItems: "center",
                }}
              >
                <Grid>
                  <FormControl className="width-max">
                    <InputLabel htmlFor={`recipe_process_contents_${index}`}>
                      {t("text.recipe_process_contents")}
                    </InputLabel>
                    <OutlinedInput
                      id={`recipe_process_contents_${index}`}
                      name={`recipeProcessItems[${index}].contents`}
                      label={t("text.recipe_process_contents")}
                      multiline
                      rows={5}
                      value={input.contents}
                      onChange={(e) =>
                        setFieldValue(
                          `recipeProcessItems[${index}].contents`,
                          e.target.value
                        )
                      }
                    />
                    {hasErrorContents && isTouchedContetns && (
                      <FormHelperText error>
                        {t("recipe.error.contents")}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid>
                  <Button
                    variant="text"
                    onClick={() => handleDeleteInputs(index)}
                    className="del-btn"
                    color="primary"
                    aria-label="delete"
                  >
                    <Delete />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
      <Box textAlign={"center"}>
        <Button
          variant="text"
          onClick={handleAddInputs}
          className="add-btn"
          color="primary"
          aria-label="add"
        >
          <Add
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "50%",
              marginRight: "5px",
              "&:hover": {
                backgroundColor: "primary.main",
              },
              fontSize: "medium",
            }}
          />
          {t("text.add")}
        </Button>
      </Box>
    </Box>
  );
};
export default RecipeProcessListInput;
