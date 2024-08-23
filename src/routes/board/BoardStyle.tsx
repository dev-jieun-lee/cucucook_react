import styled from "styled-components";

export const BoardWrapper = styled.div`
  /* text-align: center;
  margin: 0 auto; */
`;

export const SearchArea = styled.div`
  margin: 50px;
  .select-category{
    width: 130px;
    margin-right: 50px;
  }
  .search-input{
    width: 350px;
  }
`;

export const ContentsArea = styled.div`
  margin: 20px auto;
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
      /* background-color: ${(props) => props.theme.footerColor}; */
      font-weight: 600;
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
    .cell{

    }
    .file-icon{
      transform: scale(0.7);
      color: ${(props) => props.theme.mainColor};
    }
  }
`;

export const AccordionTitle = styled.div`
  flex-direction: row;

  .title-area{
    order: 1;
    margin-bottom: 5px;
    .category{
      font-size: 17px;
      font-weight: 600;
      color: ${(props) => props.theme.mainColor};
      margin-right: 15px;
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
  }
`;

