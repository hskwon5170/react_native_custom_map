import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import useForm from '../../hooks/useForm';
import {validateSignup} from '../../utils';

function SignUpScreen() {
  const signUp = useForm({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validate: validateSignup,
  });
  console.log('사인업', signUp.errors);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.input}>
        <InputField
          placeholder="이메일"
          error={signUp.errors.email}
          inputMode="email"
          touched={signUp.touched.email}
          {...signUp.getTextInputProps('email')}
        />
        <InputField
          placeholder="비밀번호"
          error={signUp.errors.password}
          secureTextEntry
          {...signUp.getTextInputProps('password')}
          touched={signUp.touched.password}
        />
        <InputField
          placeholder="비밀번호 확인"
          error={signUp.errors.passwordConfirm}
          secureTextEntry
          {...signUp.getTextInputProps('passwordConfirm')}
          touched={signUp.touched.passwordConfirm}
        />
      </View>
      <CustomButton label="회원가입" />
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
