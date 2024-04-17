import React, {useRef} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import useAuth from '../../hooks/queries/useAuth';
import useForm from '../../hooks/useForm';
import {validateLogin} from '../../utils';

function LoginScreen() {
  const passwordRef = useRef<TextInput | null>(null);
  const {loginMutation} = useAuth();

  const login = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateLogin,
  });

  const handleSubmit = () => {
    console.log('values', login.values);
    loginMutation.mutate(login.values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          label="이메일 주소"
          placeholder="예) matzip@naver.com"
          error={login.errors.email}
          inputMode="email"
          // value={values.email}
          // onChangeText={text => handleChangeText('email', text)}
          // onBlur={() => handleBlur('email')}
          returnKeyType="next"
          touched={login.touched.email}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false} // 이렇게 설정해주면 next 버튼을 눌러도 키보드가 닫히지 않음
          {...login.getTextInputProps('email')}
        />
        <InputField
          label="비밀번호"
          ref={passwordRef}
          placeholder="비밀번호"
          error={login.errors.password}
          secureTextEntry
          // value={values.password}
          // onChangeText={text => handleChangeText('password', text)}
          // onBlur={() => handleBlur('password')}
          returnKeyType="join"
          touched={login.touched.password}
          onSubmitEditing={handleSubmit}
          blurOnSubmit={false}
          {...login.getTextInputProps('password')}
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
