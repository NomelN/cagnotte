import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { ProgressBar } from '../components/ProgressBar';
import { Thumb } from '../components/Thumb';
import { Avatar } from '../components/Avatar';
import { PrimaryButton } from '../components/Button';
import { BellIcon, PlusIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';

type Nav = StackNavigationProp<HomeStackParamList>;

const MY_POTS = [
  { title: 'Vacances en famille', raised: '1 250 €', goal: '2 000 €', pct: 62, thumb: 'beach' as const, participants: 12, daysLeft: 25 },
  { title: 'Anniversaire Léa',    raised: '320 €',   goal: '500 €',   pct: 64, thumb: 'gift'  as const, participants: 8,  daysLeft: 5  },
  { title: 'Achat appartement',   raised: '9 450 €', goal: '20 000 €',pct: 47, thumb: 'house' as const, participants: 3,  daysLeft: 90 },
];

const CONTRIBUTIONS = [
  { title: 'Pot départ de Camille', raised: '480 €', goal: '600 €', pct: 80, thumb: 'gift'  as const, amount: '30 €', date: 'Hier' },
  { title: 'Road trip Bretagne',    raised: '850 €', goal: '1 500 €',pct: 57, thumb: 'beach' as const, amount: '50 €', date: '8 mai' },
];

const TABS = ['Mes cagnottes', 'Contributions'] as const;
type Tab = typeof TABS[number];

export const PotsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<Tab>('Mes cagnottes');

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
          <View style={{ paddingHorizontal: 20, gap: 10, paddingTop: 4 }}>
            {MY_POTS.map((pot, i) => (
              <TouchableOpacity key={i} style={styles.potCard} activeOpacity={0.75}
                onPress={() => navigation.navigate('Detail')}>
                <Thumb type={pot.thumb} size={64} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.potTitle}>{pot.title}</Text>
                  <Text style={styles.potAmounts}>
                    {pot.raised} <Text style={{ color: T.ink4 }}>/ {pot.goal}</Text>
                  </Text>
                  <View style={{ marginTop: 6 }}>
                    <ProgressBar value={pot.pct} height={5} />
                  </View>
                  <View style={styles.potMeta}>
                    <Text style={styles.metaText}>{pot.participants} participants</Text>
                    <Text style={styles.metaDot}>·</Text>
                    <Text style={styles.metaText}>{pot.daysLeft}j restants</Text>
                  </View>
                </View>
                <Text style={styles.pctText}>{pot.pct}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20, gap: 10, paddingTop: 4 }}>
            {CONTRIBUTIONS.map((c, i) => (
              <TouchableOpacity key={i} style={styles.potCard} activeOpacity={0.75}
                onPress={() => navigation.navigate('Detail')}>
                <Thumb type={c.thumb} size={64} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.potTitle}>{c.title}</Text>
                  <Text style={styles.potAmounts}>
                    {c.raised} <Text style={{ color: T.ink4 }}>/ {c.goal}</Text>
                  </Text>
                  <View style={{ marginTop: 6 }}>
                    <ProgressBar value={c.pct} height={5} />
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={styles.contribAmount}>{c.amount}</Text>
                  <Text style={styles.metaText}>{c.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  cta: {
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: 'rgba(242,242,247,0.97)',
    borderTopWidth: 0.5, borderTopColor: T.sep,
  },
});
