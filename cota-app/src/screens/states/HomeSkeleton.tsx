import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../../theme';
import { Skeleton } from '../../components/Skeleton';

export const HomeSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View>
          <Skeleton width={60} height={14} style={{ marginBottom: 8 }} />
          <Skeleton width={140} height={26} />
        </View>
        <Skeleton width={42} height={42} radius={21} />
      </View>

      <View style={{ paddingHorizontal: 18 }}>
        {/* Hero — already coloured to reduce flash */}
        <LinearGradient
          colors={[T.brand, T.brandDeep]}
          start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Skeleton width={120} height={12} onDark style={{ marginBottom: 14 }} />
          <Skeleton width={180} height={32} onDark style={{ marginBottom: 10 }} />
          <Skeleton width={160} height={10} onDark />
        </LinearGradient>

        {/* List header */}
        <View style={styles.listHeader}>
          <Skeleton width={130} height={20} />
          <Skeleton width={70} height={14} />
        </View>

        {/* Pot rows */}
        <View style={{ gap: 10 }}>
          {[0, 1, 2].map(i => (
            <View key={i} style={styles.potRow}>
              <Skeleton width={64} height={64} radius={14} />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton width="70%" height={16} />
                <Skeleton width="40%" height={12} />
                <Skeleton width="100%" height={5} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 16,
  },
  hero: { borderRadius: 24, padding: 24, minHeight: 138 },
  listHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 22, marginBottom: 12,
  },
  potRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: T.surface, borderRadius: 18, padding: 12,
  },
});
