import { SxProps, Theme } from "@mui/material";
import styled, { CSSProperties } from "styled-components";

// 모달 스타일
export const activityModalStyles: {
  overlay: CSSProperties;
  content: CSSProperties;
} = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    padding: "20px",
    borderRadius: "8px",
    background: "#fff",
    zIndex: 1100,
  },
};

// 사용자 정보 수정 스타일
export const activityUserInfoStyles: {
  container: SxProps;
  formControl: SxProps;
  button: SxProps;
} = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    "@media (max-width: 600px)": {
      padding: "10px",
      maxWidth: "100%",
    },
  },
  formControl: {
    marginBottom: "16px",
    "@media (max-width: 600px)": {
      marginBottom: "12px",
    },
  },
  button: {
    marginBottom: "16px",
    "@media (max-width: 600px)": {
      marginBottom: "12px",
    },
  },
};

// 활동 스타일
export const activityStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: "flex",
    width: "100%",
    "@media (max-width: 900px)": {
      flexDirection: "column",
    },
  },
  content: {
    flexGrow: 1,
    padding: "20px",
    "@media (max-width: 600px)": {
      padding: "10px",
    },
  },
  section: {
    flex: 1,
    padding: "16px",
    border: "1px solid",
    borderColor: "divider",
    borderRadius: "8px",
    margin: "8px",
    "@media (max-width: 600px)": {
      margin: "4px",
      padding: "10px",
    },
  },
  welcomeBox: {
    textAlign: "center",
    marginBottom: "20px",
    padding: "16px",
    backgroundColor: "background.paper",
    borderRadius: "8px",
    boxShadow: 1,
  },
  statsBox: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
    padding: "16px",
    backgroundColor: "background.paper",
    borderRadius: "8px",
    boxShadow: 1,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  statIcon: {
    width: "48px",
    height: "48px",
  },
};

// 프로필 페이지 스타일
export const activityProfileStyles: Record<string, SxProps<Theme>> = {
  profileContainer: {
    textAlign: "center",
    margin: "20px auto",
    maxWidth: "600px",
    padding: "20px",
    backgroundColor: "background.default",
    borderRadius: "8px",
    boxShadow: 1,
    "@media (max-width: 600px)": {
      padding: "10px",
    },
  },
};

// 그리드 스타일
export const activityGridStyles = {
  gridContainer: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(5, 1fr)",
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "repeat(4, 1fr)",
    },
    "@media (max-width: 900px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    "@media (max-width: 600px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
  itemBox: {
    padding: "16px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    textAlign: "center",
  },
};

// 스크롤 버튼 스타일
export const scrollButtonStyles: SxProps<Theme> = {
  position: "fixed",
  bottom: 16,
  right: 16,
  "@media (max-width: 600px)": {
    bottom: 8,
    right: 8,
    width: "40px",
    height: "40px",
  },
};