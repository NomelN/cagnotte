import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { T } from '../theme';

interface SpinnerProps {
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  /** Fraction of the circle that is drawn (0–1). */
  arc?: number;
  durationMs?: number;
}

export const Spinner = ({
  size = 48,
  stroke = 4,
  color = T.brand,
  trackColor = T.field,
  arc = 0.3,
  durationMs = 1000,
}: SpinnerProps) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: durationMs, easing: Easing.linear }),
      -1,
    );
  }, [rotation, durationMs]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <Animated.View style={animatedStyle}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference * arc} ${circumference}`}
        />
      </Svg>
    </Animated.View>
  );
};
