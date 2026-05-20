import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../../theme';
import { CheckIcon } from '../../icons/Icons';

// 3-step progress used across the guest contribute → payment flow.
export const StepIndicator = ({ step }: { step: 1 | 2 | 3 }) => {
  const dots = [1, 2, 3] as const;
  return (
    <View style={styles.row}>
      {dots.map((n, i) => {
        const done = n < step;
        const active = n === step;
        const filled = done || active;
        return (
          <React.Fragment key={n}>
            <View style={[styles.dot, filled ? styles.dotFilled : styles.dotIdle]}>
              {done ? (
                <CheckIcon size={14} color="#fff" />
              ) : (
                <Text style={[styles.dotText, { color: active ? '#fff' : T.ink3 }]}>{n}</Text>
              )}
            </View>
            {i < dots.length - 1 && (
              <View style={[styles.bar, { backgroundColor: n < step ? T.brand : T.field }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  dotFilled: { backgroundColor: T.brand },
  dotIdle: { backgroundColor: T.field },
  dotText: { fontSize: 12, fontWeight: '700' },
  bar: { flex: 1, height: 2, borderRadius: 99 },
});
