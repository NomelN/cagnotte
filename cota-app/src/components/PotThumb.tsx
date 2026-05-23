import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Thumb } from './Thumb';
import type { ThumbType } from '../data/types';

interface PotThumbProps {
  coverUrl: string | null | undefined;
  fallbackType: ThumbType;
  size?: number;
  radius?: number;
}

// Renders the user-uploaded cover when available, otherwise falls back to the
// stylized category Thumb. Keeps callers free of conditional render logic.
export const PotThumb = ({ coverUrl, fallbackType, size = 64, radius = 14 }: PotThumbProps) => {
  if (coverUrl) {
    return (
      <Image
        source={{ uri: coverUrl }}
        style={[styles.image, { width: size, height: size, borderRadius: radius }]}
      />
    );
  }
  return <Thumb type={fallbackType} size={size} radius={radius} />;
};

const styles = StyleSheet.create({
  image: { resizeMode: 'cover', backgroundColor: '#eee' },
});
