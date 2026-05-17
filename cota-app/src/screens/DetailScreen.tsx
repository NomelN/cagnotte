import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { Avatar } from '../components/Avatar';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { BackIcon, DotsIcon, ShareIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';
import { DetailSkeleton } from './states/DetailSkeleton';
import { EmptyPotDetail } from './states/EmptyPotDetail';

type Nav = StackNavigationProp<HomeStackParamList>;
type DetailRoute = RouteProp<HomeStackParamList, 'Detail'>;

const RING_R = 92;
const RING_STROKE = 11;
const RING_C = 2 * Math.PI * RING_R;
const RING_OFFSET = RING_C * (1 - 0.62);

const CONTRIBUTIONS = [
  { initials: 'T', tone: 'amber'  as const, name: 'Thomas',  ago: "Aujourd'hui", amount: '50 €',  dot: true  },
  { initials: 'J', tone: 'green'  as const, name: 'Julie',   ago: 'Hier',        amount: '30 €',  dot: true  },
  { initials: 'M', tone: 'blue'   as const, name: 'Marc',    ago: '12 mai 2024', amount: '100 €', dot: false },
  { initials: 'S', tone: 'pink'   as const, name: 'Sophie',  ago: '10 mai 2024', amount: '20 €',  dot: false },
];

export const DetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<DetailRoute>();
  const isNew = route.params?.isNew ?? false;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(id);
  }, []);

  if (loading) return <DetailSkeleton />;
  if (isNew) return <EmptyPotDetail />;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Green header */}
        <LinearGradient
          colors={[T.brand, T.brandDeep]}
          start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.headerGrad, { paddingTop: insets.top + 8 }]}
        >
          {/* Nav row */}
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <BackIcon size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginHorizontal: 12, alignItems: 'center' }}>
              <Text style={styles.navTitle} numberOfLines={1}>Vacances en famille</Text>
              <Text style={styles.navSub}>Créée le 10 mai 2024</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn}>
              <DotsIcon size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Ring */}
          <View style={{ alignItems: 'center', marginVertical: 8 }}>
            <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={220} height={220} viewBox="0 0 220 220" style={{ position: 'absolute' }}>
                <Circle cx={110} cy={110} r={RING_R} stroke="rgba(255,255,255,0.25)" strokeWidth={RING_STROKE} fill="none"/>
                <Circle cx={110} cy={110} r={RING_R} stroke="rgba(255,255,255,0.95)" strokeWidth={RING_STROKE} fill="none"
                  strokeDasharray={`${RING_C}`} strokeDashoffset={RING_OFFSET}
                  strokeLinecap="round" rotation="-90" origin="110,110"/>
              </Svg>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.ringAmount}>1 250 €</Text>
                <Text style={styles.ringSub}>sur 2 000 €</Text>
                <View style={styles.ringBadge}><Text style={styles.ringBadgeText}>62%</Text></View>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[{ v: '12', l: 'Participants' }, { v: '750 €', l: 'Reste' }, { v: '25', l: 'Jours' }].map(s => (
              <View key={s.l} style={{ alignItems: 'center' }}>
                <Text style={styles.statVal}>{s.v}</Text>
                <Text style={styles.statLbl}>{s.l}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Contributions */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <Text style={styles.cardTitle}>Contributions récentes</Text>
            <Text style={{ fontSize: 13, color: T.ink3 }}>23 au total</Text>
          </View>
          {CONTRIBUTIONS.map((c, i) => (
            <View key={i}>
              <View style={styles.contribRow}>
                <View style={{ position: 'relative' }}>
                  <Avatar initials={c.initials} size={42} tone={c.tone} />
                  {c.dot && <View style={styles.dot} />}
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.contribName}>{c.name}</Text>
                  <Text style={styles.contribAgo}>{c.ago}</Text>
                </View>
                <Text style={styles.contribAmount}>{c.amount}</Text>
              </View>
              {i < CONTRIBUTIONS.length - 1 && <View style={styles.sep} />}
            </View>
          ))}
          <TouchableOpacity style={{ paddingTop: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: T.brand, fontWeight: '600' }}>Voir toutes les contributions →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 8 }]}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1.6 }}>
            <PrimaryButton onPress={() => navigation.navigate('Contribute')}>Contribuer</PrimaryButton>
          </View>
          <View style={{ flex: 1 }}>
            <SecondaryButton onPress={() => navigation.navigate('Share')}>↑ Partager</SecondaryButton>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerGrad: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28, paddingBottom: 28, paddingHorizontal: 20 },
  navRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  navSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  ringAmount: { fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: -0.8 },
  ringSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  ringBadge: { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, marginTop: 8 },
  ringBadgeText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  statVal: { fontSize: 20, fontWeight: '700', color: '#fff' },
  statLbl: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  card: { margin: 20, backgroundColor: T.surface, borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: T.ink, letterSpacing: -0.3 },
  contribRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  dot: { position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: 6, backgroundColor: T.brand, borderWidth: 2, borderColor: T.surface },
  contribName: { fontSize: 15, fontWeight: '600', color: T.ink },
  contribAgo: { fontSize: 12, color: T.ink3, marginTop: 1 },
  contribAmount: { fontSize: 16, fontWeight: '600', color: T.ink },
  sep: { height: 0.5, backgroundColor: T.sep, marginLeft: 54 },
  cta: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(242,242,247,0.97)', borderTopWidth: 0.5, borderTopColor: T.sep },
});
