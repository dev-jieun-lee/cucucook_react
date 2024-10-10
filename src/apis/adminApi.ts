import axios from "axios";
import Cookies from "js-cookie";
const apiUrl = process.env.REACT_APP_API_URL;

const BASE_URL = apiUrl + "/api/admin";
const token = Cookies.get("refresh_token");

// 기본 Axios 인스턴스 생성 (공통 헤더 넣기 위함)
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 쿠키 포함 설정
});
api.interceptors.request.use(
  (config) => {
    // 토큰이 존재할 경우 Authorization 헤더 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 요청 오류 처리
    return Promise.reject(error);
  }
);

// 회원 탈퇴 API 호출 함수
export const deleteAccount = async (memberId: string) => {
  try {
    const response = await api.delete(`${BASE_URL}/deleteAccount/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 회원 정보를 가져오는 API 호출 함수
export async function getMember(memberId: string) {
  try {
    const response = await api.get(`${BASE_URL}/getMember`, {
      params: { memberId },
    });
    return response.data; // 전체 회원 정보를 반환
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios 에러 객체일 경우
      console.error("Axios 에러 발생:", error.response?.data);
      console.error("응답 상태 코드:", error.response?.status); // 응답 상태 코드 로그
    } else {
      // 기타 에러
      console.error("회원 정보 조회 중 에러 발생:", error);
    }
    throw error; // 에러 발생 시 throw
  }
}

// 회원 정보를 업데이트하는 API 호출 함수
export async function updateMember(
  memberId: string,
  name: string,
  email: string,
  phone: string,
  role?: string
) {
  try {
    const response = await api.put(`${BASE_URL}/updateMember`, {
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

//게시판 카테고리 리스트 조회
export async function getBoardCategoryList(params: any) {
  const response = await api.get(`${BASE_URL}/getBoardCategoryList`, {
    params: params,
  });
  return response.data;
}

//게시판 카테고리 상세 조회
export async function getBoardCategory(id?: string) {
  const response = await api.get(`${BASE_URL}/getBoardCategory`, {
    params: {
      boardCategoryId: id,
    },
  });
  return response.data;
}

//게시판 카테고리 등록
export async function insertBoardCategory(form: any) {
  const response = await api.post(`${BASE_URL}/insertBoardCategory`, form);
  return response.data;
}

//게시판 카테고리 수정
export async function updateBoardCategory(id: any, form: any) {
  const response = await api.put(`${BASE_URL}/updateBoardCategory`, form, {
    params: {
      boardCategoryId: id,
    },
  });
  return response.data;
}

//게시판 카테고리 삭제
export async function deleteBoardCategory(id: string) {
  const response = await api.delete(`${BASE_URL}/deleteBoardCategory`, {
    params: {
      boardCategoryId: id,
    },
  });
  return response.data;
}

//레시피카테고리 관리용 카테고리목록 가져오기
export async function getRecipeCategoryListForAdmin(params: any) {
  const response = await api.get(`/getRecipeCategoryList`, {
    params: params,
  });
  return response;
}

//레시피 카테고리 가져오기
export async function getRecipeCategory(params: any) {
  const response = await api.get(`/getRecipeCategory`, {
    params: params,
  });
  return response;
}

//레시피카테고리 추가
export async function insertRecipeCategory(form: any) {
  const response = await api.post(`/insertRecipeCategory`, form);
  return response.data;
}

//레시피카테고리 수정
export async function updateRecipeCategory(params: any, form: any) {
  const response = await api.put(`/updateRecipeCategory`, form, {
    params: params,
  });
  return response.data;
}

//레시피카테고리 삭제
export async function deleteRecipeCategory(params: any) {
  const response = await api.delete(`/deleteRecipeCategory`, {
    params: params,
  });
  return response.data;
}

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
