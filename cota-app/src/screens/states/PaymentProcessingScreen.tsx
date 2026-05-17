import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing,
} from 'react-native-reanimated';
import { T } from '../../theme';
import { Spinner } from '../../components/Spinner';
import { CheckIcon, LockIcon, ShieldIcon } from '../../icons/Icons';
import { HomeStackParamList } from '../../navigation';

type Nav = StackNavigationProp<HomeStackParamList, 'PaymentProcessing'>;
type Rt = RouteProp<HomeStackParamList, 'PaymentProcessing'>;

const STEPS = [
  'Paiement initialisé',
  'Vérification 3D Secure',
  'Confirmation par la banque',
  'Reçu de la transaction',
];

export const PaymentProcessingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const amount = route.params?.amount ?? 50;

  const [activeStep, setActiveStep] = useState(1);

  // Pulsing halo behind the spinner
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.94, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, [pulse]);
  const haloStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  // Advance the checklist, then move to the success screen
  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(2), 1100),
      setTimeout(() => setActiveStep(3), 2200),
      setTimeout(() => setActiveStep(4), 3300),
      setTimeout(() => navigation.replace('SuccessContribution', { amount }), 3900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigation, amount]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View style={styles.lockBtn}>
          <LockIcon size={20} color={T.ink3} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Pulsing ring */}
        <View style={styles.ringWrap}>
          <Animated.View style={[styles.halo, haloStyle]} />
          <View style={styles.ringInner}>
            <Spinner size={64} stroke={4} color={T.brand} trackColor={T.field} arc={0.3} durationMs={1100} />
          </View>
        </View>

        <Text style={styles.title}>Paiement en cours…</Text>
        <Text style={styles.subtitle}>
          Vérification 3D Secure auprès de votre banque. Ne fermez pas l'application.
        </Text>

        {/* Steps checklist */}
        <View style={styles.steps}>
          {STEPS.map((label, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <View key={label} style={styles.stepRow}>
                {done ? (
                  <View style={styles.stepDone}>
                    <CheckIcon size={14} color="#fff" />
                  </View>
                ) : active ? (
                  <View style={styles.stepActive}>
                    <View style={styles.stepActiveDot} />
                  </View>
                ) : (
                  <View style={styles.stepIdle} />
                )}
                <Text
                  style={[
                    styles.stepLabel,
                    { color: !done && !active ? T.ink3 : T.ink, fontWeight: active ? '600' : '500' },
                  ]}
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Stripe reassurance */}
        <View style={styles.trustBand}>
          <ShieldIcon size={14} color={T.brand} />
          <Text style={styles.trustText}>Connexion chiffrée · Stripe</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: { alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: 8 },
  lockBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  content: { paddingHorizontal: 32, paddingTop: 30, alignItems: 'center' },
  ringWrap: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: T.brandSoft },
  ringInner: {
    width: 104, height: 104, borderRadius: 52, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: T.sep,
  },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, color: T.ink, marginTop: 26 },
  subtitle: { fontSize: 14, color: T.ink3, marginTop: 8, lineHeight: 21, textAlign: 'center', maxWidth: 280 },
  steps: { marginTop: 28, alignSelf: 'stretch' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  stepDone: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  stepActive: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: T.surface,
    borderWidth: 1.5, borderColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  stepActiveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: T.brand },
  stepIdle: { width: 22, height: 22, borderRadius: 11, backgroundColor: T.field },
  stepLabel: { fontSize: 14 },
  trustBand: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 28, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, backgroundColor: T.field,
  },
  trustText: { fontSize: 12, color: T.ink2 },
});
