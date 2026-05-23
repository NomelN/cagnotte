import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { ProgressBar } from '../components/ProgressBar';
import { Thumb } from '../components/Thumb';
import { PrimaryButton } from '../components/Button';
import { BellIcon, PotsInactiveIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';
import { useOwnedPots, useContributedPots } from '../data/hooks';

type Nav = StackNavigationProp<HomeStackParamList>;

const TABS = ['Mes cagnottes', 'Contributions'] as const;
type Tab = typeof TABS[number];

const InlineEmpty = ({ title, sub }: { title: string; sub: string }) => (
  <View style={styles.empty}>
    <View style={styles.emptyIcon}>
      <PotsInactiveIcon size={28} />
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptySub}>{sub}</Text>
  </View>
);

export const PotsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<Tab>('Mes cagnottes');
  const { pots: myPots, loading: loadingMine, refresh: refreshMine } = useOwnedPots();
  const { items: contributions, loading: loadingContribs, refresh: refreshContribs } = useContributedPots();

  // Refresh both lists when the tab comes back into focus so newly created
  // pots / contributions appear without restarting the app.
  useFocusEffect(useCallback(() => {
    refreshMine();
    refreshContribs();
  }, [refreshMine, refreshContribs]));

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Cagnottes</Text>
        <TouchableOpacity style={styles.iconCircle}>
          <BellIcon size={22} color={T.ink3} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {activeTab === 'Mes cagnottes' ? (
          loadingMine ? (
            <ActivityIndicator color={T.brand} style={{ marginTop: 24 }} />
          ) : !myPots || myPots.length === 0 ? (
            <InlineEmpty
              title="Aucune cagnotte"
              sub="Créez votre première cagnotte avec le bouton ci-dessous."
            />
          ) : (
            <View style={{ paddingHorizontal: 20, gap: 10, paddingTop: 4 }}>
              {myPots.map(pot => (
                <TouchableOpacity key={pot.id} style={styles.potCard} activeOpacity={0.75}
                  onPress={() => navigation.navigate('Detail', { potId: pot.id })}>
                  <Thumb type={pot.thumb} size={64} />
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
          )
        ) : (
          loadingContribs ? (
            <ActivityIndicator color={T.brand} style={{ marginTop: 24 }} />
          ) : !contributions || contributions.length === 0 ? (
            <InlineEmpty
              title="Aucune contribution"
              sub="Vos participations à des cagnottes apparaîtront ici."
            />
          ) : (
            <View style={{ paddingHorizontal: 20, gap: 10, paddingTop: 4 }}>
              {contributions.map((c, i) => (
                <TouchableOpacity key={i} style={styles.potCard} activeOpacity={0.75}
                  onPress={() => navigation.navigate('Detail', { potId: c.pot.id })}>
                  <Thumb type={c.pot.thumb} size={64} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.potTitle}>{c.pot.title}</Text>
                    <Text style={styles.potAmounts}>
                      {c.pot.raised} <Text style={{ color: T.ink4 }}>/ {c.pot.goal}</Text>
                    </Text>
                    <View style={{ marginTop: 6 }}>
                      <ProgressBar value={c.pot.pct} height={5} />
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={styles.contribAmount}>{c.amount}</Text>
                    <Text style={styles.metaText}>{c.date}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )
        )}
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 8 }]}>
        <PrimaryButton onPress={() => navigation.navigate('CreateCategory')}>
          + Créer une cagnotte
        </PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 12,
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: T.ink, letterSpacing: -0.5 },
  iconCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
  },
  tabRow: {
    flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99,
    backgroundColor: T.surface, borderWidth: 1, borderColor: T.sep,
  },
  tabActive: { backgroundColor: T.brand, borderColor: T.brand },
  tabText: { fontSize: 14, fontWeight: '500', color: T.ink2 },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  potCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: T.surface, borderRadius: 18, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6,
  },
  potTitle: { fontSize: 16, fontWeight: '700', color: T.ink, letterSpacing: -0.2, marginBottom: 2 },
  potAmounts: { fontSize: 13, color: T.ink3 },
  potMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  metaText: { fontSize: 11, color: T.ink4 },
  metaDot: { fontSize: 11, color: T.ink4 },
  pctText: { fontSize: 13, fontWeight: '600', color: T.ink2 },
  contribAmount: { fontSize: 15, fontWeight: '700', color: T.brand },
  empty: {
    paddingHorizontal: 28, paddingTop: 40, alignItems: 'center',
  },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: T.ink, textAlign: 'center' },
  emptySub: { fontSize: 14, color: T.ink3, marginTop: 6, lineHeight: 20, textAlign: 'center' },
  cta: {
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: 'rgba(242,242,247,0.97)',
    borderTopWidth: 0.5, borderTopColor: T.sep,
  },
});
