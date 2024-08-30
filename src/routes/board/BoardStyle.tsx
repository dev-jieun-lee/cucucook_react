import styled from "styled-components";

export const SearchArea = styled.div`
  margin: 50px;
  .select-category, .select-category-item{
    width: 130px;
    margin-right: 50px;
  }
  .search-input{
    width: 350px;
  }
`;

export const ContentsArea = styled.div`
  margin: 20px auto;
  margin-bottom: 100px;;
  width: 80%;
  .accordion{
    background : none;
    box-shadow: none;
    border-radius: 0;
    margin: 0;
    &:first-child{
      border-top: 1px solid;
      border-color: ${(props) => props.theme.navBorderColor};
    }
    &:last-child{
      border-bottom: 1px solid;
      border-color: ${(props) => props.theme.navBorderColor};
    }
  }
  .summary {
    &:hover {
      .title{
        font-weight: 600;
      }

    }

    /* Accordion이 열렸을 때 적용되는 스타일 */
    &.Mui-expanded {
      font-weight: 900;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: ${(props) => props.theme.navBorderColor};
      /* background-color: ${(props) => props.theme.footerColor}; */
    }
  }

  .detail{
    /* background-color: ${(props) => props.theme.accordionColor}; */
    text-align: start;
    padding: 20px 30px;
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

export const AccordionTitle = styled.div`
  flex-direction: row;

  .title-area{
    order: 1;
    margin-bottom: 5px;
    .category{
      display: inline-block;
      width: 130px;
      text-align: left;
    }
    .q{
      font-weight: bold;
      margin-right: 10px;
    }
    .title{
      font-size: 16px;
    }
  }
  .info{
    order: 2;
    font-size: 13px;
    color: ${(props) => props.theme.navBorderColor};
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

export const CustomCategory = styled.span`
  /* font-size: 15px; */
  /* font-weight: 600; */
  margin-right: 15px;
`;

export const TitleArea = styled.div`
  display: flex;
  margin: 50px auto 0;
  width: 80%;
  height: 60px;
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
  width: 80%;
  margin: 0 auto;
  margin-bottom: 20px;
  padding: 20px 15px;
  min-height: 500px;
  border-bottom: 1px solid;
  border-color:  ${(props) => props.theme.navBorderColor};
  .board-contents{
    float: left;

  }
`;

export const BoardButtonArea = styled.div`
  margin: 0 auto 80px;
  width: 80%;
  .update-btn, .save-btn{
    float: right;
  }
  .cancel-btn, .delete-btn{
    float: left;
  }
`;

export const TitleInputArea = styled.div`
  width: 81%;
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
  width: 81%;
  margin: 0 auto 20px;
`;

