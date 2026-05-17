import React, { useEffect } from 'react';
import { DimensionValue, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  /** Render light-on-dark (for use over the green header). */
  onDark?: boolean;
  style?: ViewStyle;
}

export const Skeleton = ({ width = '100%', height = 12, radius, onDark, style }: SkeletonProps) => {
  const progress = useSharedValue(0.5);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius ?? Math.min(height, 8),
          backgroundColor: onDark ? 'rgba(255,255,255,0.28)' : 'rgba(60,60,67,0.12)',
        },
        animatedStyle,
        style,
      ]}
    />
  );
};
