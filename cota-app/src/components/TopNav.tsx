import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../theme';

interface TopNavProps {
  title: string;
  sub?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  dark?: boolean;
}

export const TopNav = ({ title, sub, left, right, dark = false }: TopNavProps) => {
  const textColor = dark ? '#FFFFFF' : T.ink;
  const subColor = dark ? 'rgba(255,255,255,0.65)' : T.ink3;

  return (
    <View style={styles.container}>
      <View style={styles.side}>{left}</View>
      <View style={styles.center}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>{title}</Text>
        {sub ? <Text style={[styles.sub, { color: subColor }]}>{sub}</Text> : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 52,
  },
  side: {
    width: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  sub: {
    fontSize: 12,
    marginTop: 1,
  },
});
