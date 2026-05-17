import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Rect } from 'react-native-svg';
import { T } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { PrimaryButton } from '../../components/Button';
import { CheckIcon, PlusIcon, LinkIcon, ChevRIcon } from '../../icons/Icons';
import { OnboardingStackParamList, RootStackParamList } from '../../navigation';

type Rt = RouteProp<OnboardingStackParamList, 'WelcomeHome'>;
type Nav = StackNavigationProp<OnboardingStackParamList, 'WelcomeHome'>;

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
}

const QuickCard = ({ icon, iconBg, title, sub, onPress }: QuickCardProps) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
    <View style={[styles.cardIcon, { backgroundColor: iconBg }]}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSub}>{sub}</Text>
    </View>
    <ChevRIcon size={14} color={T.ink4} />
  </TouchableOpacity>
);

export const WelcomeHomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const firstName = route.params?.firstName ?? 'Alexandre';
  const initials = firstName.slice(0, 1).toUpperCase() + 'M';

  const goToApp = () => {
    const root = navigation.getParent<StackNavigationProp<RootStackParamList>>();
    root?.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.illustration, { paddingTop: insets.top + 30 }]}>
        <Svg viewBox="0 0 380 220" width="100%" height={220} style={StyleSheet.absoluteFill}>
          {CONFETTI.map(([x, y, c, s, r], i) => (
            <Rect
              key={i}
              x={x} y={y} width={s} height={s * 1.6} fill={c}
              origin={`${x + s / 2}, ${y + s}`}
              rotation={r}
            />
          ))}
        </Svg>
        <View>
          <View style={styles.halo} />
          <Avatar initials={initials} tone="green" size={112} />
          <View style={styles.checkBadge}>
            <CheckIcon size={20} color="#fff" />
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>
          Bienvenue,{'\n'}{firstName} <Text style={{ color: T.brand }}>·</Text>
        </Text>
        <Text style={styles.subtitle}>
          Votre compte Cota est prêt.{'\n'}Pour commencer, créez votre première cagnotte — ou rejoignez celle d'un proche.
        </Text>
      </View>

      <View style={styles.cards}>
        <QuickCard
          icon={<PlusIcon size={20} color={T.brand} />}
          iconBg={T.brandSoft}
          title="Créer ma première cagnotte"
          sub="2 étapes, 1 minute chrono"
          onPress={goToApp}
        />
        <QuickCard
          icon={<LinkIcon size={20} color={T.ink2} />}
          iconBg={T.field}
          title="J'ai reçu un lien"
          sub="Rejoindre la cagnotte d'un proche"
          onPress={goToApp}
        />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <PrimaryButton onPress={goToApp}>Aller à l'accueil</PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  illustration: { alignItems: 'center', minHeight: 250, justifyContent: 'center' },
  halo: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: T.brandSoft, opacity: 0.6,
    top: -14, left: -14,
  },
  checkBadge: {
    position: 'absolute', right: -6, bottom: -2,
    width: 36, height: 36, borderRadius: 18, backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8,
  },
  body: { paddingHorizontal: 28, alignItems: 'center', marginTop: 12 },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.6, lineHeight: 36, color: T.ink, textAlign: 'center' },
  subtitle: { fontSize: 15, color: T.ink3, marginTop: 10, lineHeight: 22, textAlign: 'center' },
  cards: { paddingHorizontal: 18, marginTop: 24, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: T.surface, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: T.sep,
  },
  cardIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: T.ink },
  cardSub: { fontSize: 12, color: T.ink3, marginTop: 1 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18 },
});
