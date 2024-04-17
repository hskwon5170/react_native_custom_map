import {Category, Profile} from '../types/domain';
import {getEncryptStorage} from '../utils';
import axiosInstance from './axios';

type RequestUser = {
  email: string;
  password: string;
};

interface ResponseToken {
  accessToken: string;
  refreshToken: string;
}

type ResponseProfile = Profile & Category;

const postSignup = async ({email, password}: RequestUser): Promise<void> => {
  const {data} = await axiosInstance.post('/auth/signup', {
    email,
    password,
  });
  return data;
};

// 로그인 한 이후 accessToken과 refreshToken이 응답데이터로 온다
const postLogin = async ({email, password}: RequestUser): Promise<ResponseToken> => {
  const {data} = await axiosInstance.post('/auth/signin', {
    email,
    password,
  });
  return data;
};

const getProfile = async (): Promise<ResponseProfile> => {
  const {data} = await axiosInstance.get('/auth/me');
  return data;
};

const getAccessToken = async (): Promise<ResponseToken> => {
  // 토큰을 리프레시 성공한다는것 자체가 이미 과거에 로그인 한 이력이 있어서
  // encryptStorage에 리프레시 토큰이 저장되어있음을 의미함

  // encryptStorage에 저장된 refresh 토큰을 access 토큰을 받기 위해 헤더에 담아서 요청하기
  const refreshToken = await getEncryptStorage('refreshToken');
  const {data} = await axiosInstance.get('/auth/refresh', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return data;
};

const logout = async () => {
  await axiosInstance.post('/auth/logout');
};

export {getAccessToken, getProfile, logout, postLogin, postSignup};
export type {RequestUser, ResponseProfile, ResponseToken};
