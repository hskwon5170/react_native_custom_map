import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import useForm from '../../hooks/useForm';

interface ValueProps {
  email: string;
  password: string;
}

const validateLogin = (values: ValueProps) => {
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

function LoginScreen() {
  const login = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateLogin,
  });

  const handleSubmit = () => {
    console.log('values', login.values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          placeholder="이메일"
          error={login.errors.email}
          inputMode="email"
          // value={values.email}
          // onChangeText={text => handleChangeText('email', text)}
          // onBlur={() => handleBlur('email')}
          {...login.getTextInputProps('email')}
          touched={login.touched.email}
        />
        <InputField
          placeholder="비밀번호"
          error={login.errors.password}
          secureTextEntry
          // value={values.password}
          // onChangeText={text => handleChangeText('password', text)}
          // onBlur={() => handleBlur('password')}
          {...login.getTextInputProps('password')}
          touched={login.touched.password}
        />
      </View>
      <CustomButton label="로그인" onPress={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 30,
  },
});

export default LoginScreen;
