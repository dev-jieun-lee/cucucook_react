const BASE_URL = "http://localhost:8080/recipe";
// http://openapi.foodsafetykorea.go.kr/api/keyId/COOKRCP01/json/1/5
// 1	keyId	STRING(필수)	인증키	OepnAPI 에서 발급된 인증키
// 2	serviceId	STRING(필수)	서비스명	요청대상인 해당 서비스명
// 3	dataType	STRING(필수)	요청파일 타입	xml : xml파일 , json : json파일
// 4	startIdx	STRING(필수)	요청시작위치	정수입력
// 5	endIdx	STRING(필수)	요청종료위치	정수입력

// 데이터 가져오기 함수
export function getPublicRecipeList(params: {
  search?: string;
  start?: string;
  display?: string;
}) {
  const queryString = new URLSearchParams(params as any).toString();
  return fetch(`${BASE_URL}/getPublicRecipeList?${queryString}`).then(
    (response) => response.json()
  );
}

// 데이터 가져오기 함수
export function getPublicRecipe(params: {
  search?: string;
  start?: string;
  display?: string;
}) {
  const queryString = new URLSearchParams(params as any).toString();
  return fetch(`${BASE_URL}/getPublicRecipe?${queryString}`).then((response) =>
    response.json()
  );
}
