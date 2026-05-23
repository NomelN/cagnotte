import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { G, Path, Circle, Rect, Ellipse, Text as SvgText } from 'react-native-svg';
import { T } from '../../theme';
import { PrimaryButton } from '../../components/Button';
import { OnboardingStackParamList } from '../../navigation';

type Nav = StackNavigationProp<OnboardingStackParamList, 'ValueProps'>;

const { width: W } = Dimensions.get('window');
const AUTO_DELAY = 3200;

// ─── Illustrations ────────────────────────────────────────────────────────────

const Illu1 = () => (
  <Svg viewBox="0 0 300 220" width="100%" height={220}>
    {/* Phone frame */}
    <Rect x="80" y="10" width="140" height="200" rx="22" fill="#fff" stroke={T.sep} strokeWidth="2" />
    {/* Status bar */}
    <Rect x="120" y="22" width="60" height="6" rx="3" fill={T.sep} />
    {/* Category pills */}
    <Rect x="96" y="42" width="50" height="22" rx="11" fill={T.brand} />
    <SvgText x="121" y="57" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">🎂 Anniv</SvgText>
    <Rect x="152" y="42" width="54" height="22" rx="11" fill={T.surface} stroke={T.sep} strokeWidth="1.2" />
    <SvgText x="179" y="57" textAnchor="middle" fontSize="9" fill={T.ink3}>✈️ Voyage</SvgText>
    {/* Title input */}
    <Rect x="96" y="76" width="108" height="24" rx="8" fill={T.surface} stroke={T.brand} strokeWidth="1.5" />
    <SvgText x="103" y="92" fontSize="8.5" fill={T.ink}>Anniversaire Léa 🎉</SvgText>
    {/* Amount */}
    <Rect x="96" y="112" width="108" height="24" rx="8" fill={T.surface} stroke={T.sep} strokeWidth="1.2" />
    <SvgText x="103" y="128" fontSize="8.5" fill={T.ink}>Objectif : 200 €</SvgText>
    {/* Button */}
    <Rect x="96" y="150" width="108" height="28" rx="14" fill={T.brand} />
    <SvgText x="150" y="168" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">Créer la cagnotte</SvgText>
    {/* Sparkles */}
    <G fill={T.brand} fillOpacity="0.6">
      <Path d="M50 60 l2-6 l2 6 l6 2 l-6 2 l-2 6 l-2-6 l-6-2z" />
      <Path d="M258 80 l1.5-4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5-4 l-4-1.5z" />
      <Circle cx="60" cy="150" r="4" fillOpacity="0.4" />
    </G>
  </Svg>
);

const Illu2 = () => (
  <Svg viewBox="0 0 300 220" width="100%" height={220}>
    {/* Central link bubble */}
    <Rect x="70" y="80" width="160" height="44" rx="22" fill={T.brand} />
    <SvgText x="150" y="97" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.8)">cota.app/pot/</SvgText>
    <SvgText x="150" y="112" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">anniv-lea-🎂</SvgText>
    {/* Share channels */}
    {/* WhatsApp */}
    <Circle cx="60" cy="48" r="22" fill="#25D366" />
    <SvgText x="60" y="54" textAnchor="middle" fontSize="18">💬</SvgText>
    <Path d="M60 70 L100 90" stroke={T.brand} strokeWidth="1.5" strokeDasharray="4 3" />
    {/* SMS */}
    <Circle cx="150" cy="30" r="22" fill="#007AFF" />
    <SvgText x="150" y="36" textAnchor="middle" fontSize="18">✉️</SvgText>
    <Path d="M150 52 L150 80" stroke={T.brand} strokeWidth="1.5" strokeDasharray="4 3" />
    {/* QR */}
    <Circle cx="240" cy="48" r="22" fill={T.surface} stroke={T.sep} strokeWidth="1.5" />
    <SvgText x="240" y="54" textAnchor="middle" fontSize="18">⬛</SvgText>
    <Path d="M240 70 L200 90" stroke={T.brand} strokeWidth="1.5" strokeDasharray="4 3" />
    {/* People receiving */}
    <Circle cx="80" cy="170" r="18" fill="#F4D6C4" />
    <SvgText x="80" y="176" textAnchor="middle" fontSize="15">😊</SvgText>
    <Circle cx="150" cy="178" r="18" fill="#D6E7FB" />
    <SvgText x="150" y="184" textAnchor="middle" fontSize="15">🙌</SvgText>
    <Circle cx="220" cy="170" r="18" fill="#F8DCE3" />
    <SvgText x="220" y="176" textAnchor="middle" fontSize="15">🎉</SvgText>
    <Path d="M80 152 L110 124" stroke={T.brand} strokeWidth="1.5" strokeDasharray="4 3" />
    <Path d="M150 160 L150 124" stroke={T.brand} strokeWidth="1.5" strokeDasharray="4 3" />
    <Path d="M220 152 L190 124" stroke={T.brand} strokeWidth="1.5" strokeDasharray="4 3" />
  </Svg>
);

