import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { G, Rect, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing,
} from 'react-native-reanimated';
import { T } from '../../theme';
import { Thumb } from '../../components/Thumb';
import { PrimaryButton } from '../../components/Button';
import { CheckIcon, ShareIcon, BellIcon } from '../../icons/Icons';
import { HomeStackParamList } from '../../navigation';

type Nav = StackNavigationProp<HomeStackParamList, 'SuccessContribution'>;
type Rt = RouteProp<HomeStackParamList, 'SuccessContribution'>;

const formatAmount = (n: number) =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const Confetti = () => (
  <Svg width="100%" height={56} viewBox="0 0 380 56" preserveAspectRatio="none" style={styles.confetti}>
    <G fill="#fff">
      <Rect x="34" y="10" width="6" height="2" rx="1" rotation={20} origin="37, 11" />
      <Rect x="78" y="30" width="5" height="2" rx="1" />
      <Rect x="120" y="6" width="6" height="2" rx="1" rotation={-25} origin="123, 7" opacity={0.75} />
      <Rect x="190" y="22" width="7" height="2" rx="1" rotation={40} origin="193, 23" />
      <Rect x="248" y="8" width="5" height="2" rx="1" opacity={0.8} />
      <Rect x="306" y="32" width="6" height="2" rx="1" rotation={-15} origin="309, 33" />
      <Rect x="346" y="14" width="4" height="2" rx="1" />
      <Circle cx="56" cy="40" r="1.6" opacity={0.6} />
      <Circle cx="158" cy="44" r="1.6" />
      <Circle cx="278" cy="46" r="1.6" opacity={0.7} />
      <Circle cx="220" cy="6" r="1.5" opacity={0.5} />
    </G>
  </Svg>
);

