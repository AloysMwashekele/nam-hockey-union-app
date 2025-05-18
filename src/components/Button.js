import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import Colors from '../constants/colors';

const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled, 
  loading, 
  mode = 'contained',
  icon,
  compact = false
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      compact={compact}
      style={[styles.button, mode === 'outlined' && styles.outlinedButton, style]}
      labelStyle={[styles.buttonText, textStyle]}
      contentStyle={styles.buttonContent}
    >
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    borderRadius: 8,
  },
  outlinedButton: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