const Illu3 = () => (
  <Svg viewBox="0 0 300 220" width="100%" height={220}>
    {/* Card */}
    <Rect x="30" y="20" width="240" height="180" rx="20" fill="#fff" stroke={T.sep} strokeWidth="1.5" />
    {/* Title */}
    <SvgText x="150" y="52" textAnchor="middle" fontSize="12" fontWeight="700" fill={T.ink}>Anniversaire Léa 🎂</SvgText>
    {/* Progress bar track */}
    <Rect x="50" y="68" width="200" height="14" rx="7" fill="rgba(60,60,67,0.08)" />
    {/* Progress bar fill */}
    <Rect x="50" y="68" width="150" height="14" rx="7" fill={T.brand} />
    {/* Amount labels */}
    <SvgText x="50" y="98" fontSize="10" fontWeight="700" fill={T.brand}>150 €</SvgText>
    <SvgText x="250" y="98" textAnchor="end" fontSize="10" fill={T.ink3}>/ 200 €</SvgText>
    {/* Contributor rows */}
    {[
      { y: 116, color: '#F4D6C4', initial: 'M', name: 'Marie', amount: '30 €' },
      { y: 141, color: '#D6E7FB', initial: 'T', name: 'Thomas', amount: '50 €' },
      { y: 166, color: '#F8DCE3', initial: 'J', name: 'Julie', amount: '70 €' },
    ].map(({ y, color, initial, name, amount }) => (
      <G key={y} transform={`translate(50 ${y})`}>
        <Circle cx="11" cy="11" r="11" fill={color} />
        <SvgText x="11" y="15" textAnchor="middle" fontSize="8" fontWeight="700" fill={T.ink2}>{initial}</SvgText>
        <SvgText x="28" y="15" fontSize="9" fill={T.ink}>{name}</SvgText>
        <Rect x="140" y="3" width="50" height="17" rx="8" fill={T.brandSoft} />
        <SvgText x="165" y="15" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={T.brand}>{amount}</SvgText>
      </G>
    ))}
  </Svg>
);

const Illu4 = () => (
  <Svg viewBox="0 0 300 220" width="100%" height={220}>
    {/* Confetti */}
    <G fillOpacity="0.6">
      <Rect x="60" y="20" width="8" height="3" rx="1.5" fill={T.brand} transform="rotate(20 64 22)" />
      <Rect x="220" y="30" width="7" height="3" rx="1.5" fill="#F4C95E" transform="rotate(-15 223 31)" />
      <Rect x="140" y="10" width="6" height="3" rx="1.5" fill="#F87171" transform="rotate(35 143 12)" />
      <Circle cx="80" cy="55" r="3" fill={T.brand} />
      <Circle cx="240" cy="45" r="2.5" fill="#F4C95E" />
      <Circle cx="170" cy="18" r="2" fill="#34D399" />
    </G>
    {/* Medal circle */}
    <Circle cx="150" cy="100" r="60" fill={T.brand} fillOpacity="0.1" />
    <Circle cx="150" cy="100" r="44" fill="#fff" stroke={T.brand} strokeWidth="3" />
    {/* Check */}
    <Path d="M132 100 l10 12 l24 -28" stroke={T.brand} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Amount badge */}
    <Rect x="100" y="152" width="100" height="32" rx="16" fill={T.brand} />
    <SvgText x="150" y="173" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">200 € reçus !</SvgText>
    {/* Bank card hint */}
    <Rect x="60" y="192" width="80" height="20" rx="8" fill={T.surface} stroke={T.sep} strokeWidth="1" />
    <SvgText x="100" y="206" textAnchor="middle" fontSize="8" fill={T.ink3}>→ Virement</SvgText>
    <Rect x="160" y="192" width="80" height="20" rx="8" fill={T.surface} stroke={T.sep} strokeWidth="1" />
    <SvgText x="200" y="206" textAnchor="middle" fontSize="8" fill={T.ink3}>→ Carte</SvgText>
  </Svg>
);

