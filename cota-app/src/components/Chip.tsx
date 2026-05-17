import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { T } from '../theme';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  dashed?: boolean;
  onPress?: () => void;
}

export const Chip = ({ children, active = false, dashed = false, onPress }: ChipProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      active && styles.chipActive,
      dashed && styles.chipDashed,
    ]}
    activeOpacity={0.7}
  >
    <Text style={[styles.text, active && styles.textActive]}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.15)',
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: T.brand,
    borderColor: T.brandDeep,
  },
  chipDashed: {
    borderStyle: 'dashed',
    borderColor: T.ink4,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: T.ink,
  },
  textActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
