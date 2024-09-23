import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import media from "./MediaQuery";
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
  border-radius: 8px 8px 0 0;
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

  .thumbnail-box-wrap {
    width: 100%;
    border: 1px solid ${(props) => props.theme.navBorderColor};
    border-radius: 8px 8px 0 0;
    box-shadow: 0 4px 8px #cccccc4d;
  }
  .thumbnail-info-box-wrap {
    width: 100%;
    background: #ffffff;
    overflow: auto;
    text-align: left;
  }
  .thumbnail-info-title-box {
    font-size: 18px;
    font-weight: 600;
    color: ${(props) => props.theme.mainColor};
  }
  .thumbnail-info-default-box {
    align-items: center;
    justify-content: space-between;
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

export const RecepiImgBoxContainer = styled.div`
  width: 100%;
  padding-top: 60%;
  position: relative;
  overflow: hidden;
`;
export const RecepiImgBox = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
      width: 100%;
      aspect-ratio: 3 / 2;
      position: relative;
    }
    .recipe-info-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      position: absolute;
      top: 0;
      left: 0;
    }
    .recipe-title {
      font-size: 24px;
    }

    .recipe-defalt-info-container {
      justify-content: space-between;
      align-items: center;
      color: ${(props) => props.theme.subTextColorGray};
    }

    .recipe-eval-info {
      display: inline-block;

      vertical-align: middle;
      color: ${(props) => props.theme.mainColor};
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
  .pagination {
    margin: 15px;
    .pagination-btn {
      margin: 0 auto;
    }
  }
`;

export const PublicRecipeView = styled.div`
  .recipe-info-container {
    .recipe-info-img-container {
      width: 100%;
      aspect-ratio: 3 / 2;
      position: relative;
    }
    .recipe-info-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      position: absolute;
      top: 0;
      left: 0;
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

export const IngredientGrid = styled(Grid)`
  border-left: 1px solid;
  border-color: ${(props) => props.theme.navBorderColor};

  div {
    div {
      border-bottom: 1px solid;
      border-right: 1px solid;
      border-color: ${(props) => props.theme.navBorderColor};
      padding: 5px;
    }
  }

  div:first-child,
  div:nth-child(2) {
    div {
      border-top: 1px solid;
      border-color: ${(props) => props.theme.navBorderColor};
    }
  }
  div:nth-child(2) {
    div {
      ${media["extra-medium"]`
        border-top: none;
      `};
    }
  }
`;

export const MemberRecipeWirteForm = styled.div`
  text-align: left;
  margin: 20px 0;
  .width-max {
    width: 100%;
  }
  .display-inline {
    display: inline-block;
  }
  .add-btn {
    margin-right: 10px;
    transform: scale(1.2);
  }
  .recipe-btn-wrap {
    justify-content: space-between;
  }
  .recipe-form {
    margin: 20px 0;
  }
`;
