import { Box, Button, ListItem } from "@mui/material";
import styled from "styled-components";
import media from "./MediaQuery";

export const ContentsArea = styled.div`
  margin: 20px auto;
  margin-bottom: 100px;
  width: 100%;
  .accordion {
    background: none;
    box-shadow: none;
    border-radius: 0;
    margin: 0;
    border-bottom: 1px solid;
    border-color: ${(props) => props.theme.navBorderColor};
    &:first-child {
      border-top: 1px solid;
      border-color: ${(props) => props.theme.navBorderColor};
    }
    /* &:last-child{
      border-bottom: 1px solid;
      border-color: ${(props) => props.theme.navBorderColor};
    } */
  }
  .summary {
    &:hover {
      .title,
      .q {
        color: ${(props) => props.theme.textColor};
        font-weight: 600;
      }
    }

    /* Accordion이 열렸을 때 적용되는 스타일 */
    &.Mui-expanded {
      color: ${(props) => props.theme.textColor};
      font-weight: 900;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: ${(props) => props.theme.navBorderColor};
      /* background-color: ${(props) => props.theme.footerColor}; */
    }
  }

  .detail {
    background-color: ${(props) => props.theme.accordionColor};
    text-align: start;
    padding: 20px 60px;
    ${media.medium`
      padding: 20px 20px;
    `};
    .btn-area {
      text-align: right;
      .update-btn {
        margin-right: 10px;
      }
    }
  }
  .table-container {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    box-shadow: none;
    background: none;
    .head {
      text-align: center;
      /* .no-cell{
        width: 20px;
      }
      .category-cell{
        width: 150px;
      }
      .title-cell{
        width: 50%;
        text-align: center;
        background-color: pink;
      } */
    }
    .row {
      text-align: center;
      &:hover {
        cursor: pointer;
        background-color: #cccccc10;
      }
    }
    .file-icon {
      transform: scale(0.7);
      color: ${(props) => props.theme.mainColor};
    }
  }
`;

export const BoardHeaderListItem = styled(ListItem)`
  width: 100%;
  border-bottom: 1px solid;
  border-top: 1px solid;
  height: 55px;
  text-align: center;
  border-color: ${(props) => props.theme.navBorderColor};
  .no {
    flex: 1;
  }
  .category {
    flex: 2;
    text-align: center;
    ${media.medium`
      display : none;
    `};
  }
  .title {
    flex: 4;
  }
  .writer {
    flex: 2;
  }
  .date {
    flex: 2;
    text-align: center;
    ${media.medium`
      display : none;
    `};
  }
  .view {
    flex: 1;
  }
  .answer {
    flex: 3;
    text-align: center;
  }
`;

export const BoardRowListItem = styled(ListItem)`
  width: 100%;
  border-bottom: 1px solid;
  height: 55px;
  border-color: ${(props) => props.theme.tableBorderColor};
  &:last-child {
    border-color: ${(props) => props.theme.navBorderColor};
  }
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.tableHoverColor};
  }
  .no {
    flex: 1;
    text-align: center;
    ${media.medium`
      font-size : 13px;
    `};
  }
  .category {
    flex: 2;
    text-align: center;
    ${media.medium`
      text-align: left;
      font-size : 13px;
    `};
  }
  .title {
    flex: 4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .title-area {
    display: flex;
    flex: 6;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 90%;
    ${media.medium`
      flex: 4;
      display : block;
    `};
  }
  .writer {
    flex: 2;
    text-align: center;
    ${media.medium`
      font-size : 13px;
    `};
  }
  .date {
    flex: 2;
    text-align: center;
    font-size: 13px;
    ${media.medium`
      display : none;
    `};
  }
  .view {
    flex: 1;
    text-align: center;
    ${media.medium`
      font-size : 13px;
    `};
  }
  .answer {
    flex: 3;
    text-align: center;
    align-items: center;
    .answer-icon {
      transform: scale(0.6);
      color: ${(props) => props.theme.mainColor};
      margin-right: 4px;
    }
  }
`;

export const AnswerContainer = styled.div`
  display: flex;
  align-items: center;
  .answer-icon {
    transform: scale(0.6);
    color: ${(props) => props.theme.mainColor};
    margin-right: 4px;
    margin-top: -4px;
  }
`;

