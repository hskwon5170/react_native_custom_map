import {Category, Profile} from '../types/domain';
import {getEncryptStorage} from '../utils';
import axiosInstance from './axios';

export interface RequestUser {
  email: string;
  password: string;
}
const postSignup = async ({email, password}: RequestUser): Promise<void> => {
  const {data} = await axiosInstance.post('/auth/signup', {
    email,
    password,
  });
  return data;
};

export interface ResponseToken {
  accessToken: string;
  refreshToken: string;
}
const postLogin = async ({email, password}: RequestUser): Promise<ResponseToken> => {
  const {data} = await axiosInstance.post('/auth/signin', {
    email,
    password,
  });
  return data;
};

export type ResponseProfile = Profile & Category;
const getProfile = async (): Promise<ResponseProfile> => {
  const {data} = await axiosInstance.get('/auth/me');
  return data;
};

const getAccessToken = async (): Promise<ResponseToken> => {
  // 토큰을 리프레시 성공한다는것 자체가 이미 과거에 로그인 한 이력이 있어서
  // encryptStorage에 리프레시 토큰이 저장되어있음을 의미함
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
