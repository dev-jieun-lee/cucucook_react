import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;
const BASE_URL = apiUrl + "/api/board";

//게시판 리스트 조회
export async function getBoardList(params: any) {
  const response = await axios.get(`${BASE_URL}/getBoardList`, {
    params: params,
  });
  return response.data;
}

//게시판 상세 조회
export async function getBoard(id: any) {
  const response = await axios.get(`${BASE_URL}/getBoard`, {
    params: {
      boardId: id,
    },
  });
  return response.data;
}

//게시판 답글 포함 상세 조회
export async function getBoardWithReplies(id: any) {
  const response = await axios.get(`${BASE_URL}/getBoardWithReplies`, {
    params: {
      boardId: id,
    },
  });
  return response.data;
}

//게시판 등록
export async function insertBoard(form: any) {
  const response = await axios.post(`${BASE_URL}/insertBoard`, form);
  return response.data;
}

//게시판 수정
export async function updateBoard(id: any, form: any) {
  const response = await axios.put(`${BASE_URL}/updateBoard`, form, {
    params: {
      boardId: id,
    },
  });
  return response.data;
}

//게시판 삭제
export async function deleteBoard(id: string) {
  const response = await axios.delete(`${BASE_URL}/deleteBoard`, {
    params: {
      boardId: id,
    },
  });
  return response.data;
}

//게시판 카테고리 리스트 조회
export async function getBoardCategoryList(params: any) {
  const response = await axios.get(`${BASE_URL}/getBoardCategoryList`, {
    params: params,
  });
  return response.data;
}

//게시판 카테고리 상세 조회
export async function getBoardCategory(id?: string) {
  const response = await axios.get(`${BASE_URL}/getBoardCategory`, {
    params: {
      boardCategoryId: id,
    },
  });
  return response.data;
}

//게시판 카테고리 등록
export async function insertBoardCategory(form: any) {
  const response = await axios.post(`${BASE_URL}/insertBoardCategory`, form);
  return response.data;
}

//게시판 카테고리 수정
export async function updateBoardCategory(id: any, form: any) {
  const response = await axios.put(`${BASE_URL}/updateBoardCategory`, form, {
    params: {
      boardCategoryId: id,
    },
  });
  return response.data;
}

//게시판 카테고리 삭제
export async function deleteBoardCategory(id: string) {
  const response = await axios.delete(`${BASE_URL}/deleteBoardCategory`, {
    params: {
      boardCategoryId: id,
    },
  });
  return response.data;
}

//게시판 첨부파일 리스트 조회
export async function getBoardFilesList(boardId: any) {
  const response = await axios.get(`${BASE_URL}/getBoardFilesList`, {
    params: {
      boardId,
    },
  });
  return response.data;
}
