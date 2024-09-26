import axios, { AxiosError } from "axios";
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

// 내정보 비밀번호 검증 API 호출
export const verifyPassword = async (userId: string, password: string) => {
  try {
    // API 호출 전 콘솔 로그
    console.log(
      `비밀번호 검증 API 호출 시도: userId=${userId}, password=******`
    );

    // API 호출
    const response = await api.post("/verify-password", { userId, password });

    // 응답 상태와 데이터 출력
    console.log("비밀번호 검증 성공");
    console.log("응답 상태 코드:", response.status);
    console.log("응답 데이터:", response.data);

    return response.data;
  } catch (error) {
    console.error("비밀번호 검증 API 호출 실패");

    // 에러 로그 출력
    if (axios.isAxiosError(error)) {
      console.error("Axios 오류 메시지:", error.message);
      console.error("응답 상태 코드:", error.response?.status);
      console.error("응답 데이터:", error.response?.data);
    } else {
      console.error("알 수 없는 오류 발생:", error);
    }

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

    const response = await axios.get(`${BASE_URL}/getMyBoards`, {
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

// 회원 정보를 업데이트하는 API 호출 함수
export async function updateMember(
  memberId: string,
  name: string,
  email: string,
  phone: string
) {
  console.log(
    `회원 정보 업데이트 요청: memberId=${memberId}, name=${name}, email=${email}, phone=${phone}`
  );
  try {
    const response = await axios.put(`${BASE_URL}/updateMember`, {
      memberId,
      name,
      email,
      phone,
    });
    console.log("회원 정보 업데이트 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("회원 정보 업데이트 실패:", error);
    throw error;
  }
}

// 비밀번호 변경 API 호출 함수
export async function changePasswordByUser(
  memberId: string,
  newPassword: string
) {
  console.log(`비밀번호 변경 요청: memberId=${memberId}`);
  try {
    const response = await axios.post(
      `${BASE_URL}/ChangePasswordByUserAccordion`,
      {
        memberId,
        newPassword,
      }
    );
    console.log("비밀번호 변경 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    throw error;
  }
}

// 회원 활동 통계 정보 가져오기
export const fetchActivityStats = async (memberId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/getActivityStats`, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    throw error;
  }
};

// 최신 게시글 5개 가져오는 함수
export const fetchMemberBoardList = async (memberId: number, limit: number) => {
  try {
    //console.log("최신게시글 Params:", { memberId, limit });

    // 백엔드 API 호출
    const response = await axios.get(`${BASE_URL}/getMemberBoardList`, {
      params: {
        memberId,
        limit, // 가져올 게시글 수 (최신순으로 5개)
      },
    });

    //console.log("최신게시글esponse from API:", response.data);

    // 서버에서 반환된 게시글 목록을 리턴
    return response.data;
  } catch (err) {
    const error = err as AxiosError; // 에러를 AxiosError 타입으로 캐스팅

    if (error.response) {
      // 서버에서 오류 응답을 반환한 경우
      console.error("Error response from server:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error(
        "No response received from server. Request:",
        error.request
      );
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error("Error setting up the request:", error.message);
    }
    throw error; // 에러가 발생하면 호출한 곳에서 처리할 수 있도록 에러를 던집니다.
  }
};

// 최신 댓글 5개 가져오는 함수
export const fetchMyComments = async (
  memberId: number,
  page: number,
  pageSize: number
) => {
  try {
    console.log(" 최신 댓글5개 Params:", { memberId, page, pageSize });
    const response = await axios.get(`${BASE_URL}/getMyComments`, {
      params: {
        memberId,
        page: 1,
        pageSize: 5,
      },
    });
    console.log("최신 댓글Response from API:", response.data);
    console.log("최신 댓글Response from API:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// 최신 레시피 5개 가져오는 함수
export const fecthMyRecipeList = async (memberId: number, limit: number) => {
  try {
    //console.log(" 최신 레시피 5개 Params:", { memberId, limit });

    // 백엔드 API 호출
    const response = await axios.get(`${BASE_URL}/getMemberRecipeList`, {
      params: {
        memberId,
        limit, // 가져올 게시글 수 (최신순으로 5개)
      },
    });
    // console.log(" 최신 레시피 5개 Response from API:", response.data);
    // 서버에서 반환된 게시글 목록을 리턴
    return response.data;
  } catch (err) {
    const error = err as AxiosError; // 에러를 AxiosError 타입으로 캐스팅

    if (error.response) {
      // 서버에서 오류 응답을 반환한 경우
      console.error("Error response from server:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error(
        "No response received from server. Request:",
        error.request
      );
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error("Error setting up the request:", error.message);
    }
    throw error; // 에러가 발생하면 호출한 곳에서 처리할 수 있도록 에러를 던집니다.
  }
};

// 찜한 레시피 목록 가져오기
export const fetchLikedRecipes = async (memberId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/getLikedRecipes`, {
      params: { memberId },
    });
    console.log("찜한 레시피 목록 로드 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("찜한 레시피 목록 로드 실패:", error);
    throw error;
  }
};
