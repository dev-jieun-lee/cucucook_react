import styled from "styled-components";

export const SubTitle = styled.div`
  margin-top: 50px;
  text-align: left;
  color: ${(props) => props.theme.textColor};
`;

export const PwInputArea = styled.div`
  width: 100%;
  margin-top: 20px;
  .form{
    width: 100%;
  }
`;

export const PwButtonArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;
