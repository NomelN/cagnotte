import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../../theme';
import { Skeleton } from '../../components/Skeleton';
import { Spinner } from '../../components/Spinner';

export const DetailSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" />

      {/* Green header renders immediately — perceived speed */}
      <LinearGradient
        colors={[T.brand, T.brandDeep]}
        start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.navRow}>
          <Skeleton width={40} height={40} radius={20} onDark />
          <Skeleton width={160} height={18} onDark />
          <Skeleton width={40} height={40} radius={20} onDark />
        </View>

        {/* Spinner where the ring will be */}
        <View style={{ alignItems: 'center', justifyContent: 'center', height: 220 }}>
          <Spinner size={120} stroke={3} color="#fff" trackColor="rgba(255,255,255,0.25)" arc={0.25} durationMs={1100} />
        </View>

        <View style={styles.statsRow}>
          {[0, 1, 2].map(i => (
            <View key={i} style={{ alignItems: 'center', gap: 6 }}>
              <Skeleton width={36} height={18} onDark />
              <Skeleton width={52} height={10} onDark />
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Body skeleton */}
      <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
        <View style={styles.bodyHeader}>
          <Skeleton width={180} height={18} />
          <Skeleton width={70} height={12} />
        </View>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={styles.row}>
            <Skeleton width={40} height={40} radius={20} />
            <View style={{ flex: 1, gap: 6 }}>
              <Skeleton width="45%" height={14} />
              <Skeleton width="25%" height={10} />
            </View>
            <Skeleton width={46} height={14} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28, paddingBottom: 24, paddingHorizontal: 20 },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  bodyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
});
