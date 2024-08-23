const BASE_URL = 'http://localhost:8080/board';


export function getBoardList(params: { search?: string; boardCategoryId?: string; start?: string; display?: string }) {
  const queryString = new URLSearchParams(params).toString();
  return fetch(`${BASE_URL}/getBoardList?${queryString}`).then((response) => response.json());
}
