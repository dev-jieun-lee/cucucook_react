import { SxProps, Theme } from '@mui/material/styles';
import { CSSProperties } from 'react';

export const modalStyles: {
  overlay: CSSProperties;
  content: CSSProperties;
} = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경을 흐리게 처리
    zIndex: 1000, // 모달의 z-index를 높게 설정
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%', // 반응형: 작은 화면에서는 전체 너비의 90%
    maxWidth: '500px',
    padding: '20px',
    borderRadius: '8px',
    background: '#fff',
    zIndex: 1100, // 모달 내부 컨텐츠의 z-index 설정
  },
};

export const userInfoStyles: {
  container: SxProps;
  formControl: SxProps;
  button: SxProps;
} = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    '@media (max-width: 600px)': {
      padding: '10px',
      maxWidth: '100%',
    },
  },
  formControl: {
    marginBottom: '16px',
    '@media (max-width: 600px)': {
      marginBottom: '12px',
    },
  },
  button: {
    marginBottom: '16px',
    '@media (max-width: 600px)': {
      marginBottom: '12px',
    },
  },
};
export const activityStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    width: '100%',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
    },
  },
  content: {
    flexGrow: 1,
    padding: '20px',
    '@media (max-width: 600px)': {
      padding: '10px',
    },
  },
  section: {
    flex: 1,
    padding: '16px',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '8px',
    margin: '8px',
    '@media (max-width: 600px)': {
      margin: '4px',
      padding: '10px',
    },
  },
  welcomeBox: {
    textAlign: 'center',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 1,
  },
  statsBox: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 1,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  statIcon: {
    width: '48px',
    height: '48px',
  },
};


export const myPageGridStyles: Record<string, SxProps<Theme>> = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 2,
    overflowY: 'auto',
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
  itemBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '8px',
    height: '150px',
    overflow: 'hidden',
    '@media (max-width: 600px)': {
      height: '120px',
      padding: '4px',
    },
  },
};

export const profileStyles: Record<string, SxProps<Theme>> = {
  profileContainer: {
    textAlign: 'center',
    margin: '20px auto',
    maxWidth: '600px',
    padding: '20px',
    backgroundColor: 'background.default',
    borderRadius: '8px',
    boxShadow: 1,
    '@media (max-width: 600px)': {
      padding: '10px',
    },
  },
};


