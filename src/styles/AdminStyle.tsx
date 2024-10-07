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