export const AccordionTitle = styled.div`
  flex-direction: row;
  .title-area {
    display: flex;
    .category {
      display: inline-block;
      margin-right: 30px;
      width: 130px;
      text-align: center;
      ${media.medium`
        width: 100px;
        order : 1;
        text-align: left;
      `};
    }
    .q {
      font-weight: bold;
      margin-right: 10px;
    }
    .title {
      ${media.medium`
        order : 2;
      `};
    }
    ${media.medium`
      flex-direction: column;
      text-align : left;
      align-items: flex-start;
    `};
  }
`;

export const CustomCategory = styled.span`
  /* font-size: 15px; */
  /* font-weight: 600; */
  margin-right: 15px;
`;

export const TitleArea = styled.div`
  display: flex;
  margin: 50px auto 0;
  width: 100%;
  min-height: 60px;
  max-height: 60px;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: ${(props) => props.theme.navBorderColor};
  padding: 0 15px 0;
  align-items: center;
  justify-content: space-between;
  ${media.medium`
    display: block;
    min-height: 100px;
    max-height: 100px;
  `};
  .board-title {
    display: flex;
    align-items: center;
    ${media.medium`
      display : block;
      text-align: left;
      line-height : 7px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-top : 15px;
      /* margin-top : 19px;  */
    `};
  }
  .board-info {
    display: flex;
    color: ${(props) => props.theme.navBorderColor};
    font-size: 14px;
    ${media.medium`
      display : block;
      font-size : 12px;
      text-align: left;
      line-height : 15px;
    `};
    .m-border {
      display: none;
    }
    .border {
      border-right: 1px solid;
      margin: 0 10px;
    }
    .view-icon {
      transform: scale(0.7);
    }
    .hit {
      margin-right: 5px;
    }
  }
`;

export const TitleAreaAnswer = styled.div`
  display: flex;
  margin: 50px auto 0;
  width: 100%;
  min-height: 60px;
  max-height: 60px;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: ${(props) => props.theme.navBorderColor};
  padding: 0 15px 0;
  align-items: center;
  justify-content: space-between;
  .board-info {
    display: flex;
    color: ${(props) => props.theme.navBorderColor};
    font-size: 14px;
    ${media.medium`
      display : block;
      font-size : 12px;
      text-align: left;
      line-height : 15px;
    `};
    .m-border {
      display: none;
    }
    .border {
      border-right: 1px solid;
      margin: 0 10px;
    }
    .view-icon {
      transform: scale(0.7);
    }
    .hit {
      margin-right: 5px;
    }
  }
`;

export const DetailContents = styled.div`
  width: 100%;
  /* flex-grow: 1;  */
  min-height: 560px;
  margin: 0 auto;
  margin-bottom: 20px;
  padding: 20px 15px;
  border-bottom: 1px solid;
  border-color: ${(props) => props.theme.navBorderColor};
  .board-contents {
    float: left;
  }
`;

export const ParentBoardData = styled.div`
  width: 100%;
  .contents-area {
    width: 100%;
    margin: 0 auto;
    padding: 20px 15px;
    min-height: 350px;
    overflow-y: auto;
    margin-bottom: -40px;
    .board-contents {
      float: left;
    }
  }
`;
export const QnaContentsArea = styled.div`
  width: 100%;
  .board-contents {
    width: 100%;
    text-align: left;
    padding: 10px 20px;
    min-height: 300px;
    max-height: 500px;
    overflow: auto;
  }
  .btn-area {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid;
    border-color: ${(props) => props.theme.navBorderColor};
  }
`;

export const AnswerWrap = styled.div`
  margin-top: -100px;
`;

export const BoardButtonArea = styled.div`
  margin: 0 auto 80px;
  width: 100%;
  .update-btn,
  .save-btn {
    float: right;
  }
  .cancel-btn,
  .delete-btn {
    float: left;
  }
`;

