import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'onChangeText'> {
  onChangeText?: (text: string) => void;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  editable,
  keyboardType,
  maxLength,
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      keyboardType={keyboardType}
      maxLength={maxLength}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default Input;