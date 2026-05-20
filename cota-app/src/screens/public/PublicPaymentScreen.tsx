import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { T } from '../../theme';
import { Thumb } from '../../components/Thumb';
import { PrimaryButton } from '../../components/Button';
import { StickyCTA } from '../../components/StickyCTA';
import { TopNav } from '../../components/TopNav';
import { BackIcon, LockIcon, ShieldIcon } from '../../icons/Icons';
import { GuestStackParamList } from '../../navigation';
import { StepIndicator } from './StepIndicator';

type Nav = StackNavigationProp<GuestStackParamList, 'GuestPayment'>;
type Rt = RouteProp<GuestStackParamList, 'GuestPayment'>;

const fmt = (n: number) => `${n},00 €`;

const VisaMark = () => (
  <Svg width={34} height={22} viewBox="0 0 34 22">
    <Rect x={0.7} y={0.7} width={32.6} height={20.6} rx={3.5} fill="#1A1F71" />
    <SvgText x={17} y={15} textAnchor="middle" fontWeight="700" fontStyle="italic" fontSize={9} fill="#fff">
      VISA
    </SvgText>
  </Svg>
);

export const PublicPaymentScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { amount } = useRoute<Rt>().params;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ paddingTop: insets.top }}>
        <TopNav
          title="Paiement"
          sub="Étape 2 sur 3"
          left={
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
              <BackIcon size={22} color={T.ink} />
            </TouchableOpacity>
          }
          right={<LockIcon size={20} color={T.ink3} />}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 18 }}>
          <StepIndicator step={2} />

          {/* Summary chip */}
          <View style={styles.summary}>
            <Thumb type="beach" size={40} radius={10} />
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryTitle}>Vacances en famille — Bali</Text>
              <Text style={styles.summarySub}>Votre contribution</Text>
            </View>
            <Text style={styles.summaryAmount}>{fmt(amount)}</Text>
          </View>

          {/* Express pay */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <TouchableOpacity activeOpacity={0.85} style={[styles.expressBtn, { backgroundColor: '#000' }]}>
              <Svg width={14} height={16} viewBox="0 0 14 16" fill="#fff">
                <Path d="M11.6 8.4c0-2 1.6-3 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.4 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7.9 1.5 2 2.5 1.9 1 0 1.4-.6 2.6-.6s1.6.6 2.6.6c1.1 0 1.8-1 2.5-1.9.8-1.1 1.1-2.1 1.1-2.2 0 0-2.2-.8-2.2-3.2zM9.5 2.7c.5-.7 1-1.6.8-2.7-.9.1-2 .6-2.5 1.3-.5.6-1 1.6-.9 2.5 1 .1 2-.5 2.6-1.1z" />
              </Svg>
              <Text style={[styles.expressText, { color: '#fff' }]}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.expressBtn, { backgroundColor: T.surface, borderWidth: 1, borderColor: T.sep }]}
            >
              <Text style={[styles.expressText, { color: '#4285F4' }]}>G</Text>
              <Text style={[styles.expressText, { color: T.ink }]}> Pay</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>OU PAR CARTE</Text>
            <View style={styles.divLine} />
          </View>

          {/* Card fields */}
          <View style={styles.cardBox}>
            <View style={[styles.cardRow, { borderBottomWidth: 0.5, borderBottomColor: T.sep }]}>
              <Text style={styles.cardNumber}>4242 4242 4242 4242</Text>
              <VisaMark />
            </View>
            <View style={styles.cardRow}>
              <Text style={[styles.cardNumber, { flex: 1 }]}>12 / 27</Text>
              <View style={{ width: 1, height: 18, backgroundColor: T.sep, marginHorizontal: 14 }} />
              <Text style={[styles.cardNumber, { flex: 1 }]}>•••</Text>
              <Text style={{ fontSize: 11, color: T.ink4 }}>CVC</Text>
            </View>
          </View>

          {/* Create account opt-in */}
          <View style={styles.optInCard}>
            <View style={styles.optInIcon}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7M16 5l2 2 4-4"
                  stroke={T.brand}
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.optInTitle}>Créer un compte Cota</Text>
              <Text style={styles.optInSub}>Suivez vos contributions et payez en 1 clic.</Text>
            </View>
            <View style={styles.toggle}>
              <View style={styles.toggleKnob} />
            </View>
          </View>

          {/* Trust line */}
          <View style={styles.trustBand}>
            <ShieldIcon size={16} color={T.brand} />
            <Text style={styles.trustText}>
              <Text style={{ fontWeight: '600', color: T.ink2 }}>Paiement protégé.</Text> Vos données sont
              chiffrées et traitées par Stripe.
            </Text>
          </View>
        </View>
      </ScrollView>

      <StickyCTA hint="En continuant vous acceptez les CGU de Cota">
        <PrimaryButton onPress={() => navigation.navigate('GuestThanks', { amount })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <LockIcon size={16} color="#fff" />
            <Text style={styles.ctaText}>Payer {fmt(amount)}</Text>
          </View>
        </PrimaryButton>
      </StickyCTA>
    </View>
  );
};

const styles = StyleSheet.create({
  summary: {
    backgroundColor: T.brandSoft,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  summaryTitle: { fontSize: 13, fontWeight: '600', color: T.brandInk },
  summarySub: { fontSize: 11, color: T.brandInk, opacity: 0.8, marginTop: 1 },
  summaryAmount: { fontSize: 20, fontWeight: '700', color: T.brandInk },
  expressBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  expressText: { fontWeight: '600', fontSize: 15 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  divLine: { flex: 1, height: 1, backgroundColor: T.sep },
  divText: { fontSize: 11, color: T.ink3, letterSpacing: 0.8 },
  cardBox: {
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: T.sep,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  cardNumber: { fontSize: 15, fontWeight: '500', color: T.ink, letterSpacing: 0.5 },
  optInCard: {
    marginTop: 10,
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: T.sep,
  },
  optInIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: T.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optInTitle: { fontSize: 14, fontWeight: '600', color: T.ink },
  optInSub: { fontSize: 11, color: T.ink3, marginTop: 1 },
  toggle: { width: 48, height: 30, borderRadius: 99, backgroundColor: T.field, justifyContent: 'center' },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    marginLeft: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  trustBand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: T.field,
    borderRadius: 12,
  },
  trustText: { flex: 1, fontSize: 12, color: T.ink3, lineHeight: 17 },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
