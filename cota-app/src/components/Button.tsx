import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { T } from '../theme';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const PrimaryButton = ({ children, onPress, style }: ButtonProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.primary, style]}>
    {typeof children === 'string' ? <Text style={styles.primaryText}>{children}</Text> : children}
  </TouchableOpacity>
);

export const SecondaryButton = ({ children, onPress, style }: ButtonProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.secondary, style]}>
    {typeof children === 'string' ? <Text style={styles.secondaryText}>{children}</Text> : children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  primary: {
    backgroundColor: T.brand,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  secondary: {
    backgroundColor: T.surface,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: T.sep,
  },
  secondaryText: {
    color: T.ink,
    fontSize: 17,
    fontWeight: '600',
  },
});
