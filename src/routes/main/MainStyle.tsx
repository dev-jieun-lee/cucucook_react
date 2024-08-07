import { Button, Card } from "@mui/material";
import styled from "styled-components";

export const MainWrapper = styled.div`
`;

export const Banner = styled.div<{ isDarkMode: boolean }>`
  .main-banner {
    width: 100%;
    height: 600px;
  }
  width: 100%;
  height: 750px;
  background-image: ${({ isDarkMode }) =>
    isDarkMode
      ? "url('/image/banner_img_dark.png')"
      : "url('/image/banner_img_light.png')"};
  background-size: cover;
  display: flex;
`;

export const BannerLeft = styled.div`
  width: 100%;
  .card-area{
    display: flex;
    padding: 250px 15px 0;
  }
`;
export const BannerRight = styled.div`
  display: flex;
  flex-direction: column;  /* 요소들을 세로로 배치 */
  align-items: flex-end;   /* 요소들을 오른쪽으로 정렬 */
  width: 100%;
  padding-top: 250px;
  padding-right: 50px;
`;

export const MainCard = styled.div`
  width: 190px;
  height: 200px;
  border: 2px solid;
  border-radius: 15px;
  border-color: ${(props) => props.theme.mainColor};
  text-align: center;
  margin: 0 17px;
  img{
    width: 80px;
    margin: 20px 0;
  }
`;

export const BannerButton = styled(Button)`
  border-radius: 15px;
`;


export const Slogan1 = styled.div`
  margin: 10px 45px;
  color: ${(props) => props.theme.mainColor};
`;

export const Slogan2 = styled.div`
  display: flex;
  flex-direction: column; /* 각 문구를 세로로 배치 */
  align-items: flex-end;  /* 문구들을 오른쪽으로 정렬 */
  margin-bottom: 20px;    
  
  .box1, .box2, .box3 {
    font-family: 'ONE-Mobile-POP';
    display: flex;
    flex-direction: row;
    justify-content: flex-end; /* 각 박스 안의 텍스트를 오른쪽으로 정렬 */
  }
  
  .strong{
    font-size: 40px;
    font-weight: 600;
    color: ${(props) => props.theme.textColor};
  }
  .basic{
    margin-left: 10px;
    margin-top: 15px;
    font-size: 25px;
    font-weight: 600;
    color :${(props) => props.theme.subTextColor};
  }
`;

export const RecipeWrapper = styled.div``;