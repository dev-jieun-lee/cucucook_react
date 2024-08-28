import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
export const RecipeWrapper = styled.div``;
export const TitleBox = styled(Box)`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;
export const ContentsGrid = styled(Grid)``;

export const ThumbnailBoxContainer = styled.div`
  width: 100%;
  padding-top: 60%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;
export const ThumbnailBox = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
export const ThumbnailButton = styled(Button)`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 0;
  color: ${(props) => props.theme.textColor};
  &:hover {
    color: ${(props) => props.theme.mainColor};
  }
`;

export const ThumbnailTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  margin: 10px 0;
`;

export const SearchBoxContainer = styled(Box)`
  margin: 20px 0;
  text-align: -webkit-center;
`;
export const SearchBox = styled(Box)`
  display: flex;
  margin: 20px 0;
  justify-content: center;
`;

export const SearchTextField = styled(TextField)`
  flex-grow: 1;
  & .MuiOutlinedInput-root {
    & fieldset {
      border: none;
      border-bottom: 1px solid ${(props) => props.theme.mainColor};
      border-radius: 0;
    }
    &:hover fieldset {
      border: none;
      border-bottom: 1px solid ${(props) => props.theme.mainColor};
      border-radius: 0;
    }
    &.Mui-focused fieldset {
      border: none;
      border-bottom: 1px solid ${(props) => props.theme.mainColor};
      border-radius: 0;
    }
  }
`;

export const recipeCommonStyles = () => ({
  resetMuiGrid: {
    margin: 0,
    padding: 0,
    width: "100%",
  },
});

export const MemberRecipeView = styled.div`
  .recipe-info-container {
    .recipe-info-img-container {
      width: 200px;
      height: auto;
    }
    .recipe-info-grid-title {
      background-color: ${(props) => props.theme.mainColor};
      padding: 10px;
      color: ${(props) => props.theme.textColorWhite};
    }
    .recipe-info-grid-text {
      padding: 10px;
      text-align: left;
    }
  }

  .recipe-description-grid-container {
    .recipe-description-grid-img-container {
    }
    .recipe-description-grid-text-container {
      text-align: left;
    }
  }
`;

export const PublicRecipeView = styled.div`
  .recipe-info-container {
    .recipe-info-img-container {
      width: 200px;
      height: auto;
    }
    .recipe-info-grid-title {
      background-color: ${(props) => props.theme.mainColor};
      padding: 10px;
      color: ${(props) => props.theme.textColorWhite};
    }
    .recipe-info-grid-text {
      padding: 10px;
      text-align: left;
    }
  }

  .recipe-description-grid-container {
    .recipe-description-grid-img-container {
    }
    .recipe-description-grid-text-container {
      text-align: left;
    }
  }
`;

export const RecipeCommentWrite = styled.div`
  text-align: left;
  .comment-wirte-container {
    border: 1px solid ${(props) => props.theme.searchBorderColor};
    border-radius: 4px;
    padding: 20px;
  }
  .right-button {
    text-align: right;
  }
`;

export const RecipeCommentList = styled.div`
  text-align: left;
  .comment-wirte-container {
    border: 1px solid ${(props) => props.theme.searchBorderColor};
    border-radius: 4px;
    padding: 20px;
  }
  .right-button {
    text-align: right;
  }
  .comment-list-container {
    .comment-container {
      .MuiGrid-root {
        align-items: center;
      }
    }
    .comment-content {
      .comment-info {
        .comment-info-name {
          margin-right: 10px;
          font-weight: 600;
        }
        .comment-info-dt {
          color: ${(props) => props.theme.subTextColorGray};
        }
      }
    }
  }
`;

export const CommentIconButton = styled(IconButton)`
  padding: 0;
  margin-left: 5px;
  color: ${(props) => props.theme.mainColor};
`;
