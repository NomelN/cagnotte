import React from 'react';
import { View, ViewStyle } from 'react-native';
import { T } from '../theme';

interface StepProgressProps {
  total: number;
  current: number;
  style?: ViewStyle;
}

export const StepProgress = ({ total, current, style }: StepProgressProps) => (
  <View style={[{ flexDirection: 'row', gap: 6 }, style]}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={{
          flex: 1,
          height: 4,
          borderRadius: 99,
          backgroundColor: i < current ? T.brand : T.field,
        }}
      />
    ))}
  </View>
);
