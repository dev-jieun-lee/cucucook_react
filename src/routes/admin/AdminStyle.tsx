import { IconButton } from "@mui/material";
import styled from "styled-components";

export const ColorDots = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 100%;
`;

export const DeleteIconButton = styled(IconButton)`
  margin: -5px;
  width: 30px;
  height: 30px;
  .delete-icon{
    transform: scale(0.9);
  }
`;

export const DialogTitleArea = styled.div`
  display: flex;
  justify-content:space-between;
  align-items: center;
  .title{
    color: ${(props) => props.theme.mainColor};
    font-weight: 600;
  }
  .close-btn{
    height: 40px;
    margin: 15px;
  }
`;

export const DialogForm = styled.form`
  position: relative;
  .input-form{
    display: block;
    margin-bottom: 20px;
    &:first-child{
      margin-top: 15px;
    }
  }
`;