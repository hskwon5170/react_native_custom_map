interface ValueProps {
  email: string;
  password: string;
}

const validateUser = (values: ValueProps) => {
  const error = {
    email: '',
    password: '',
  };

  // email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(values.email)) {
    error.email = '이메일 형식이 올바르지 않습니다.';
  }

  if (!(values.password.length >= 8 && values.password.length < 20)) {
    error.password = '비밀번호는 8자 이상 20자 이하로 입력해주세요.';
  }

  return error;
};

export const validateLogin = (values: ValueProps) => {
  return validateUser(values);
};

export const validateSignUp = (values: ValueProps & {passwordConfirm: string}) => {
  const error = validateUser(values);
  const signUpErrors = {...error, passwordConfirm: ''};

  if (values.password !== values.passwordConfirm) {
    signUpErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
  }
  return signUpErrors;
};