// ─── Slides data ──────────────────────────────────────────────────────────────

const SLIDES = [
  {
    illu: <Illu1 />,
    title: 'Créez en 2 minutes',
    subtitle: "Choisissez l'occasion, fixez un objectif et votre cagnotte est prête à être partagée.",
  },
  {
    illu: <Illu2 />,
    title: 'Partagez en un tap',
    subtitle: 'Lien, WhatsApp, SMS, QR code. Tout le monde peut participer, même sans compte.',
  },
  {
    illu: <Illu3 />,
    title: 'Suivez en temps réel',
    subtitle: "Visualisez les contributions au fur et à mesure. Relancez d'un geste ceux qui n'ont pas encore participé.",
  },
  {
    illu: <Illu4 />,
    title: 'Recevez vos fonds',
    subtitle: "Une fois l'objectif atteint, l'argent est versé directement sur votre compte. Simple et sécurisé.",
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export const ValuePropsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const scrollRef = useRef<ScrollView>(null);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * W, animated: true });
    setCurrent(index);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => {
        if (prev >= SLIDES.length - 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return prev;
        }
        const next = prev + 1;
        scrollRef.current?.scrollTo({ x: next * W, animated: true });
        return next;
      });
    }, AUTO_DELAY);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setCurrent(idx);
    startTimer();
  };

  const isLast = current === SLIDES.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      {/* Skip */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('AuthMethods', { mode: 'signup' })} style={styles.skipBtn}>
          <Text style={styles.skip}>Passer</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onScrollEnd}
        onScrollBeginDrag={() => { if (timerRef.current) clearInterval(timerRef.current); }}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width: W }]}>
            <View style={styles.illuCard}>{slide.illu}</View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots + CTA — in normal flow so they never overlap */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => { goTo(i); startTimer(); }}>
              <View style={[styles.dot, i === current && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
        {isLast ? (
          <PrimaryButton onPress={() => navigation.navigate('AuthMethods', { mode: 'signup' })}>
            Commencer gratuitement
          </PrimaryButton>
        ) : (
          <PrimaryButton onPress={() => { goTo(current + 1); startTimer(); }}>
            Suivant
          </PrimaryButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: { alignItems: 'flex-end', paddingHorizontal: 20, paddingBottom: 4 },
  skipBtn: { padding: 6 },
  skip: { fontSize: 15, color: T.ink3, fontWeight: '600' },
  slide: {
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illuCard: {
    width: '100%', borderRadius: 28,
    backgroundColor: T.brandSoft,
    paddingVertical: 12, paddingHorizontal: 8,
    marginBottom: 28,
    overflow: 'hidden',
  },
  title: {
    fontSize: 26, fontWeight: '700', letterSpacing: -0.4, lineHeight: 31,
    color: T.ink, textAlign: 'center',
  },
  subtitle: {
    fontSize: 15, color: T.ink3, marginTop: 10, lineHeight: 22,
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: 20, paddingTop: 16, gap: 16,
  },
  dots: {
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(60,60,67,0.18)' },
  dotActive: { width: 24, backgroundColor: T.brand },
});
