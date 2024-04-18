const queryKeys = {
  AUTH: 'auth',
  GET_ACCESS_TOKEN: 'getAccessToken',
  GET_PROFILE: 'getProfile',
} as const;

const storageKey = {
  REFRESH_TOKEN: 'refreshToken',
} as const;

export {queryKeys, storageKey};
