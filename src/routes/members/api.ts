import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/members";


//로그인
export async function login(form: any) {
  const response = await axios.post(`${BASE_URL}/login`, form);
  return response.data;
}
//로그아웃
export async function logout() {
  const response = await axios.post(`${BASE_URL}/logout`);
  return response.data;
}

