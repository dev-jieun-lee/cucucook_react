import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { recipeCommonStyles } from "./RecipeStyle";

interface Ingredient {
  name: string;
  amount: string;
}

interface RecipeIngredientInputListProps {
  values: Ingredient[]; // Formik에서 값을 직접 받아옴
  errors: Array<{ name?: string; amount?: string }>;
  touched: Array<{ name?: boolean; amount?: boolean }>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

const RecpieIngredientInputList: React.FC<RecipeIngredientInputListProps> = ({
  values,
  errors,
  touched,
  setFieldValue,
}) => {
  const customStyles = recipeCommonStyles();
  const { t } = useTranslation();

  const handleAddInputs = () => {
    setFieldValue("recipeIngredients", [...values, { name: "", amount: "" }]);
  };

  const handleDeleteInputs = (delIndex: number) => {
    if (values.length <= 1) {
      alert(t("recipe.error.ingredient_min_cnt"));
      return;
    }
    setFieldValue(
      "recipeIngredients",
      values.filter((_, index) => index !== delIndex)
    );
  };
  return (
    <Box sx={{ padding: 2, display: "inline-block" }}>
      {values.map((input, index) => {
        const indexStr = index.toString();
        // errors와 touched 상태 가져오기
        const hasErrorName = errors[index] && errors[index].name;
        const isTouchedName = touched && touched[index]?.name;
        const hasErrorAmount = errors[index] && errors[index].amount;
        const isTouchedAmount = touched && touched[index]?.amount;
        return (
          <React.Fragment key={index}>
            <Grid
              container
              spacing={2}
              sx={{
                ...customStyles.resetMuiGrid,
                "& > .MuiGrid-item": {
                  borderColor: "divider",
                  padding: "0 5px",
                },
                margin: "10px 0",
                alignItems: "center",
              }}
            >
              <Grid item>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    ...customStyles.resetMuiGrid,
                    "& > .MuiGrid-item": {
                      borderColor: "divider",
                      padding: "0 5px",
                    },
                    alignItems: "top",
                  }}
                >
                  <Grid item>
                    <FormControl className="width-max">
                      <InputLabel htmlFor={`ingredient_name_${index}`} shrink>
                        {t("text.ingredient_name")}
                      </InputLabel>
                      <OutlinedInput
                        id={`ingredient_name_${index}`}
                        name={`recipeIngredients[${index}].name`}
                        label={t("text.ingredient_name")}
                        placeholder={t("recipe.example.ingredient_name")}
                        notched
                        value={input.name}
                        onChange={(e) =>
                          setFieldValue(
                            `recipeIngredients[${index}].name`,
                            e.target.value
                          )
                        }
                      />
                      {hasErrorName && isTouchedName && (
                        <FormHelperText error>
                          {t("recipe.error.ingredientName")}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl className="width-max">
                      <InputLabel htmlFor={`ingredient_amount_${index}`} shrink>
                        {t("text.ingredient_amount")}
                      </InputLabel>
                      <OutlinedInput
                        id={`ingredient_amount_${index}`}
                        name={`recipeIngredients[${index}].amount`}
                        label={t("text.ingredient_amount")}
                        placeholder={t("recipe.example.ingredient_amount")}
                        notched
                        value={input.amount}
                        onChange={(e) =>
                          setFieldValue(
                            `recipeIngredients[${index}].amount`,
                            e.target.value
                          )
                        }
                      />
                      {hasErrorAmount && isTouchedAmount && (
                        <FormHelperText error>
                          {t("recipe.error.ingredientAmount")}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
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
            <Box margin={"20px 0"}>
              <Divider />
            </Box>
          </React.Fragment>
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
              fontSize: "medium",
              "&:hover": {
                backgroundColor: "primary.main",
              },
            }}
          />
          {t("text.add")}
        </Button>
      </Box>
    </Box>
  );
};

export default RecpieIngredientInputList;
