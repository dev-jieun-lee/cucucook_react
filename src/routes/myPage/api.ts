import axios from "axios";
import Cookies from "js-cookie";
import { useMutation } from "react-query";

const BASE_URL = "http://localhost:8080/api/mypage";

// 기본 axios 인스턴스 설정
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 에러 처리 헬퍼 함수
function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("Axios 에러 발생:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "API 요청 실패");
  } else if (error instanceof Error) {
    console.error("일반 에러 발생:", error.message);
    throw new Error(error.message);
  } else {
    console.error("알 수 없는 에러 발생");
    throw new Error("알 수 없는 에러 발생");
  }
}

// 로그인 요청
export async function login(form: { userId: string; password: string }) {
  try {
    const response = await api.post("/login", form);
    console.log("로그인 응답데이터", response.data);
    // 로그인 성공 시 JWT 토큰을 쿠키에 저장
    if (response.data.token) {
      Cookies.set("auth_token", response.data.token, {
        expires: 7, // 토큰 유효기간 7일
        secure: true,
        sameSite: "Strict",
      });
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// 비밀번호 검증 API 호출
export const verifyPassword = async (userId: string, password: string) => {
  try {
    console.log(`비밀번호 검증 시도: userId=${userId}`);
    const response = await api.post("/verify-password", { userId, password });
    console.log("비밀번호 검증 성공");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 비밀번호 변경 API 호출
export const changePassword = async (userId: string, newPassword: string) => {
  try {
    console.log(`비밀번호 변경 시도: userId=${userId}`);
    const response = await api.post("/change-password", {
      userId,
      newPassword,
    });
    console.log("비밀번호 변경 성공");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 회원 정보 수정 API 호출
export const updateUserInfo = async (
  userId: string,
  name: string,
  email: string,
  phone: string
) => {
  try {
    console.log(
      `회원 정보 수정 시도: userId=${userId}, name=${name}, email=${email}, phone=${phone}`
    );
    const response = await api.put("/update", { userId, name, email, phone });
    console.log("회원 정보 수정 성공");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 회원 탈퇴 API 호출
export const deleteUserAccount = async (userId: string) => {
  try {
    console.log(`회원 탈퇴 시도: userId=${userId}`);
    const response = await api.delete(`/delete/${userId}`);
    Cookies.remove("token");
    console.log("회원 탈퇴 및 토큰 삭제 완료");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// SNS 연동 API 호출
export const connectSNS = async (userId: string, snsType: string) => {
  try {
    console.log(`SNS 연동 시도: userId=${userId}, snsType=${snsType}`);
    const response = await api.post("/connect-sns", { userId, snsType });
    console.log("SNS 연동 성공");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// SNS 연동 해제 API 호출
export const disconnectSNS = async (userId: string, snsType: string) => {
  try {
    console.log(`SNS 연동 해제 시도: userId=${userId}, snsType=${snsType}`);
    const response = await api.post("/disconnect-sns", { userId, snsType });
    console.log("SNS 연동 해제 성공");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 비밀번호 초기화 API 호출
export const resetPassword = async (email: string) => {
  try {
    console.log(`비밀번호 초기화 시도: email=${email}`);
    const response = await api.post("/reset-password", { email });
    console.log("비밀번호 초기화 요청 성공");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
