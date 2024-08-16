import { SxProps } from '@mui/material/styles';
import { CSSProperties } from 'react';

export const modalStyles: {
  overlay: CSSProperties;
  content: CSSProperties;
} = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경을 흐리게
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '500px',
    padding: '20px',
    borderRadius: '8px',
    background: '#fff',
  },
};

export const userInfoStyles: {
  container: CSSProperties;
  formControl: CSSProperties;
  button: CSSProperties;
} = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formControl: {
    marginBottom: '16px',
  },
  button: {
    marginBottom: '16px',
  },
};


export const sideMenuStyles: SxProps = {
  width: '250px', // 사이드 메뉴의 너비
  minHeight: '100vh', // 사이드 메뉴의 최소 높이
  display: 'flex',
  flexDirection: 'column',
  padding: 2,
  boxSizing: 'border-box',
  backgroundColor: '#f5f5f5', // 사이드 메뉴 배경색 (원하는 색상으로 변경 가능)
};
