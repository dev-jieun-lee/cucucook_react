import { Button } from "@mui/material";
import styled from "styled-components";

export const SearchArea = styled.div`
  /* margin: 30px ; */
  margin-top: 40px;
  margin-bottom: 25px;
  .select-category{
    width: 130px;
    margin-right: 50px;
  }
  .select-category-item{
    width: 180px;
    margin-right: 50px;
  }
  .search-input{
    width: 350px;
  }
`;

export const ContentsArea = styled.div`
  margin: 20px auto;
  margin-bottom: 100px;;
  width: 100%;
  .accordion{
    background : none;
    box-shadow: none;
    border-radius: 0;
    margin: 0;
    border-bottom: 1px solid;
      border-color: ${(props) => props.theme.navBorderColor};
    &:first-child{
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
      .title, .q{
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

  .detail{
    background-color: ${(props) => props.theme.accordionColor};
    text-align: start;
    padding: 20px 60px;
    .btn-area{
      text-align: right;
      .update-btn{
        margin-right: 10px;
      }
    }
  }

  .table-container{
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    box-shadow: none;
    background: none;
    .head{
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
    .row{
      text-align: center;
      &:hover{
        cursor: pointer;
        background-color: #cccccc10;
      }
    }
    .file-icon{
      transform: scale(0.7);
      color: ${(props) => props.theme.mainColor};
    }
  }
  .pagination{
    margin: 15px;
    .pagination-btn{
      margin: 0 auto;
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

  .title-area{
    .category{
      display: inline-block;
      margin-right: 30px;
      width: 130px;
      text-align: center;
    }
    .q{
      font-weight: bold;
      margin-right: 10px;
    }
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
  border-color:  ${(props) => props.theme.navBorderColor};
  padding: 0 15px 0;
  align-items: center;
  justify-content: space-between;
  .board-info{
    color: ${(props) => props.theme.navBorderColor};
    font-size: 14px;
    .border{
      border-right: 1px solid;
      margin: 0 10px
    }
    .view-icon{
      transform: scale(0.7);
    }
    .hit{
      margin-right: 5px;
    }
  }
`;
export const DetailContents = styled.div`
  width: 100%;
  flex-grow: 1; 
  margin: 0 auto;
  margin-bottom: 20px;
  padding: 20px 15px;
  min-height: 200px;
  height: 100%;
  border-bottom: 1px solid;
  border-color:  ${(props) => props.theme.navBorderColor};
  .board-contents{
    float: left;
  }
`;

export const ParentBoardData = styled.div`
  width: 100%;
  .contents-area{
    width: 100%;
    margin: 0 auto;
    padding: 20px 15px;
    min-height: 350px;
    overflow-y: auto;
    margin-bottom: -40px;
    .board-contents{
      float: left;
    }
  }
`;
export const QnaContentsArea = styled.div`
  width: 100%;
  .board-contents{
    width: 100%;
    text-align: left;
    padding: 10px 20px;
    min-height: 300px;
    max-height: 500px;
    overflow: auto;
  }
  .btn-area{
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid;
    border-color:  ${(props) => props.theme.navBorderColor};
  }
`;

export const AnswerWrap = styled.div`
  margin-top: -100px;
`;


export const BoardButtonArea = styled.div`
  margin: 0 auto 80px;
  width: 100%;
  .update-btn, .save-btn{
    float: right;
  }
  .cancel-btn, .delete-btn{
    float: left;
  }
`;

export const TitleInputArea = styled.div`
  width: 100%;
  margin: 50px auto 20px;
  display: flex;
  justify-content: space-between;
  .category{
    width: 25%;
    .form-select{
      width: 100%;
    }
  }
  .title{
    width: 73%;
    .form-input{
      width: 100%;
    }
  }
`;
export const ContentsInputArea = styled.div`
  margin-bottom: 20px;
  width: 100%;
  /* margin: 0 auto 20px; */
  .q-contents{
    width: 100%;
    border: 1px solid;
    border-radius: 5px;
    text-align: left;
    padding: 0px 15px;
    margin-bottom: 20px;
    border-color: ${(props) => props.theme.navBorderColor};
    color: #8e8a8a;
  }
  .sub-title{
    text-align: left;
    right: 0;
    padding-bottom: 10px;
  }
  .answer-editor{
  }
`;

export const QuestionArea = styled.div`
  width: 100%;
  margin: 50px auto 20px;
  .q-title-area{
    display: flex;
    justify-content: space-between;
    .category{
      width: 25%;
      .form-select{
        width: 100%;
      }
    }
    .title{
      width: 73%;
      .form-input{
        width: 100%;
      }
    }
  }
  .q-contents{
    width: 100%;
    border: 1px solid;
    border-radius: 5px;
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


