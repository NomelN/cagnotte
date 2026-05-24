import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle, withDelay, withSpring, withRepeat,
  withSequence, withTiming, Easing,
} from 'react-native-reanimated';
import { T } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { PrimaryButton } from '../../components/Button';
import { CheckIcon, PlusIcon, LinkIcon, ChevRIcon } from '../../icons/Icons';
import { useAuth } from '../../lib/auth';

// (x, y, color, size, rotation)
const CONFETTI: [number, number, string, number, number][] = [
  [40, 30, T.brand, 8, 15],
  [340, 50, '#F4C95E', 8, -20],
  [60, 150, '#F4C95E', 6, 10],
  [320, 150, T.brand, 6, -15],
  [110, 40, '#F8DCE3', 8, 5],
  [280, 30, '#D6E7FB', 8, -5],
  [180, 20, T.brand, 6, 0],
  [200, 140, '#F4C95E', 6, 15],
  [150, 180, T.brand, 5, 20],
  [240, 180, '#F8DCE3', 5, -10],
];

interface QuickCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  onPress: () => void;
  delay: number;
}

const QuickCard = ({ icon, iconBg, title, sub, onPress, delay }: QuickCardProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 18, stiffness: 160 }));
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
        <View style={[styles.cardIcon, { backgroundColor: iconBg }]}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSub}>{sub}</Text>
        </View>
        <ChevRIcon size={14} color={T.ink4} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const WelcomeHomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, consumeJustSignedUp } = useAuth();
  const meta = (user?.user_metadata ?? {}) as { first_name?: string; last_name?: string };
  const firstName = meta.first_name?.trim() || 'là';
  const lastInitial = (meta.last_name?.trim()?.[0] ?? '').toUpperCase();
  const initials = ((firstName[0] ?? 'A').toUpperCase() + lastInitial).slice(0, 2);

  // Entry animations
  const avatarScale = useSharedValue(0.6);
  const avatarOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslate = useSharedValue(16);
  const haloPulse = useSharedValue(1);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    avatarOpacity.value = withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) });
    avatarScale.value = withSpring(1, { damping: 12, stiffness: 140 });
    checkScale.value = withDelay(420, withSpring(1, { damping: 10, stiffness: 200 }));
    titleOpacity.value = withDelay(220, withTiming(1, { duration: 360 }));
    titleTranslate.value = withDelay(220, withSpring(0, { damping: 18, stiffness: 160 }));
    haloPulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, [avatarOpacity, avatarScale, checkScale, titleOpacity, titleTranslate, haloPulse]);

  const avatarStyle = useAnimatedStyle(() => ({
    opacity: avatarOpacity.value,
    transform: [{ scale: avatarScale.value }],
  }));
  const haloStyle = useAnimatedStyle(() => ({ transform: [{ scale: haloPulse.value }] }));
  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslate.value }],
  }));

  const goHome = () => consumeJustSignedUp(null);
  const goCreate = () => consumeJustSignedUp('create');
  const goJoin = () => consumeJustSignedUp('join');

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      {/* Illustration with confetti + pulsing halo + avatar */}
      <View style={[styles.illustration, { paddingTop: insets.top + 28 }]}>
        <Svg viewBox="0 0 380 220" width="100%" height={220} style={StyleSheet.absoluteFill}>
          {CONFETTI.map(([x, y, c, s, r], i) => (
            <Rect
              key={`r-${i}`}
              x={x} y={y} width={s} height={s * 1.6} fill={c}
              origin={`${x + s / 2}, ${y + s}`}
              rotation={r}
              opacity={0.85}
            />
          ))}
          <Circle cx="78" cy="80" r="2.5" fill={T.brand} opacity={0.5} />
          <Circle cx="300" cy="100" r="2.5" fill="#F4C95E" opacity={0.5} />
          <Circle cx="170" cy="100" r="2" fill="#D6E7FB" opacity={0.6} />
        </Svg>

        <View>
          <Animated.View style={[styles.halo, haloStyle]} />
          <Animated.View style={avatarStyle}>
            <Avatar initials={initials} tone="green" size={116} />
          </Animated.View>
          <Animated.View style={[styles.checkBadge, checkStyle]}>
            <CheckIcon size={20} color="#fff" />
          </Animated.View>
        </View>
      </View>

      {/* Title block */}
      <Animated.View style={[styles.body, titleStyle]}>
        <Text style={styles.eyebrow}>COMPTE CRÉÉ</Text>
        <Text style={styles.title}>
          Bienvenue{'\n'}
          <Text style={{ color: T.brand }}>{firstName}</Text> 👋
        </Text>
        <Text style={styles.subtitle}>
          Votre compte Cota est prêt. Lancez une cagnotte ou rejoignez celle d'un proche en quelques tapotements.
        </Text>
      </Animated.View>

      {/* Quick actions */}
      <View style={styles.cards}>
        <QuickCard
          icon={<PlusIcon size={20} color="#fff" />}
          iconBg={T.brand}
          title="Créer ma première cagnotte"
          sub="Anniversaire, voyage, cadeau commun…"
          onPress={goCreate}
          delay={500}
        />
        <QuickCard
          icon={<LinkIcon size={20} color={T.brand} />}
          iconBg={T.brandSoft}
          title="J'ai reçu un lien"
          sub="Rejoindre la cagnotte d'un proche"
          onPress={goJoin}
          delay={620}
        />
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <PrimaryButton onPress={goHome}>Plus tard</PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  illustration: {
    alignItems: 'center', minHeight: 260, justifyContent: 'center',
  },
  halo: {
    position: 'absolute', width: 156, height: 156, borderRadius: 78,
    backgroundColor: T.brandSoft, opacity: 0.55,
    top: -20, left: -20,
  },
  checkBadge: {
    position: 'absolute', right: -4, bottom: -2,
    width: 38, height: 38, borderRadius: 19, backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: T.bg,
    shadowColor: T.brand, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 10,
  },
  body: { paddingHorizontal: 28, alignItems: 'center', marginTop: 18 },
  eyebrow: {
    fontSize: 11, fontWeight: '700', color: T.brand,
    letterSpacing: 1.4, marginBottom: 10,
  },
  title: {
    fontSize: 32, fontWeight: '700', letterSpacing: -0.7, lineHeight: 38,
    color: T.ink, textAlign: 'center',
  },
  subtitle: {
    fontSize: 15, color: T.ink3, marginTop: 10, lineHeight: 22, textAlign: 'center',
    paddingHorizontal: 4,
  },
  cards: { paddingHorizontal: 18, marginTop: 26, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: T.surface, borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: T.sep,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6,
  },
  cardIcon: {
    width: 42, height: 42, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '600', color: T.ink },
  cardSub: { fontSize: 12, color: T.ink3, marginTop: 2 },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18,
  },
});
