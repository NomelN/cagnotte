import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
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
import { formatEur } from '../../data/hooks';
import type { ConfirmerStep, ConfirmerResult } from '../../components/StripeConfirmer';

// Lazy so the Stripe native SDK is only evaluated when the user actually pays.
const StripeConfirmer = lazy(() => import('../../components/StripeConfirmer'));

type Nav = StackNavigationProp<HomeStackParamList, 'PaymentProcessing'>;
type Rt = RouteProp<HomeStackParamList, 'PaymentProcessing'>;

// Visible checklist. 3D Secure is collapsed into the same "bank verification"
// step so the user doesn't see a permanently-grey row on the (very common)
// happy path where no 3DS challenge is required.
const VISIBLE_STEPS = [
  'Initialisation du paiement',
  'Connexion à votre banque',
  'Paiement confirmé',
] as const;

// Map a ConfirmerStep to the visible step index that should be "active".
const stepIndex = (s: ConfirmerStep): number => {
  if (s === 'creating') return 0;
  if (s === 'authenticating' || s === 'finalizing') return 1;
  return 2; // 'done'
};

export const PaymentProcessingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { potId, amount, cardId } = route.params;

  // Default to 'creating' rather than an extra synthetic 'init' phase — by the
  // time the screen has rendered, the Confirmer's first onStep is microseconds
  // away. Defaulting to 'creating' avoids a flash where no step is highlighted.
  const [step, setStep] = useState<ConfirmerStep>('creating');
  const [usedAuth, setUsedAuth] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigatedRef = useRef(false);

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

  const handleStep = useCallback((s: ConfirmerStep) => {
    setStep(s);
    if (s === 'authenticating') setUsedAuth(true);
  }, []);

  const handleResult = useCallback((r: ConfirmerResult) => {
    if (navigatedRef.current) return;
    if (r.ok && r.contributionId) {
      // Let the final "Paiement confirmé" check briefly show before navigating
      // so the user gets a satisfying micro-confirmation instead of a hard cut.
      navigatedRef.current = true;
      setTimeout(() => {
        navigation.replace('SuccessContribution', {
          potId, amount, cardId, contributionId: r.contributionId!,
        });
      }, 450);
    } else if (r.ok) {
      setErrorMsg('Paiement confirmé mais référence indisponible.');
    } else {
      setErrorMsg(r.error ?? 'Le paiement a échoué.');
    }
  }, [navigation, potId, amount, cardId]);

  const activeIdx = stepIndex(step);
  const amountLabel = formatEur(Math.round(amount * 100));

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View style={styles.lockBtn}>
          <LockIcon size={20} color={T.ink3} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Pulsing halo + spinner / error glyph */}
        <View style={styles.ringWrap}>
          <Animated.View
            style={[
              styles.halo,
              haloStyle,
              errorMsg ? { backgroundColor: '#FFE5E5' } : null,
            ]}
          />
          <View style={styles.ringInner}>
            {errorMsg ? (
              <Text style={{ fontSize: 30 }}>⚠️</Text>
            ) : step === 'done' ? (
              <View style={styles.successCheck}>
                <CheckIcon size={36} color="#fff" />
              </View>
            ) : (
              <Spinner size={64} stroke={4} color={T.brand} trackColor={T.field} arc={0.3} durationMs={1100} />
            )}
          </View>
        </View>

        <Text style={styles.title}>
          {errorMsg ? 'Paiement non finalisé' : step === 'done' ? 'Paiement confirmé' : 'Paiement en cours…'}
        </Text>

        {/* Amount being charged — keeps the user oriented on what's happening. */}
        {!errorMsg && (
          <Text style={styles.amount}>{amountLabel}</Text>
        )}

        <Text style={styles.subtitle}>
          {errorMsg
            ? errorMsg
            : step === 'authenticating'
              ? 'Authentification 3D Secure auprès de votre banque…'
              : "Vérification en cours. Ne fermez pas l'application."}
        </Text>

        {/* Steps checklist — only rendered while not in an error state. */}
        {!errorMsg && (
          <View style={styles.steps}>
            {VISIBLE_STEPS.map((label, i) => {
              // After 'done' fires every step is shown as done.
              const done = step === 'done' ? true : i < activeIdx;
              const active = step !== 'done' && i === activeIdx;
              // Show a small "(3D Secure)" hint when the bank verification step
              // is active AND we actually went through 3DS authentication.
              const showAuthHint = i === 1 && (step === 'authenticating' || (usedAuth && step === 'finalizing'));
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
                    {showAuthHint ? (
                      <Text style={styles.stepHint}>  · 3D Secure</Text>
                    ) : null}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {errorMsg ? (
          <View style={styles.errorActions}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.errorBackBtn}>
              <Text style={styles.errorBackText}>Retour</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.trustBand}>
            <ShieldIcon size={14} color={T.brand} />
            <Text style={styles.trustText}>Connexion chiffrée · Stripe</Text>
          </View>
        )}
      </View>

      {/* Actual Stripe call happens here; lazy-loaded so the native SDK only
          enters memory once the user reaches this screen. */}
      {!errorMsg && (
        <Suspense fallback={null}>
          <StripeConfirmer
            potId={potId}
            amount={amount}
            cardId={cardId}
            onStep={handleStep}
            onResult={handleResult}
          />
        </Suspense>
      )}
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
  successCheck: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontSize: 22, fontWeight: '700', letterSpacing: -0.3, color: T.ink,
    marginTop: 26, textAlign: 'center',
  },
  amount: {
    fontSize: 32, fontWeight: '700', letterSpacing: -0.8, color: T.brand,
    marginTop: 6, textAlign: 'center',
  },
  subtitle: {
    fontSize: 14, color: T.ink3, marginTop: 8, lineHeight: 21,
    textAlign: 'center', maxWidth: 300,
  },
  steps: { marginTop: 24, alignSelf: 'stretch' },
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
  stepHint: { fontSize: 12, color: T.ink3, fontWeight: '500' },
  trustBand: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 24, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, backgroundColor: T.field,
  },
  trustText: { fontSize: 12, color: T.ink2 },
  errorActions: { marginTop: 28, alignSelf: 'stretch' },
  errorBackBtn: {
    paddingVertical: 14, borderRadius: 14, backgroundColor: T.brand,
    alignItems: 'center',
  },
  errorBackText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
