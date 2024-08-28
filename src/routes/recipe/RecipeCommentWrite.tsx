import React, { useState, ChangeEvent } from "react";
import { Box, Button, Grid, Rating, TextField } from "@mui/material";
import { PageSubTitleBasic } from "../../styles/CommonStyles";
import { useTranslation } from "react-i18next";
import { recipeCommonStyles } from "../../styles/RecipeStyle";
import { RecipeCommentWrite } from "../../styles/RecipeStyle";

const customStyles = recipeCommonStyles();

const RecipeCommentWriteBox: React.FC = () => {
  const { t } = useTranslation();
  const [comments, setComments] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [value, setValue] = useState<number | null>(0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleAddComment = () => {
    if (input.trim()) {
      setComments([...comments, input]);
      setInput("");
    }
  };

  return (
    <RecipeCommentWrite>
      <Box paddingBottom={2}>
        <PageSubTitleBasic>{t("text.comment")}(10)</PageSubTitleBasic>
      </Box>
      <Box className="comment-wirte-container">
        <Grid
          container
          spacing={2}
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "40px 1fr",
            "& > .MuiGrid-item": {
              padding: 0,
              margin: 0,
              width: 100,
            },
            ...customStyles.resetMuiGrid,
            paddingBottom: "10px",
          }}
        >
          <Grid sx={{ textAlign: "center" }}>{t("text.rate")}</Grid>
          <Grid>
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "40px 1fr",
            "& > .MuiGrid-item": {
              padding: 0,
              margin: 0,
              width: 100,
            },
            ...customStyles.resetMuiGrid,
          }}
        >
          <Grid sx={{ textAlign: "center" }}>{t("text.comment")}</Grid>
          <Grid>
            <TextField
              label={t("text.comment")}
              multiline
              rows={3} // 텍스트 영역의 초기 높이 설정
              variant="outlined" // 외곽선이 있는 스타일
              fullWidth // 가로로 전체 너비를 차지
              value={input}
              onChange={handleInputChange}
            />
            <Box marginTop={2} className="right-button">
              <Button variant="contained" onClick={handleAddComment}>
                {t("text.comment_write")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </RecipeCommentWrite>
  );
};

export default RecipeCommentWriteBox;
