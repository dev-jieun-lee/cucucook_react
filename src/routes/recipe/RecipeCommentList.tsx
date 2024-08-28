import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  Grid,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { PageSubTitleBasic } from "../../styles/CommonStyles";
import { useTranslation } from "react-i18next";
import {
  CommentIconButton,
  recipeCommonStyles,
} from "../../styles/RecipeStyle";
import { RecipeCommentList } from "../../styles/RecipeStyle";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import { useTheme } from "styled-components";

const customStyles = recipeCommonStyles();

const RecipeCommentListBox: React.FC = () => {
  const theme = useTheme();
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
    <RecipeCommentList>
      <Box className="comment-list-container">
        <Box className="comment-container">
          <Box paddingBottom={2} className="comment-content-container-parents">
            <Grid
              container
              spacing={2}
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "1fr 100px",
                "& > .MuiGrid-item": {
                  padding: 0,
                  margin: 0,
                },
                ...customStyles.resetMuiGrid,
                paddingBottom: "10px",
              }}
            >
              <Grid item className="comment-content">
                <Box className="comment-info">
                  <Typography
                    className="comment-info-name"
                    component="span"
                    variant="subtitle1"
                  >
                    이름
                  </Typography>
                  <Typography
                    className="comment-info-dt"
                    component="span"
                    variant="subtitle2"
                  >
                    2024.07.25 15:32
                  </Typography>
                </Box>
                <Box> 내용입니당아아아아앙</Box>
              </Grid>
              <Grid item className="comment-icons">
                <CommentIconButton aria-label="reply">
                  <ReplyIcon sx={{ transform: "rotate(180deg)" }} />
                </CommentIconButton>
                <CommentIconButton aria-label="edit">
                  <EditIcon />
                </CommentIconButton>
                <CommentIconButton aria-label="delete">
                  <ClearIcon />
                </CommentIconButton>
              </Grid>
            </Grid>
          </Box>
          <Box className="comment-content-container-child">
            <Grid
              container
              spacing={2}
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "30px 1fr 100px",
                "& > .MuiGrid-item": {
                  padding: 0,
                  margin: 0,
                },
                ...customStyles.resetMuiGrid,
                paddingBottom: "10px",
              }}
            >
              <Grid>
                <SubdirectoryArrowRightIcon
                  fontSize="medium"
                  sx={{ color: theme.mainColor }}
                />
              </Grid>
              <Grid item className="comment-content">
                <Box className="comment-info">
                  <Typography
                    className="comment-info-name"
                    component="span"
                    variant="subtitle1"
                  >
                    이름
                  </Typography>
                  <Typography
                    className="comment-info-dt"
                    component="span"
                    variant="subtitle2"
                  >
                    2024.07.25 15:32
                  </Typography>
                </Box>
                <Box> 내용입니당아아아아앙</Box>
              </Grid>
              <Grid item className="comment-icons">
                <CommentIconButton aria-label="reply">
                  <ReplyIcon sx={{ transform: "rotate(180deg)" }} />
                </CommentIconButton>
                <CommentIconButton aria-label="edit">
                  <EditIcon />
                </CommentIconButton>
                <CommentIconButton aria-label="delete">
                  <ClearIcon />
                </CommentIconButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </RecipeCommentList>
  );
};

export default RecipeCommentListBox;
