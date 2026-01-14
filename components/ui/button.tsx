import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, TextStyle, ViewStyle } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  variant = 'default',
  style,
  ...props
}) => {
  const buttonStyle = [
    styles.base,
    variant === 'ghost' && styles.ghost,
    disabled && styles.disabled,
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, variant === 'ghost' && styles.ghostText, disabled && styles.disabledText]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  ghostText: {
    color: '#007AFF',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});

export default Button;