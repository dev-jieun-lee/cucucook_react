import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const BASE_URL = apiUrl + "/api/recipe";
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
  const response = await axios.get(`${BASE_URL}/getPublicRecipeList`, {
    params: params,
  });
  return response;
}

// 공공 레시피 상세조회
export async function getPublicRecipe(params: any) {
  const response = await axios.get(`${BASE_URL}/getPublicRecipe`, {
    params: params,
  });
  return response;
}

/* 회원 레시피*/
// 회원 레시피 목록조회
export async function getMemberRecipeList(params: any) {
  const response = await axios.get(`${BASE_URL}/getMemberRecipeList`, {
    params: params,
  });

  return response;
}

// 회원 레시피 상세조회
export async function getMemberRecipe(params: any) {
  const response = await axios.get(`${BASE_URL}/getMemberRecipe`, {
    params: params,
  });
  return response;
}

// 회원 레시피 등록
export async function insertMemberRecipe(form: any) {
  const formData = new FormData();

  // 레시피 정보 추가 (JSON 형태로)
  formData.append("recipeInfo", JSON.stringify(form.recipeInfo));

  // 레시피 재료 정보 추가 (JSON 형태로)
  formData.append("recipeIngredients", JSON.stringify(form.recipeIngredients));

  // 레시피 썸네일 추가 (파일 객체)
  if (form.recipeInfo.thumbnail) {
    formData.append("thumbnail", form.recipeInfo.thumbnail);
  } else {
    formData.append("thumbnail", new Blob(), "");
  }

  //과정 설명
  const processContentsList = form.recipeProcessItems.map(
    (item: any) => item.processContents
  );
  formData.append(
    "recipeProcessContents",
    new Blob([JSON.stringify(processContentsList)], {
      type: "application/json",
    })
  );
  //과정 이미지
  form.recipeProcessItems.forEach((item: any, index: number) => {
    if (item.image) {
      formData.append("recipeProcessImages", item.image);
    } else {
      // 빈 파일을 전송 (빈 Blob)
      formData.append("recipeProcessImages", new Blob(), "");
    }
  });

  const response = await axios.post(
    `${BASE_URL}/insertMemberRecipe`,
    formData,
    {}
  );
  return response.data;
}

//회원 레시피 수정
export async function updateMemberRecipe(recipeId: string, form: any) {
  const formData = new FormData();

  // 레시피 정보 추가 (JSON 형태로)
  formData.append("recipeInfo", JSON.stringify(form.recipeInfo));

  // 레시피 재료 정보 추가 (JSON 형태로)
  formData.append("recipeIngredients", JSON.stringify(form.recipeIngredients));

  //기존 가지고 있던 이미지id
  formData.append("thumbnailServerImgId", form.thumbnailServerImgId);

  // 레시피 썸네일 추가 (파일 객체)
  if (form.recipeInfo.thumbnail) {
    formData.append("thumbnail", form.recipeInfo.thumbnail);
  } else {
    formData.append("thumbnail", new Blob(), "");
  }

  //과정 설명
  const processContentsList = form.recipeProcessItems.map(
    (item: any) => item.processContents
  );
  formData.append(
    "recipeProcessContents",
    new Blob([JSON.stringify(processContentsList)], {
      type: "application/json",
    })
  );
  //과정 이미지
  form.recipeProcessItems.forEach((item: any, index: number) => {
    if (item.image) {
      formData.append("recipeProcessImages", item.image);
    } else {
      // 빈 파일을 전송 (빈 Blob)
      formData.append("recipeProcessImages", new Blob(), "");
    }
  });

  const response = await axios.post(
    `${BASE_URL}/updateMemberRecipe`,
    formData,
    {
      params: { recipeId: recipeId },
    }
  );
  return response.data;
}

//회원 레시피 삭제
export async function deleteMemberRecipe(params: any) {
  const response = await axios.delete(`${BASE_URL}/deleteMemberRecipe`, {
    params: params,
  });
  return response.data;
}

/* 댓글 */
// 회원 레시피 별 댓글 조회
export async function getRecipeCommentList(params: any) {
  const response = await axios.get(`${BASE_URL}/getRecipeCommentList`, {
    params: params,
  });
  return response;
}

// 회원 레시피 댓글 상세조회
export async function getRecipeComment(params: any) {
  const response = await axios.get(`${BASE_URL}/getRecipeComment`, {
    params: params,
  });
  return response;
}

//회원 레시피 댓글 등록
export async function insertRecipeComment(form: any) {
  const response = await axios.post(`${BASE_URL}/insertRecipeComment`, form);
  return response.data;
}

//회원 레시피 댓글 수정
export async function updateRecipeComment(form: any) {
  const response = await axios.put(`${BASE_URL}/updateRecipeComment`, form);
  return response.data;
}

//회원 레시피 댓글 삭제
export async function deleteRecipeComment(params: any) {
  const response = await axios.delete(`${BASE_URL}/deleteRecipeComment`, {
    params: params,
  });
  return response.data;
}

//회원 레시피 댓글 삭제(댓글에 대댓글이 있는경우)
export async function deleteRecipeCommentHasChild(params: any) {
  const response = await axios.put(
    `${BASE_URL}/deleteRecipeCommentHasChild`,
    {}, // 본문 내용이 없으므로 빈 객체를 전달
    {
      params: params,
    }
  );
  return response.data;
}

/* 카테고리 */

// 회원 레시피 카테고리목록조회
export async function getRecipeCategoryListWithMemberRecipeCount(params: any) {
  const response = await axios.get(
    `${BASE_URL}/getRecipeCategoryListWithMemberRecipeCount`,
    {
      params: params,
    }
  );
  return response;
}

//회원 레시피용 카테고리 가져오기
export async function getRecipeCategoryListForWrite(params: any) {
  const response = await axios.get(
    `${BASE_URL}/getRecipeCategoryListForWrite`,
    {
      params: params,
    }
  );
  return response;
}

/* 좋아요 */

//회원 레시피 좋아요
export async function insertMemberRecipeLike(form: any) {
  const response = await axios.post(`${BASE_URL}/insertMemberRecipeLike`, form);
  return response.data;
}

//회원 레시피 좋아요 삭제
export async function deleteMemberRecipeLike(params: any) {
  const response = await axios.delete(`${BASE_URL}/deleteMemberRecipeLike`, {
    params: params,
  });
  return response.data;
}
