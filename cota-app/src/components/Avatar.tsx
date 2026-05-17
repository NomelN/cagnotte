import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../theme';

type Tone = 'neutral' | 'blue' | 'pink' | 'amber' | 'green' | 'violet';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: '#E5E5EA', fg: T.ink },
  blue:    { bg: '#D6E7FB', fg: '#1F5BBC' },
  pink:    { bg: '#F8DCE3', fg: '#A2335C' },
  amber:   { bg: '#FBE7C2', fg: '#8A5A12' },
  green:   { bg: T.brandSoft, fg: T.brandInk },
  violet:  { bg: '#E2D8F2', fg: '#5A2E96' },
};

interface AvatarProps {
  initials: string;
  size?: number;
  tone?: Tone;
}

export const Avatar = ({ initials, size = 40, tone = 'neutral' }: AvatarProps) => {
  const colors = TONES[tone];
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { fontSize: size * 0.38, color: colors.fg }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});
