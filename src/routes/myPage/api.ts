import axios, { AxiosError } from "axios"; // AxiosError를 import
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

//내정보 비밀번호 검증 API 호출
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

// 내정보 - 회원 정보 수정 API 호출
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

//내정보 - 회원 탈퇴 API 호출
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

//댓글 가져오기
export const fetchMyReplies = async (
  memberId: string,
  page: number,
  pageSize: number,
  sortOption: string,
  sortDirection: string
) => {
  try {
    const response = await axios.get(`${BASE_URL}/getMyComments`, {
      params: { page, pageSize, memberId, sortOption, sortDirection },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    throw error;
  }
};

//댓글 삭제
export const deleteReply = async (memberId: string, commentId: string) => {
  try {
    console.log("api.ts 진입");
    const response = await axios.delete(`${BASE_URL}/delete`, {
      params: { memberId, commentId },
    });
    console.log("api.ts 들어갔다 나옴");
    return response.data;
  } catch (error) {
    console.error("Failed to delete reply:", error);
    throw error;
  }
};

// 댓글 검색
export const searchReplies = async (
  searchKeyword: string,
  searchType: string,
  memberId: string,
  page: number,
  pageSize: number,
  sortOption: string,
  sortDirection: string
) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        searchKeyword,
        searchType,
        memberId,
        page,
        pageSize,
        sortOption,
        sortDirection,
      },
    });
    console.log("검색한데이터", response.data);
    return response.data;
  } catch (error) {
    console.error("검색 실패:", error);

    if (axios.isAxiosError(error)) {
      // error가 AxiosError인지 확인
      if (error.response) {
        console.error("응답 데이터:", error.response.data);
        console.error("응답 상태:", error.response.status);
        console.error("응답 헤더:", error.response.headers);
      } else if (error.request) {
        console.error("요청이 이루어졌으나 응답이 없음:", error.request);
      } else {
        console.error("에러 메시지:", error.message);
      }
    } else {
      console.error("알 수 없는 에러:", error);
    }
  }
};

//게시물
export const fetchMyWrites = async (
  memberId: string,
  page: number,
  pageSize: number,
  boardDivision: string
) => {
  try {
    // 여기서 boardDivision을 로깅합니다.
    console.log("Fetching writes with boardDivision:", boardDivision);

    const response = await axios.get(`/api/mypage/getMyBoards`, {
      params: {
        memberId,
        page,
        pageSize,
        boardDivision,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my writes:", error);
    throw error;
  }
};
