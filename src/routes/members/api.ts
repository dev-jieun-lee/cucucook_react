import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/members";


//로그인
export async function login(form: any) {
  console.log(form);
  
  const response = await axios.post(`${BASE_URL}/login`, form);
  console.log(response);
  
  return response.data;
}
//로그아웃
export async function logout() {
  const response = await axios.post(`${BASE_URL}/logout`);
  return response.data;
}

//핸드폰번호 중복체크
export async function phoneCheck(form: any) {
  const response = await axios.post(`${BASE_URL}/check-phone`, form);
  return response.data;
}

//아이디 중복체크
export async function idCheck(id: string) {
  const response = await axios.get(`${BASE_URL}/check-id/${id}`);
  return response.data;
}

//회원가입
export async function register(form : any) {
  const response = await axios.post(`${BASE_URL}/register`, form);
  return response.data;
}

