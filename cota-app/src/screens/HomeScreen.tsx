import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { T } from '../theme';
import { ProgressBar } from '../components/ProgressBar';
import { Thumb } from '../components/Thumb';
import { BellIcon, EyeIcon, ArrowRIcon, PlusIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';
import { useOwnedPots, useProfile, formatEur } from '../data/hooks';
import { HomeSkeleton } from './states/HomeSkeleton';
import { EmptyHome } from './states/EmptyHome';

type Nav = StackNavigationProp<HomeStackParamList>;

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<Nav>();
  const { pots, loading, refresh } = useOwnedPots();
  const { profile } = useProfile();
  const [balanceHidden, setBalanceHidden] = useState(false);

  // Re-fetch every time this screen comes back into focus (e.g. after
  // creating a new pot) so newly created cagnottes show up immediately.
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  if (loading) return <HomeSkeleton />;
  if (!pots || pots.length === 0) return <EmptyHome />;

  const totalRaisedCents = pots.reduce((sum, p) => sum + p.raisedCents, 0);
  const firstName = profile?.first_name ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetSmall}>Bonjour,</Text>
            <Text style={styles.greetName}>{firstName}</Text>
          </View>
          <TouchableOpacity style={styles.iconCircle}>
            <BellIcon size={22} color={T.ink3} />
          </TouchableOpacity>
        </View>

        {/* Hero card */}
        <LinearGradient
          colors={[T.brand, T.brandDeep]}
          start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Svg width="100%" height="60" viewBox="0 0 360 60" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <Path d="M0 40 Q60 20 120 35 Q180 50 240 30 Q300 10 360 25 L360 60 L0 60 Z" fill="rgba(255,255,255,0.12)"/>
            <Path d="M0 50 Q80 30 160 45 Q240 60 320 40 L360 45 L360 60 L0 60 Z" fill="rgba(255,255,255,0.08)"/>
          </Svg>
          <View style={styles.heroTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={styles.heroLabel}>Solde disponible</Text>
              <TouchableOpacity
                style={{ marginLeft: 8, padding: 4 }}
                onPress={() => setBalanceHidden(v => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <EyeIcon size={16} color={balanceHidden ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.9)'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroAmount}>
              {balanceHidden ? '•••• €' : formatEur(totalRaisedCents)}
            </Text>
            <Text style={styles.heroSub}>
              {pots.length === 1
                ? 'réparti sur 1 cagnotte active'
                : `réparti sur ${pots.length} cagnottes actives`}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <TouchableOpacity
              style={styles.heroArrowBtn}
              disabled={!pots[0]}
              onPress={() => pots[0] && navigation.navigate('Detail', { potId: pots[0].id })}
            >
              <ArrowRIcon size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes cagnottes</Text>
          <TouchableOpacity><Text style={{ fontSize: 15, color: T.brand, fontWeight: '500' }}>Voir tout</Text></TouchableOpacity>
        </View>

        {/* Pots list */}
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {pots.map(pot => (
            <TouchableOpacity key={pot.id} style={styles.potRow} activeOpacity={0.75}
              onPress={() => navigation.navigate('Detail', { potId: pot.id })}>
              <Thumb type={pot.thumb} size={64} />
              <View style={{ flex: 1 }}>
                <Text style={styles.potTitle}>{pot.title}</Text>
                <Text style={styles.potAmounts}>{pot.raised} <Text style={{ color: T.ink4 }}>/ {pot.goal}</Text></Text>
                <View style={{ marginTop: 6 }}>
                  <ProgressBar value={pot.pct} height={5} />
                </View>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: T.ink2 }}>{pot.pct}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating action button — replaces the sticky "+ Créer une cagnotte"
          footer to free up screen real estate. Positioned above the tab bar. */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CreateCategory')}
        accessibilityLabel="Créer une cagnotte"
        style={[styles.fab, { bottom: tabBarHeight + 16 }]}
      >
        <PlusIcon size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  greetSmall: { fontSize: 14, color: T.ink3 },
  greetName: { fontSize: 28, fontWeight: '700', color: T.ink, letterSpacing: -0.5, marginTop: 2 },
  iconCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
  },
  heroCard: {
    marginHorizontal: 20, borderRadius: 24,
    paddingHorizontal: 24, paddingVertical: 24,
    overflow: 'hidden', minHeight: 160,
  },
  heroTop: { zIndex: 1 },
  heroLabel: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  heroAmount: { fontSize: 38, fontWeight: '700', color: '#fff', letterSpacing: -1, marginBottom: 4 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  heroArrowBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 28, marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: T.ink, letterSpacing: -0.3 },
  potRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: T.surface, borderRadius: 16, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6,
  },
  potTitle: { fontSize: 17, fontWeight: '700', color: T.ink, letterSpacing: -0.2, marginBottom: 2 },
  potAmounts: { fontSize: 13, color: T.ink3 },
  fab: {
    position: 'absolute',
    right: 20,
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: T.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
