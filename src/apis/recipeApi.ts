import axios from "axios";
import Cookies from "js-cookie";
const apiUrl = process.env.REACT_APP_API_URL;

const BASE_URL = apiUrl + "/api/recipe";
const token = Cookies.get("auth_token");

// 기본 Axios 인스턴스 생성 (공통 헤더 넣기 위함)
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 쿠키 포함 설정
});
api.interceptors.request.use(
  (config) => {
    // JWT 토큰을 쿠키에서 가져옴
    const token = Cookies.get("auth_token");

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

// http://openapi.foodsafetykorea.go.kr/api/keyId/COOKRCP01/json/1/5
// 1	keyId	STRING(필수)	인증키	OepnAPI 에서 발급된 인증키
// 2	serviceId	STRING(필수)	서비스명	요청대상인 해당 서비스명
// 3	dataType	STRING(필수)	요청파일 타입	xml : xml파일 , json : json파일
// 4	startIdx	STRING(필수)	요청시작위치	정수입력
// 5	endIdx	STRING(필수)	요청종료위치	정수입력
//선택
// RCP_NM 메뉴명
// RCP_PARTS_DTLS 재료정보(재료명)
// CHNG_DT 변경일자 (20170101 정수)
// RCP_PAT2 요리종류 (반찬, 국, 후식 등)

/* 공공레시피 */
// 공공 레시피 목록조회
export async function getPublicRecipeList(params: any) {
  const response = await api.get(`/getPublicRecipeList`, {
    params: params,
  });
  return response;
}

// 공공 레시피 상세조회
export async function getPublicRecipe(params: any) {
  const response = await api.get(`/getPublicRecipe`, {
    params: params,
  });
  return response;
}

/* 회원 레시피*/
// 회원 레시피 목록조회
export async function getMemberRecipeList(params: any) {
  const response = await api.get(`/getMemberRecipeList`, {
    params: params,
  });
  return response;
}

// 회원 레시피 상세조회
export async function getMemberRecipe(params: any) {
  console.log(token);
  const response = await api.get(`/getMemberRecipe`, {
    params: params,
    headers: {
      Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
    },
    withCredentials: true, // 쿠키 포함 설정
  });
  console.log(response);
  return response;
}

// 회원 레시피 등록
export async function insertMemberRecipe(form: any) {
  const response = await api.post(`/insertMemberRecipe`, form);
  return response.data;
}

//회원 레시피 수정
export async function updateMemberRecipe(recipeId: string, form: any) {
  const response = await api.post(`/updateMemberRecipe`, form, {
    params: { recipeId },
  });
  return response.data;
}

//회원 레시피 삭제
export async function deleteMemberRecipe(params: any) {
  const response = await api.delete(`/deleteMemberRecipe`, {
    params: params,
  });
  return response.data;
}

/* 댓글 */
// 회원 레시피 별 댓글 조회
export async function getRecipeCommentList(params: any) {
  const response = await api.get(`/getRecipeCommentList`, {
    params: params,
  });
  return response;
}

// 회원 레시피 댓글 상세조회
export async function getRecipeComment(params: any) {
  const response = await api.get(`/getRecipeComment`, {
    params: params,
  });
  return response;
}

//회원 레시피 댓글 등록
export async function insertRecipeComment(form: any) {
  const response = await api.post(`/insertRecipeComment`, form);
  return response.data;
}
//회원 레시피 댓글 수정
export async function updateRecipeComment(form: any) {
  const response = await api.put(`/updateRecipeComment`, form);
  return response.data;
}

//회원 레시피 댓글 삭제
export async function deleteRecipeComment(params: any) {
  const response = await api.delete(`/deleteRecipeComment`, {
    params: params,
  });
  return response.data;
}

//회원 레시피 댓글 삭제(댓글에 대댓글이 있는경우)
export async function deleteRecipeCommentHasChild(params: any) {
  const response = await api.put(
    `/deleteRecipeCommentHasChild`,
    {} // 본문 내용이 없으므로 빈 객체를 전달
  );
  return response.data;
}

/* 카테고리 */

// 회원 레시피 카테고리목록조회
export async function getRecipeCategoryListWithMemberRecipeCount(params: any) {
  const response = await api.get(
    `/getRecipeCategoryListWithMemberRecipeCount`,
    {
      params: params,
    }
  );
  return response;
}

//회원 레시피용 카테고리 가져오기
export async function getRecipeCategoryListForWrite(params: any) {
  const response = await api.get(`/getRecipeCategoryListForWrite`, {
    params: params,
  });
  return response;
}

/* 좋아요 */

//회원 레시피 좋아요
export async function insertMemberRecipeLike(form: any) {
  const response = await api.post(`/insertMemberRecipeLike`, form);
  return response.data;
}

//회원 레시피 좋아요 삭제
export async function deleteMemberRecipeLike(params: any) {
  const response = await api.delete(`/deleteMemberRecipeLike`, {
    params: params,
  });
  return response.data;
}

/* 관리자 */
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
