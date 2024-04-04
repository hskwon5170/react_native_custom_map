import React, {useRef} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import useForm from '../../hooks/useForm';
import {validateSignup} from '../../utils';

function SignUpScreen() {
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmRef = useRef<TextInput | null>(null);
  const signUp = useForm({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validate: validateSignup,
  });
  console.log('사인업', signUp.errors);

  const handleSubmit = () => {
    console.log('value', signUp.values);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.input}>
        <InputField
          placeholder="예) matzip@naver.com"
          label="이메일 주소"
          error={signUp.errors.email}
          inputMode="email"
          touched={signUp.touched.email}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          {...signUp.getTextInputProps('email')}
        />
        <InputField
          ref={passwordRef}
          label="비밀번호"
          placeholder="비밀번호"
          textContentType="oneTimeCode" // 아이폰의 strong password 추천 뜨지 않도록
          error={signUp.errors.password}
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => passwordConfirmRef.current?.focus()}
          {...signUp.getTextInputProps('password')}
          touched={signUp.touched.password}
        />
        <InputField
          ref={passwordConfirmRef}
          label="비밀번호 확인"
          placeholder="비밀번호 확인"
          error={signUp.errors.passwordConfirm}
          secureTextEntry
          touched={signUp.touched.passwordConfirm}
          onSubmitEditing={handleSubmit}
          {...signUp.getTextInputProps('passwordConfirm')}
        />
      </View>
      <CustomButton label="회원가입" onPress={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
  },
  input: {
    gap: 20,
    marginBottom: 30,
  },
});

export default SignUpScreen;