export const SuccessContributionScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const amount = route.params?.amount ?? 50;

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.94, { duration: 1250, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1250, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, [pulse]);
  const medalStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  // The contribute flow doesn't yet carry a potId end-to-end — it will when
  // Stripe is wired. For now, return the user to home rather than guessing.
  const goToPot = () => navigation.navigate('HomeMain');

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {/* Hero band */}
        <LinearGradient
          colors={[T.brand, T.brandDeep]}
          start={{ x: 0.15, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 8 }]}
        >
          <View style={styles.heroTop}>
            <TouchableOpacity style={styles.closeBtn} onPress={goToPot}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
          </View>

          <Confetti />

          <Animated.View style={[styles.medalOuter, medalStyle]}>
            <View style={styles.medalInner}>
              <CheckIcon size={40} color={T.brand} />
            </View>
          </Animated.View>

          <Text style={styles.heroTitle}>C'est fait !</Text>
          <Text style={styles.heroSub}>
            <Text style={{ fontWeight: '700' }}>{formatAmount(amount)}</Text> envoyés à Alexandre pour{' '}
            <Text style={{ fontWeight: '600' }}>Vacances Bali</Text>.
          </Text>
        </LinearGradient>

        {/* Updated progress */}
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
          <View style={styles.potRow}>
            <Thumb type="beach" size={48} radius={12} />
            <View style={{ flex: 1 }}>
              <Text style={styles.potTitle}>Vacances en famille — Bali</Text>
              <Text style={styles.potSub}>1 300 € sur 2 000 €</Text>
            </View>
            <View style={styles.deltaBadge}>
              <Text style={styles.deltaText}>+2,5%</Text>
            </View>
          </View>

          {/* Progress bar with "you" marker */}
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: '62.5%' }]} />
            <View style={[styles.barYou, { left: '62.5%' }]} />
            <View style={[styles.barMarker, { left: '65%' }]} />
          </View>
          <Text style={[styles.markerLabel, { left: '65%' }]}>↑ Vous · {amount} €</Text>
        </View>

        {/* Action grid */}
        <View style={{ paddingHorizontal: 18, paddingTop: 34, flexDirection: 'row', gap: 10 }}>
          {[
            { Icon: ShareIcon, label: 'Partager', sub: 'Inviter vos proches' },
            { Icon: BellIcon, label: "M'avertir", sub: 'Suivre la progression' },
          ].map(({ Icon, label, sub }) => (
            <TouchableOpacity key={label} style={styles.actionCard} activeOpacity={0.8}>
              <View style={styles.actionIcon}>
                <Icon size={18} color={T.brand} />
              </View>
              <Text style={styles.actionLabel}>{label}</Text>
              <Text style={styles.actionSub}>{sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Receipt */}
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
          <Text style={styles.receiptLabel}>Reçu</Text>
          <View style={styles.receiptCard}>
            {([
              ['Montant', formatAmount(amount)],
              ['Pour', 'Vacances Bali · Alexandre M.'],
              ['Carte', 'Visa •• 1234'],
              ['Référence', 'COTA-A41F92'],
            ] as [string, string][]).map(([k, v], i, arr) => (
              <View key={k} style={[styles.receiptRow, i < arr.length - 1 && styles.receiptRowBorder]}>
                <Text style={styles.receiptKey}>{k}</Text>
                <Text style={styles.receiptValue}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 8 }]}>
        <PrimaryButton onPress={goToPot}>Retour à la cagnotte</PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 36, paddingHorizontal: 0,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden',
  },
  heroTop: { alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: 4 },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeX: { color: '#fff', fontSize: 18, fontWeight: '500' },
  confetti: { position: 'absolute', top: 54, left: 0, opacity: 0.75 },
  medalOuter: {
    width: 108, height: 108, borderRadius: 54, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 12,
  },
  medalInner: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 28, fontWeight: '700', letterSpacing: -0.6, color: '#fff',
    textAlign: 'center', marginTop: 18,
  },
  heroSub: {
    fontSize: 15, color: 'rgba(255,255,255,0.92)', textAlign: 'center',
    marginTop: 10, lineHeight: 21, paddingHorizontal: 28,
  },
  potRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  potTitle: { fontSize: 14, fontWeight: '600', color: T.ink },
  potSub: { fontSize: 12, color: T.ink3, marginTop: 1 },
  deltaBadge: { backgroundColor: T.brandSoft, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
  deltaText: { fontSize: 13, fontWeight: '700', color: T.brand },
  barTrack: {
    height: 10, backgroundColor: 'rgba(60,60,67,0.10)', borderRadius: 99, marginTop: 4,
  },
  barFill: { position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: T.brand, borderRadius: 99 },
  barYou: { position: 'absolute', top: 0, height: '100%', width: '2.5%', backgroundColor: '#fff' },
  barMarker: {
    position: 'absolute', top: -2, width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#fff', borderWidth: 3, borderColor: T.brand, marginLeft: -7,
  },
  markerLabel: {
    position: 'absolute', top: 38, fontSize: 11, fontWeight: '700', color: T.brand,
    marginLeft: -34, width: 68, textAlign: 'center',
  },
  actionCard: {
    flex: 1, backgroundColor: T.surface, borderRadius: 14, padding: 14, gap: 8,
    borderWidth: 1, borderColor: T.sep,
  },
  actionIcon: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { fontSize: 14, fontWeight: '600', color: T.ink },
  actionSub: { fontSize: 11, color: T.ink3, marginTop: -4 },
  receiptLabel: {
    fontSize: 12, color: T.ink3, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingHorizontal: 4,
  },
  receiptCard: {
    backgroundColor: T.surface, borderRadius: 16, paddingHorizontal: 16,
    borderWidth: 1, borderColor: T.sep,
  },
  receiptRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12,
  },
  receiptRowBorder: { borderBottomWidth: 0.5, borderBottomColor: T.sep },
  receiptKey: { fontSize: 13, color: T.ink3 },
  receiptValue: { fontSize: 14, fontWeight: '600', color: T.ink },
  cta: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 18, paddingTop: 12,
    backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: T.sep,
  },
});
