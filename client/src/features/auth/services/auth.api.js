import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, //use to access cookies through server
});

export async function register({username,email,password}){
    const response= await api.post('/api/auth/register',{username,email,password})
    return response.data
}

export async function login({email,password}){
  const response = await api.post('/api/auth/login',{email,password})
  return response.data
}

export async function getMe() {
  const response=await api.get('/api/auth/get-me')
  return response.data
}