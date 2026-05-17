import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

type ThumbType = 'beach' | 'gift' | 'house';

interface ThumbProps {
  type: ThumbType;
  size?: number;
  radius?: number;
}

export const Thumb = ({ type, size = 64, radius = 14 }: ThumbProps) => {
  if (type === 'beach') return (
    <LinearGradient
      colors={['#79C6E9', '#8FD7DC', '#F4D67E', '#E2B25A']}
      style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden' }}
    >
      <Svg viewBox="0 0 64 64" width={size} height={size}>
        <Circle cx="50" cy="14" r="6" fill="#FFE9A0"/>
        <Path d="M0 44 Q 16 38 32 42 T 64 40 L 64 64 L 0 64 Z" fill="#E2B25A"/>
        <Path d="M14 44 l-2 -16 m2 16 c-3 -6 -8 -8 -12 -7 m12 7 c-1 -7 2 -12 6 -14 m-6 14 c4 -3 9 -3 13 -1" stroke="#3E6D2F" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      </Svg>
    </LinearGradient>
  );

  if (type === 'gift') return (
    <LinearGradient
      colors={['#F7C7D2', '#E59CB5', '#C16B92']}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden' }}
    >
      <Svg viewBox="0 0 64 64" width={size} height={size}>
        <Rect x="14" y="26" width="36" height="28" rx="2" fill="rgba(255,255,255,0.92)"/>
        <Rect x="29" y="22" width="6" height="34" fill="#9D3C5F"/>
        <Path d="M30 22c-6 -8 -16 -6 -16 0 s9 6 16 0z M34 22c6 -8 16 -6 16 0 s-9 6 -16 0z" fill="#9D3C5F"/>
      </Svg>
    </LinearGradient>
  );

  return (
    <LinearGradient
      colors={['#C9D6E6', '#DDD1B6', '#9B8463']}
      style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden' }}
    >
      <Svg viewBox="0 0 64 64" width={size} height={size}>
        <Path d="M6 38 L 32 16 L 58 38 L 58 56 L 6 56 Z" fill="#F4ECDD"/>
        <Path d="M6 38 L 32 16 L 58 38" stroke="#6F5836" strokeWidth="1.6" fill="none"/>
        <Rect x="26" y="40" width="12" height="16" fill="#6F5836"/>
        <Rect x="14" y="40" width="8" height="8" fill="#cdc"/>
        <Rect x="42" y="40" width="8" height="8" fill="#cdc"/>
      </Svg>
    </LinearGradient>
  );
};
