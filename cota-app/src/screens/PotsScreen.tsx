import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { ProgressBar } from '../components/ProgressBar';
import { PotThumb } from '../components/PotThumb';
import { PrimaryButton } from '../components/Button';
import { BellIcon, PlusIcon, PotsInactiveIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';
import { useOwnedPots } from '../data/hooks';

type Nav = StackNavigationProp<HomeStackParamList>;

export const PotsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { pots, loading, refresh } = useOwnedPots();

  // Refresh on focus so freshly-created pots show up without restarting.
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const goCreate = () => navigation.navigate('CreateCategory');

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      {/* Header — title, + (primary create action), bell. Mirrors Home for
          visual consistency across the two main listing tabs. */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Cagnottes</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={[styles.iconCircle, styles.iconCirclePrimary]}
            onPress={goCreate}
            accessibilityLabel="Créer une cagnotte"
            activeOpacity={0.85}
          >
            <PlusIcon size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <BellIcon size={22} color={T.ink3} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {loading ? (
          <ActivityIndicator color={T.brand} style={{ marginTop: 32 }} />
        ) : !pots || pots.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <PotsInactiveIcon size={28} />
            </View>
            <Text style={styles.emptyTitle}>Aucune cagnotte</Text>
            <Text style={styles.emptySub}>
              Lancez votre première cagnotte en quelques secondes.
            </Text>
            <View style={{ marginTop: 22, alignSelf: 'stretch', paddingHorizontal: 28 }}>
              <PrimaryButton onPress={goCreate}>Créer une cagnotte</PrimaryButton>
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20, gap: 10, paddingTop: 4 }}>
            {pots.map(pot => (
              <TouchableOpacity
                key={pot.id}
                style={styles.potCard}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('Detail', { potId: pot.id })}
              >
                <PotThumb coverUrl={pot.coverUrl} fallbackType={pot.thumb} size={64} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.potTitle}>{pot.title}</Text>
                  <Text style={styles.potAmounts}>
                    {pot.raised} <Text style={{ color: T.ink4 }}>/ {pot.goal}</Text>
                  </Text>
                  <View style={{ marginTop: 6 }}>
                    <ProgressBar value={pot.pct} height={5} />
                  </View>
                </View>
                <Text style={styles.pctText}>{pot.pct}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 12, marginBottom: 4,
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: T.ink, letterSpacing: -0.5 },
  iconCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
  },
  iconCirclePrimary: {
    backgroundColor: T.brand,
    shadowColor: T.brand,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  potCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: T.surface, borderRadius: 18, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6,
  },
  potTitle: { fontSize: 16, fontWeight: '700', color: T.ink, letterSpacing: -0.2, marginBottom: 2 },
  potAmounts: { fontSize: 13, color: T.ink3 },
  pctText: { fontSize: 13, fontWeight: '600', color: T.ink2 },
  empty: { paddingHorizontal: 28, paddingTop: 40, alignItems: 'center' },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: T.ink, textAlign: 'center' },
  emptySub: { fontSize: 14, color: T.ink3, marginTop: 6, lineHeight: 20, textAlign: 'center' },
});
