import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface TextareaProps extends Omit<TextInputProps, 'onChangeText'> {
  onChangeText?: (text: string) => void;
}

export const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  value,
  onChangeText,
  editable,
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.textarea, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 80,
  },
});

export default Textarea;