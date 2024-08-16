import { Button, Card } from "@mui/material";
import styled from "styled-components";
import media from "../../styles/MediaQuery";

export const MainWrapper = styled.div`
`;

export const Banner = styled(({ isDarkMode, ...rest } : any) => (
  <div {...rest} />
))<{ isDarkMode: boolean }>`
  width: 100%;
  height: 850px;
  background-image: ${({ isDarkMode }) =>
    isDarkMode
      ? "url('/image/banner_middle_dark.png')"
      : "url('/image/banner_middle_light.png')"};
  background-size: cover;
  background-position: center;
  display: flex;

  ${media.medium`
    height : 750px;
  `};
  ${media.small`
    height : 600px;
  `};

`;


export const CustomBtn = styled(Button)`
  border-radius: 20px;
`;


export const BannerLeft = styled.div`
  width: 63%;
  display: flex;
  flex-direction: column;
  .card-area{
    order: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 250px 8% 0;
    ${media.medium`
      order: 2;
      padding: 0px 8% 0;
    `};
    ${media.small`
      display: block;
    `};
  }
  .slogan-main{
    display: none;
    ${media.medium`
      display : block;
      order : 3;
  `};
  }
  ${media.medium`
    width : 100%;
    padding : 0px -20px;
  `};

`;
export const BannerRight = styled.div`
  background-color: ${(props) => props.theme.mainColor};
  display: flex;
  flex-direction: column;  /* 요소들을 세로로 배치 */
  align-items: flex-end;   /* 요소들을 오른쪽으로 정렬 */
  width: 37%;
  padding-top: 250px;
  padding-right: 3%;

  ${media.medium`
    width : 0;
    display : none;
  `};
`;

export const MainCard = styled.div`
  width: 30%;
  height: 250px;
  border: 2px solid;
  border-radius: 15px;
  border-color: ${(props) => props.theme.mainColor};
  text-align: center;
  /* margin: 0 25px; */
  img{
    width: 100px;
    margin: 30px 0;
    ${media.small`
      width : 90px;
      margin: 10px;
  `};
  }
  
  ${media.small`
    width: 100%;
    height: 120px;
    margin-bottom : 20px;
    display : flex;
    justify-content: space-between;
    padding : 0 5%;
  `};
`;

export const BannerButton = styled(Button)`
  border-radius: 15px;
  width: 150px;
  height: 40px;
  font-size: 17px;
    
  ${media.small`
    width : 130px;
    font-size: 15px;    
    top: 50%;
    transform: translate(0, -50%)

  `};
`;


export const Slogan1 = styled.div`
  margin: 10px 8% ;
  color: ${(props) => props.theme.mainColor};
  order: 2;
  ${media.medium`
    order: 1;
    margin: 50px 8% 20px;
  `};
  ${media.small`
    margin-top : 10px;
    font-size : 12px
  `};
`;

export const Slogan2 = styled.div`
  margin-bottom: 20px;    
  
  .box1, .box2, .box3 {
    font-family: 'ONE-Mobile-POP';
    display: flex;
    flex-direction: row;
    justify-content: flex-end; /* 각 박스 안의 텍스트를 오른쪽으로 정렬 */

  }
  .box1{
    ${media.small`
      display : none;
    `};
  }
  .box2{
    ${media.small`
      display : none;
    `};
  }
  .box3{
    ${media.small`
      display : none;
    `};
  }
  .medium-box{
    display: none;
    font-family: 'ONE-Mobile-POP';
    ${media.small`
      display : block;
    `};
    
  }
  
  .strong{
    font-size: 3rem;
    font-weight: 600;
    color: ${(props) => props.theme.textColor};

    ${media.medium`
      font-size: 2.5rem;
    `};

    ${media.small`
      font-size: 1.5rem;
    `};
  }
  .basic{
    margin-left: 10px;
    margin-top: 15px;
    font-size: 2rem;
    font-weight: 600;
    color :${(props) => props.theme.subTextColor};

    ${media.medium`
      font-size: 1.5rem;
    `};
    
    ${media.small`
      font-size: 1rem;
    `};
  }

  ${media.medium`
    margin: 30px 8% 10px;    
  `};

  ${media.small`
    margin: 0px 8% ; 
  `};
`;

export const SloganButton = styled(Button)`
  width: 180px;
  height: 50px;
  font-size: 20px;
  font-weight: 600;

  ${media.medium`
    width: 150px;
    height: 40px;
    font-size: 15px;
    font-weight: 600; 
    float : right;  
    margin : 0 8%;
  `};

  ${media.small`
    display : none;
  `};
`;