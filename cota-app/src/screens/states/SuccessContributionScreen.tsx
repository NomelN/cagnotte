import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Share, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { G, Rect, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing,
} from 'react-native-reanimated';
import { T } from '../../theme';
import { PotThumb } from '../../components/PotThumb';
import { PrimaryButton } from '../../components/Button';
import { CheckIcon, ShareIcon, ArrowRIcon } from '../../icons/Icons';
import { HomeStackParamList } from '../../navigation';
import { supabase } from '../../lib/supabase';
import { formatEur } from '../../data/hooks';
import type { ThumbType } from '../../data/types';

type Nav = StackNavigationProp<HomeStackParamList, 'SuccessContribution'>;
type Rt = RouteProp<HomeStackParamList, 'SuccessContribution'>;

const CATEGORY_THUMB: Record<string, ThumbType> = {
  travel: 'beach', birthday: 'gift', wedding: 'gift',
  baby: 'gift', solidarity: 'house', other: 'gift',
};

const brandLabel = (b: string | null) =>
  b ? b.charAt(0).toUpperCase() + b.slice(1) : 'Carte';

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

interface Loaded {
  potTitle: string;
  category: string;
  coverUrl: string | null;
  goalCents: number;
  raisedCents: number;
  ownerLabel: string;     // "Alexandre M." or "Alexandre" or "L'organisateur"
  ownerFirstName: string; // "Alexandre" or "L'organisateur"
  cardBrand: string | null;
  cardLast4: string | null;
}

export const SuccessContributionScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { potId, amount, contributionId, cardId } = route.params;

  const [data, setData] = useState<Loaded | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: pot }, { data: card }] = await Promise.all([
        supabase
          .from('pots')
          .select('title, category, cover_url, goal_amount_cents, raised_amount_cents, owner_id')
          .eq('id', potId)
          .maybeSingle(),
        supabase
          .from('payment_methods')
          .select('brand, last4')
          .eq('id', cardId)
          .maybeSingle(),
      ]);
      if (cancelled || !pot) return;

      const { data: owner } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', pot.owner_id)
        .maybeSingle();
      if (cancelled) return;

      const first = owner?.first_name?.trim() || '';
      const last = owner?.last_name?.trim() || '';
      const ownerFirstName = first || "L'organisateur";
      const ownerLabel =
        first && last ? `${first} ${last.charAt(0).toUpperCase()}.` :
        first || "L'organisateur";

      setData({
        potTitle: pot.title,
        category: pot.category,
        coverUrl: pot.cover_url,
        goalCents: pot.goal_amount_cents,
        raisedCents: pot.raised_amount_cents,
        ownerFirstName,
        ownerLabel,
        cardBrand: card?.brand ?? null,
        cardLast4: card?.last4 ?? null,
      });
    })();
    return () => { cancelled = true; };
  }, [potId, cardId]);

  const goToPot = () => navigation.navigate('Detail', { potId });

  const sharePot = async () => {
    try {
      const url = `https://cota.app/pot/${potId}`;
      const title = data?.potTitle ?? 'Cota';
      await Share.share({
        message: `Soutiens la cagnotte « ${title} » sur Cota : ${url}`,
        url,
      });
    } catch { /* user cancelled */ }
  };

  if (!data) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={T.brand} />
      </View>
    );
  }

  const amountCents = Math.round(amount * 100);
  const pct = data.goalCents > 0
    ? Math.min(100, (data.raisedCents / data.goalCents) * 100)
    : 0;
  const pctLabel = `${Math.round(pct)}%`;
  const deltaPct = data.goalCents > 0 ? (amountCents / data.goalCents) * 100 : 0;
  const deltaLabel = `+${deltaPct.toFixed(deltaPct < 1 ? 2 : 1)}%`;

  const reference = `COTA-${contributionId.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  const cardLine = data.cardLast4
    ? `${brandLabel(data.cardBrand)} •• ${data.cardLast4}`
    : 'Carte enregistrée';

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
            <Text style={{ fontWeight: '700' }}>{formatEur(amountCents)}</Text>
            {' envoyés à '}
            <Text style={{ fontWeight: '600' }}>{data.ownerFirstName}</Text>
            {' pour '}
            <Text style={{ fontWeight: '600' }}>{data.potTitle}</Text>.
          </Text>
        </LinearGradient>

        {/* Updated progress */}
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
          <View style={styles.potRow}>
            <PotThumb
              coverUrl={data.coverUrl}
              fallbackType={CATEGORY_THUMB[data.category] ?? 'gift'}
              size={48}
              radius={12}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.potTitle} numberOfLines={1}>{data.potTitle}</Text>
              <Text style={styles.potSub}>
                {`${formatEur(data.raisedCents)} sur ${formatEur(data.goalCents)}`}
              </Text>
            </View>
            <View style={styles.deltaBadge}>
              <Text style={styles.deltaText}>{deltaLabel}</Text>
            </View>
          </View>

          {/* Progress bar — fill reflects real total post-contribution. */}
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.pctLabel}>{`${pctLabel} de l'objectif atteint`}</Text>
        </View>

        {/* Action grid */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={sharePot}>
            <View style={styles.actionIcon}>
              <ShareIcon size={18} color={T.brand} />
            </View>
            <Text style={styles.actionLabel}>Partager</Text>
            <Text style={styles.actionSub}>Inviter vos proches</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={goToPot}>
            <View style={styles.actionIcon}>
              <ArrowRIcon size={18} color={T.brand} />
            </View>
            <Text style={styles.actionLabel}>Voir la cagnotte</Text>
            <Text style={styles.actionSub}>Suivre la progression</Text>
          </TouchableOpacity>
        </View>

        {/* Receipt */}
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
          <Text style={styles.receiptLabel}>Reçu</Text>
          <View style={styles.receiptCard}>
            {([
              ['Montant', formatEur(amountCents)],
              ['Pour', `${data.potTitle} · ${data.ownerLabel}`],
              ['Carte', cardLine],
              ['Référence', reference],
            ] as [string, string][]).map(([k, v], i, arr) => (
              <View key={k} style={[styles.receiptRow, i < arr.length - 1 && styles.receiptRowBorder]}>
                <Text style={styles.receiptKey}>{k}</Text>
                <Text style={styles.receiptValue} numberOfLines={1}>{v}</Text>
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
    overflow: 'hidden',
  },
  barFill: { position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: T.brand, borderRadius: 99 },
  pctLabel: { fontSize: 12, color: T.ink3, marginTop: 8, fontWeight: '500' },
  actionRow: { paddingHorizontal: 18, paddingTop: 34, flexDirection: 'row', gap: 10 },
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
    gap: 12,
  },
  receiptRowBorder: { borderBottomWidth: 0.5, borderBottomColor: T.sep },
  receiptKey: { fontSize: 13, color: T.ink3 },
  receiptValue: { fontSize: 14, fontWeight: '600', color: T.ink, flexShrink: 1, textAlign: 'right' },
  cta: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 18, paddingTop: 12,
    backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: T.sep,
  },
});
