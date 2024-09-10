import axios from "axios";
import Cookies from "js-cookie"; // js-cookie 라이브러리 추가
import { useMutation } from "react-query";

const BASE_URL = "http://localhost:8080/api/members";

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
    // Axios 에러
    throw new Error(error.response?.data?.message || "API 요청 실패");
  } else if (error instanceof Error) {
    // 일반 에러
    throw new Error(error.message);
  } else {
    // 기타 에러
    throw new Error("알 수 없는 에러 발생");
  }
}

// 비밀번호 검증 API 호출
export const verifyPassword = async (userId: string, password: string) => {
  try {
    const response = await axios.post("/api/verify-password", {
      userId, // userId와 password를 함께 전달
      password,
    });
    console.log({ userId, password }); // 요청 전에 파라미터를 로그로 출력
    console.log("API Response:", response); // 응답 데이터를 로그로 출력
    return response; // 서버 응답을 반환
  } catch (error) {
    // 에러 처리
    console.log({ userId, password }); // 요청 전에 파라미터를 로그로 출력

    throw error;
  }
};
