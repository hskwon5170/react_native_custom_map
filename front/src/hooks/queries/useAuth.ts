import {useMutation, useQuery} from '@tanstack/react-query';
import {useEffect} from 'react';
import {getAccessToken, getProfile, logout, postLogin, postSignup} from '../../api/auth';
import {queryClient} from '../../api/queryClient';
import {queryKeys, storageKey} from '../../constants';
import {numbers} from '../../constants/numbers';
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
      setEncryptStorage(storageKey.REFRESH_TOKEN, refreshToken);
      // 대부분의 요청할때 헤더에 access token을 담아서 요청해야하는데 그때마다 매번 작성할수는없으니
      // =*=*=*
      // 기본적으로 헤더에 넣어놓는 방법을 적용해보기 (axiosinstance의 defaults headers의 common에 셋 해놓으면 됨)
      setHeader('Authorization', `Bearer ${accessToken}`);
    },
    onSettled: () => {
      queryClient.refetchQueries({queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN]});
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE]});
    },
    ...mutationOptions,
  });
}

// 처음 로그인할때 useGetRefreshToken 훅이 실행되어야함
function useGetRefreshToken() {
  const {isSuccess, data, isError} = useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
    queryFn: getAccessToken,
    staleTime: numbers.ACCESS_TOKEN_REFRESH_TIME, // 30분(1초*60*30) - 3분
    refetchInterval: numbers.ACCESS_TOKEN_REFRESH_TIME, // 30분 - 3분
    refetchOnReconnect: true, // 다른 작업을 하다가 앱으로 돌아와도 자동 갱신되어야함
    refetchIntervalInBackground: true, // 백그라운드에서도 갱신되어야함
  });

  useEffect(() => {
    if (isSuccess) {
      // 성공할경우 access token과 refresh token을 갱신해줘야함
      setHeader('Authorization', `Bearer ${data.accessToken}`);
      setEncryptStorage(storageKey.REFRESH_TOKEN, data.refreshToken);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      // 실패할경우 access token과 refresh token을 삭제해줘야함
      removeHeader('Authorization');
      removeEncryptStorage(storageKey.REFRESH_TOKEN);
    }
  }, [isError]);

  return {isError, isSuccess};
}

function useGetProfile(queryOptions?: UseQueryCustomOptions) {
  return useQuery({
    queryFn: getProfile,
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    ...queryOptions,
  });
}

function useLogout(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeHeader('Authorization');
      removeEncryptStorage(storageKey.REFRESH_TOKEN);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]});
    },
    ...mutationOptions,
  });
}

function useAuth() {
  const signUpMutation = useSignup();
  const refreshTokenQuery = useGetRefreshToken();
  const getProfileQuery = useGetProfile({enabled: refreshTokenQuery.isSuccess}); //refresh 토큰 쿼리를 가져온 뒤 프로필 가져오기
  const isLogin = getProfileQuery.isSuccess;
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {signUpMutation, refreshTokenQuery, getProfileQuery, isLogin, loginMutation, logoutMutation};
}

export default useAuth;
