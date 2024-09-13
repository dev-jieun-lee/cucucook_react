const API_KEY = "15bfe5f2ddab45999ff2";
const BASE_URL = "http://openapi.foodsafetykorea.go.kr/api";
// http://openapi.foodsafetykorea.go.kr/api/keyId/COOKRCP01/json/1/5
// 1	keyId	STRING(필수)	인증키	OepnAPI 에서 발급된 인증키
// 2	serviceId	STRING(필수)	서비스명	요청대상인 해당 서비스명
// 3	dataType	STRING(필수)	요청파일 타입	xml : xml파일 , json : json파일
// 4	startIdx	STRING(필수)	요청시작위치	정수입력
// 5	endIdx	STRING(필수)	요청종료위치	정수입력

export function getPublicRecipe() {
  return fetch(`${BASE_URL}/${API_KEY}/COOKRCP01/json/1/5`).then((response) =>
    response.json()
  );
}
