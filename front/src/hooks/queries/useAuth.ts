import {useMutation, useQuery} from '@tanstack/react-query';
import {useEffect} from 'react';
import {getAccessToken, getProfile, logout, postLogin, postSignup} from '../../api/auth';
import {queryClient} from '../../api/queryClient';
import {UseMutationCustomOptions, UseQueryCustomOptions} from '../../types/common';
import {removeEncryptStorage, setEncryptStorage} from '../../utils';
import {removeHeader, setHeader} from '../../utils/header';

function useSignup(mutationOptions?: UseMutationCustomOptions) {
  const response = useMutation({
    mutationFn: postSignup,
    ...mutationOptions,
  });
  // console.log('사인업 뮤테익션', response);
  return response;
}

function useLogin(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postLogin,
    // response로 access, refresh token 오기때문에 디스트럭쳐링으로 받아주기
    onSuccess: ({accessToken, refreshToken}) => {
      setEncryptStorage('refreshToken', refreshToken);
      // 대부분의 요청할때 헤더에 access token을 담아서 요청해야하는데 그때마다 매번 작성할수는없으니
      // =*=*=*
      // 기본적으로 헤더에 넣어놓는 방법을 적용해보기 (axiosinstance의 defaults headers의 common에 셋 해놓으면 됨)
      setHeader('Authorization', `Bearer ${accessToken}`);
    },
    onSettled: () => {
      queryClient.refetchQueries({queryKey: ['auth', 'getAccessToken']});
      queryClient.invalidateQueries({queryKey: ['auth', 'getProfile']});
    },
    ...mutationOptions,
  });
}

// 처음 로그인할때 useGetRefreshToken 훅이 실행되어야함
function useGetRefreshToken() {
  const {isSuccess, data, isError} = useQuery({
    queryKey: ['auth', 'getAccessToken'],
    queryFn: getAccessToken,
    staleTime: 1000 * 60 * 30 - 1000 * 60 * 3, // 30분(1초*60*30) - 3분
    refetchInterval: 1000 * 60 * 30 - 1000 * 60 * 3, // 30분 - 3분
    refetchOnReconnect: true, // 다른 작업을 하다가 앱으로 돌아와도 자동 갱신되어야함
    refetchIntervalInBackground: true, // 백그라운드에서도 갱신되어야함
  });

  useEffect(() => {
    if (isSuccess) {
      // 성공할경우 access token과 refresh token을 갱신해줘야함
      setHeader('Authorization', `Bearer ${data.accessToken}`);
      setEncryptStorage('refreshToken', data.refreshToken);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      // 실패할경우 access token과 refresh token을 삭제해줘야함
      removeHeader('Authorization');
      removeEncryptStorage('refreshToken');
    }
  }, [isError]);

  return {isError, isSuccess};
}

function useGetProfile(queryOptions?: UseQueryCustomOptions) {
  return useQuery({
    queryFn: getProfile,
    queryKey: ['auth', 'getProfile'],
    ...queryOptions,
  });
}

function useLogout(mutationOptions?: UseMutationCustomOptions) {
  console.log('로그아웃 실행됨');
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeHeader('Authorization');
      removeEncryptStorage('refreshToken');
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['auth']});
    },
    ...mutationOptions,
  });
}

function useAuth() {
  const signupMutation = useSignup();
  const refreshTokenQuery = useGetRefreshToken();
  const getProfileQuery = useGetProfile({enabled: refreshTokenQuery.isSuccess}); //refresh 토큰 쿼리를 가져온 뒤 프로필 가져오기
  const isLogin = getProfileQuery.isSuccess;
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {signupMutation, refreshTokenQuery, getProfileQuery, isLogin, loginMutation, logoutMutation};
}

export default useAuth;
