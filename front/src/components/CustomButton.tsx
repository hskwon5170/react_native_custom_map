import React from 'react';
import {
  Dimensions,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from '../constants';

interface CustomButtonProps extends PressableProps {
  label: string;
  variant?: 'filled' | 'outlined';
  size?: 'large' | 'medium';
  invalid?: boolean;
}

const deviceHeight = Dimensions.get('screen').height;

function CustomButton({
  label,
  variant = 'filled',
  size = 'large',
  invalid = false,
  ...props
}: CustomButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={invalid}
      style={({pressed}) => [
        styles.container,
        styles[variant],
        invalid && styles.invalid,
        pressed ? styles[`${variant}Pressed`] : styles[variant],
      ]}>
      <View style={styles[size]}>
        <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  filled: {
    backgroundColor: colors.PINK_700,
    color: 'white',
  },
  outlined: {
    borderColor: colors.PINK_700,
    borderWidth: 1,
    color: 'black',
  },
  large: {
    width: '100%',
    paddingVertical: deviceHeight > 700 ? 15 : 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  medium: {
    width: '50%',
    paddingVertical: deviceHeight > 700 ? 12 : 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  filledText: {
    color: colors.WHITE,
  },
  outlinedText: {
    color: colors.PINK_700,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  invalid: {
    opacity: 0.5,
  },
  filledPressed: {
    backgroundColor: colors.PINK_500,
  },
  outlinedPressed: {
    opacity: 0.5,
  },
});

export default CustomButton;
