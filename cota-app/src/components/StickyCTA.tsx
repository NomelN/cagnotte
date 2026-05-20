import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../theme';

interface StickyCTAProps {
  children: React.ReactNode;
  hint?: string;
}

export const StickyCTA = ({ children, hint }: StickyCTAProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: 'rgba(242,242,247,0.97)',
    borderTopWidth: 0.5,
    borderTopColor: T.sep,
  },
  hint: {
    fontSize: 12,
    color: T.ink3,
    textAlign: 'center',
    marginTop: 10,
  },
});
