import React, {ForwardedRef, forwardRef, useRef} from 'react';
import {Dimensions, Pressable, StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {colors} from '../constants';
import {mergeRefs} from '../utils';

interface InputFieldProps extends TextInputProps {
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  label: string;
}

const deviceHeight = Dimensions.get('screen').height;

const InputField = forwardRef(({disabled = false, error, touched, label, ...props}: InputFieldProps, ref?: ForwardedRef<TextInput>) => {
  const inputRef = useRef<TextInput | null>(null);

  const handlePressInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Pressable onPress={handlePressInput} style={styles.pressableContainer}>
      <Text>{label}</Text>
      <View style={[styles.container, disabled && styles.disabled, touched && Boolean(error) && styles.inputError]}>
        <TextInput
          style={[styles.input, disabled && styles.disabled]}
          ref={ref ? mergeRefs(ref, inputRef) : inputRef}
          editable={!disabled}
          placeholderTextColor={colors.GRAY_200}
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
          {...props}
        />
        {touched && Boolean(error) && <Text style={styles.error}>{error}</Text>}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressableContainer: {
    gap: 10,
  },

  container: {
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    padding: deviceHeight > 700 ? 15 : 10,
  },
  input: {
    fontSize: 16,
    color: colors.BLACK,
    padding: 0,
  },
  disabled: {
    backgroundColor: colors.GRAY_200,
    color: colors.GRAY_700,
  },

  inputError: {
    borderColor: colors.RED_300,
  },
  error: {
    color: colors.RED_500,
    fontSize: 12,
    paddingTop: 5,
  },
});

export default InputField;