export const TitleInputArea = styled.div`
  width: 100%;
  margin: 50px auto 20px;
  display: flex;
  justify-content: space-between;
  .category {
    width: 25%;
    .form-select {
      width: 100%;
    }
  }
  .title {
    width: 73%;
    .form-input {
      width: 100%;
    }
  }
`;
export const ContentsInputArea = styled.div`
  margin-bottom: 20px;
  width: 100%;
  /* margin: 0 auto 20px; */
  .q-contents {
    width: 100%;
    border: 1px solid;
    border-radius: 5px;
    text-align: left;
    padding: 0px 15px;
    margin-bottom: 20px;
    border-color: ${(props) => props.theme.navBorderColor};
    color: #8e8a8a;
  }
  .sub-title {
    text-align: left;
    right: 0;
    padding-bottom: 10px;
  }
  .answer-editor {
  }
`;

export const QuestionArea = styled.div`
  width: 100%;
  margin: 50px auto 20px;
  .q-title-area {
    display: flex;
    justify-content: space-between;
    .category {
      width: 25%;
      .form-select {
        width: 100%;
      }
    }
    .title {
      width: 73%;
      .form-input {
        width: 100%;
      }
    }
  }
  .q-contents {
    width: 100%;
    border: 1px solid;
    border-radius: 5px;/
    text-align: left;
    padding: 0px 15px;
    border-color: ${(props) => props.theme.navBorderColor};
    color: #535252;
    margin-top: 20px;
  }
`;

export const AnswerButton = styled(Button)`
  margin-right: -15px;
`;

export const FileInput = styled.input`
  display: none;
`;

export const UploadBoxContainer = styled(Box)`
  .upload-box {
    border: 1px solid ${(props) => props.theme.navBorderColor};
    border-radius: 8px;
    width: 100%;
    height: 200px;
    overflow-x: hidden;
    overflow-y: auto;

    &.isDrag {
      border: 1px solid ${(props) => props.theme.mainColor};
      background: ${(props) => props.theme.mainColorOpacity10};
    }

    &:has(.file-upload-box) {
      border-style: dashed;
    }

    &:has(.file-upload-box-wrap):hover {
      border: 1px solid ${(props) => props.theme.mainColor};
      background: ${(props) => props.theme.mainColorOpacity10};
      color: ${(props) => props.theme.mainColor};
    }

    .file-list-box {
      width: 100%;
      .css-cveggr-MuiListItemIcon-root {
        min-width: auto;
      }
      .file-list {
        background: transparent;
        padding-top: 0;
        padding-bottom: 0;
        border-bottom: 1px solid ${(props) => props.theme.navBorderColor};
        position: relative;

        &:last-child {
          border-bottom: none;
          &::after {
            content: "";
            display: block;
            height: 10px;
            border-top: 1px solid ${(props) => props.theme.navBorderColor};
          }
        }

        .MuiTypography-root {
          font-size: 0.9rem;
        }

        .file-list-item {
          gap: 10px;
          .delete-icon-wrap {
          }
          .attach-icon-wrap {
          }
          .list-item-text {
          }
        }
      }
    }
    .file-upload-box-wrap {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 0 10px;

      .file-upload-box {
        .file-upload-icon-wrap {
        }
        .file-upload-info-wrap {
          .file-upload-info {
          }
          .file-upload-allowed-extensions {
            font-size: 0.8rem;
          }
        }
      }
    }
  }
`;

export const BoardFilesListContainer = styled(Box)`
  border: 1px solid ${(props) => props.theme.navBorderColor};
  border-radius: 8px;
  width: 100%;
  height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 20px 0;

  .file-list-box {
    width: 100%;
    .css-cveggr-MuiListItemIcon-root {
      min-width: auto;
    }
    .file-list {
      cursor: pointer;
      &:hover {
        color: ${(props) => props.theme.mainColor};
        background: ${(props) => props.theme.mainColorOpacity10};
      }
      background: transparent;
      padding-top: 0;
      padding-bottom: 0;
      border-bottom: 1px solid ${(props) => props.theme.navBorderColor};
      position: relative;

      &:last-child {
        //border-bottom: none;
      }

      .MuiTypography-root {
        font-size: 0.9rem;
      }

      .file-list-item {
        gap: 10px;
        .delete-icon-wrap {
        }
        .attach-icon-wrap {
        }
        .list-item-text {
        }
      }
    }
  }
`;
