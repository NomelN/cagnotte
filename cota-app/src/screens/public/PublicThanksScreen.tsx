import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path } from 'react-native-svg';
import { T } from '../../theme';
import { PrimaryButton } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { ShareIcon } from '../../icons/Icons';
import { GuestStackParamList } from '../../navigation';
import { PublicTopBar, PoweredBy } from './_shared';

type Nav = StackNavigationProp<GuestStackParamList, 'GuestThanks'>;
type Rt = RouteProp<GuestStackParamList, 'GuestThanks'>;

const fmt = (n: number) => `${n},00 €`;

export const PublicThanksScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { amount } = useRoute<Rt>().params;

  const receipt: [string, string][] = [
    ['Montant', fmt(amount)],
    ['Carte', 'Visa •• 4242'],
    ['Référence', 'COTA-9F2B3K'],
    ['Reçu par email', 'camille.b@email.com'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Green hero band */}
        <LinearGradient
          colors={[T.brand, T.brandDeep]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top }]}
        >
          <PublicTopBar onBrand />

          <View style={styles.medalOuter}>
            <View style={styles.medalInner}>
              <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M5 12.5l4.5 4.5L20 6.5"
                  stroke={T.brand}
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          </View>

          <View style={{ paddingHorizontal: 28, paddingTop: 18, alignItems: 'center' }}>
            <Text style={styles.heroTitle}>Merci Camille !</Text>
            <Text style={styles.heroSub}>
              Votre contribution de <Text style={{ fontWeight: '700' }}>{fmt(amount)}</Text> a bien été
              envoyée à Alexandre.
            </Text>
          </View>
        </LinearGradient>

        {/* Updated progress */}
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardHeadTitle}>Vacances en famille — Bali</Text>
              <View style={styles.deltaBadge}>
                <View style={styles.deltaDot} />
                <Text style={styles.deltaText}>+2,5%</Text>
              </View>
            </View>
            <ProgressBar value={65} height={7} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={{ fontSize: 13, color: T.ink2 }}>
                <Text style={{ color: T.brandInk, fontWeight: '700' }}>1 300 €</Text> / 2 000 €
              </Text>
              <Text style={{ fontSize: 12, color: T.ink3 }}>65 % atteint</Text>
            </View>
          </View>
        </View>

        {/* Receipt */}
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
          <Text style={styles.label}>REÇU</Text>
          <View style={[styles.card, { paddingVertical: 0 }]}>
            {receipt.map(([k, v], i) => (
              <View
                key={k}
                style={[
                  styles.receiptRow,
                  i < receipt.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: T.sep },
                ]}
              >
                <Text style={{ fontSize: 13, color: T.ink3 }}>{k}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: T.ink }}>{v}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Share invite */}
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
          <View style={styles.shareCard}>
            <View style={styles.shareIcon}>
              <ShareIcon size={20} color={T.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: T.brandInk }}>Partagez la cagnotte</Text>
              <Text style={{ fontSize: 12, color: T.brandInk, opacity: 0.8, marginTop: 1 }}>
                Aidez Alexandre à atteindre son objectif.
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.85} style={styles.sharePill}>
              <Text style={styles.sharePillText}>Partager</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App upsell */}
        <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
          <View style={styles.upsell}>
            <View style={styles.upsellMark}>
              <Text style={styles.upsellMarkText}>c.</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                Créez votre propre cagnotte
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2, lineHeight: 16 }}>
                Anniversaire, voyage, cadeau… en 1 minute, gratuit.
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.85} style={styles.upsellPill}>
              <Text style={styles.upsellPillText}>Obtenir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sticky close */}
      <View style={[styles.sticky, { paddingBottom: insets.bottom + 6 }]}>
        <PrimaryButton onPress={() => navigation.popToTop()}>Retour à la cagnotte</PrimaryButton>
        <PoweredBy />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  medalOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  medalInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { fontSize: 26, fontWeight: '700', color: '#fff', letterSpacing: -0.4 },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    color: T.ink3,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: T.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: T.sep,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeadTitle: { fontSize: 13, fontWeight: '600', color: T.ink2 },
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 99,
    backgroundColor: T.brandSoft,
  },
  deltaDot: { width: 5, height: 5, borderRadius: 99, backgroundColor: T.brand },
  deltaText: { fontSize: 11, color: T.brand, fontWeight: '700' },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  shareCard: {
    backgroundColor: T.brandSoft,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  shareIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sharePill: { backgroundColor: T.brand, borderRadius: 99, paddingVertical: 8, paddingHorizontal: 14 },
  sharePillText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  upsell: {
    backgroundColor: '#0E1B14',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  upsellMark: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: T.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upsellMarkText: { color: '#fff', fontSize: 22, fontWeight: '700', letterSpacing: -1.5 },
  upsellPill: { backgroundColor: '#fff', borderRadius: 99, paddingVertical: 8, paddingHorizontal: 14 },
  upsellPillText: { color: '#0E1B14', fontWeight: '600', fontSize: 13 },
  sticky: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 14,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: T.sep,
  },
});
