import React from 'react';
import { View } from 'react-native';
import { T } from '../theme';

interface ProgressBarProps {
  value: number;
  max?: number;
  height?: number;
}

export const ProgressBar = ({ value, max = 100, height = 6 }: ProgressBarProps) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View style={{ height, backgroundColor: 'rgba(60,60,67,0.10)', borderRadius: 99, overflow: 'hidden' }}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: T.brand, borderRadius: 99 }} />
    </View>
  );
};
