import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useMutation } from "react-query";

const apiUrl = process.env.REACT_APP_API_URL;
const BASE_URL = apiUrl + "/api/mypage";
const TOKEN_EXPIRED_DAY: number = Number(process.env.TOKEN_EXPIRED_DAY);

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
    console.error("응답 상태 코드:", error.response?.status);
    console.error("응답 데이터:", error.response?.data);
    throw new Error(error.response?.data?.message || "API 요청 실패");
  } else if (error instanceof Error) {
    console.error("일반 에러 발생:", error.message);
    throw new Error(error.message);
  } else {
    console.error("알 수 없는 에러 발생");
    throw new Error("알 수 없는 에러 발생");
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
  sortDirection: string,
  search: string,
  searchType: string
) => {
  try {
    const response = await axios.get(`${BASE_URL}/getMyComments`, {
      params: {
        memberId,
        page,
        pageSize,
        sortOption,
        sortDirection,
        search,
        searchType,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    throw error;
  }
};

//게시물
export const fetchMyWrites = async (
  memberId: string,
  page: number,
  pageSize: number,
  boardDivision: string,
  search: string,
  searchType: string
) => {
  try {
    // 여기서 boardDivision을 로깅합니다.
    //console.log("Fetching writes with boardDivision:", boardDivision);

    const response = await axios.get(`${BASE_URL}/getMyBoards`, {
      params: {
        memberId,
        page,
        pageSize,
        boardDivision,
        search,
        searchType,
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
  phone: string,
  role?: string
) {
  try {
    const response = await axios.put(`${BASE_URL}/updateMember`, {
      memberId,
      name,
      email,
      phone,
      role,
    });
    return response.data;
  } catch (error) {
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
    //  console.error("Error fetching activity stats:", error);
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
    //  console.log("최신게시글esponse from API:", response.data);

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
  pageSize: number,
  search: string,
  searchType: string
) => {
  try {
    // console.log(" 최신 댓글5개 Params:", { memberId, page, pageSize });
    const response = await axios.get(`${BASE_URL}/getMyComments`, {
      params: {
        memberId,
        page: 1,
        pageSize: 5,
        search,
        searchType,
      },
    });
    // console.log("최신 댓글Response from API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// 모든 레시피를 가져오는 함수
export const fetchMyRecipeList = async (memberId: number, limit?: number, search? : string, searchType? : string) => {
  try {
    // console.log("레시피 Params:", { memberId, limit });

    // 백엔드 API 호출
    const response = await axios.get(`${BASE_URL}/getMemberRecipeList`, {
      params: {
        memberId,
        search,
        searchType,
        ...(limit !== undefined && { limit }), // limit이 undefined가 아닐 경우에만 포함
      },
    });

    console.log("레시피 Response from API:", response.data);
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
    // console.log("찜한 레시피 목록 로드 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("찜한 레시피 목록 로드 실패:", error);
    throw error;
  }
};

// 찜한 레시피 목록 및 검색 API 통합 함수
export const getRecipeLikeListOtherInfo = async (
  memberId: number,
  recipeCategoryId: string,
  orderby: string,
  display: number,
  start: number,
  keyword?: string // `keyword` 파라미터를 추가하여 검색 기능을 통합
) => {
  try {
    // 파라미터 확인 로그
    console.log(
      `API 호출: memberId=${memberId}, recipeCategoryId=${recipeCategoryId}, orderby=${orderby}, display=${display}, start=${start}, keyword=${keyword}`
    );

    // 서버로 API 요청을 보낼 때 keyword 파라미터도 함께 전달
    const response = await axios.get(`${BASE_URL}/getRecipeLikeListOtherInfo`, {
      params: {
        memberId,
        recipeCategoryId,
        orderby,
        display,
        start,
        keyword, // keyword 파라미터를 추가하여 조건 전달
      },
    });

    console.log("찜한 레시피 목록 로드 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
};
