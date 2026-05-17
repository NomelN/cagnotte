import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Circle, Path, Rect, Ellipse, G, Text as SvgText } from 'react-native-svg';
import { T } from '../../theme';
import { PrimaryButton } from '../../components/Button';
import {
  BellIcon, PlusIcon, GiftIcon, PlaneIcon, BabyIcon, HeartIcon, HandIcon,
} from '../../icons/Icons';
import { HomeStackParamList } from '../../navigation';

type Nav = StackNavigationProp<HomeStackParamList>;

const IDEAS = [
  { Icon: GiftIcon,  label: 'Anniversaire' },
  { Icon: PlaneIcon, label: 'Voyage' },
  { Icon: BabyIcon,  label: 'Bébé · Naissance' },
  { Icon: HeartIcon, label: 'Mariage' },
  { Icon: HandIcon,  label: 'Solidarité' },
];

const EmptyPotIllustration = () => (
  <Svg viewBox="0 0 240 200" width="100%" height={200}>
    <Ellipse cx="120" cy="170" rx="84" ry="6" fill="rgba(0,0,0,0.06)" />
    <G transform="translate(78,52)">
      <Rect x="0" y="22" width="84" height="84" rx="6" fill="#fff" stroke={T.brandDeep} strokeWidth="2.2" />
      <Rect x="0" y="22" width="84" height="12" fill={T.brand} />
      <Path d="M-4 22 h 92 a 2 2 0 0 0 0 -4 H -4 a 2 2 0 0 0 0 4z" fill={T.brandDeep} />
      <G transform="translate(42,72)">
        <Circle r="14" fill="none" stroke={T.brandDeep} strokeWidth="1.6" strokeDasharray="3 3" opacity="0.5" />
        <SvgText textAnchor="middle" dy="5" fontSize="14" fontWeight="600" fill={T.brandDeep} opacity="0.5">€</SvgText>
      </G>
    </G>
    <G fill={T.brand}>
      <Path d="M52 50 l 2 -6 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2z" fillOpacity="0.6" />
      <Path d="M188 70 l 1.5 -5 l 1.5 5 l 5 1.5 l -5 1.5 l -1.5 5 l -1.5 -5 l -5 -1.5z" fillOpacity="0.55" />
      <Path d="M196 130 l 1 -4 l 1 4 l 4 1 l -4 1 l -1 4 l -1 -4 l -4 -1z" fillOpacity="0.5" />
    </G>
  </Svg>
);

export const EmptyHome = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetSmall}>Bonjour,</Text>
            <Text style={styles.greetName}>Alexandre</Text>
          </View>
          <TouchableOpacity style={styles.iconCircle}>
            <BellIcon size={22} color={T.ink3} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 18 }}>
          {/* €0 balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Solde disponible</Text>
            <Text style={styles.balanceAmount}>
              0,00 <Text style={{ color: T.ink3 }}>€</Text>
            </Text>
            <Text style={styles.balanceSub}>Vous n'avez pas encore de cagnotte active.</Text>
            <Svg viewBox="0 0 80 80" width={64} height={64} style={styles.balanceIcon}>
              <Circle cx="40" cy="40" r="32" fill={T.brandSoft} />
              <Path
                d="M22 46 c 0 -10 8 -18 18 -18 s 18 8 18 18 v 6 a 4 4 0 0 1 -4 4 H 26 a 4 4 0 0 1 -4 -4 z"
                fill={T.brand} fillOpacity="0.22"
              />
              <Path d="M26 36 v -2 a 14 14 0 0 1 28 0 v 2" stroke={T.brand} strokeWidth="2" fill="none" strokeLinecap="round" />
            </Svg>
          </View>

          {/* Illustration + CTA */}
          <View style={{ marginTop: 22, alignItems: 'center' }}>
            <View style={styles.illustrationWrap}>
              <View style={styles.halo} />
              <EmptyPotIllustration />
            </View>
            <Text style={styles.title}>Lancez votre première cagnotte</Text>
            <Text style={styles.subtitle}>
              Anniversaire, voyage, cadeau commun… Récoltez en quelques minutes, sans frais.
            </Text>
            <View style={{ marginTop: 18, alignSelf: 'stretch' }}>
              <PrimaryButton onPress={() => navigation.navigate('CreateCategory')}>
                + Créer une cagnotte
              </PrimaryButton>
            </View>
            <Text style={styles.joinLink}>ou rejoindre une cagnotte avec un code</Text>
          </View>

          {/* Ideas */}
          <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionLabel}>Idées populaires</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
            >
              {IDEAS.map(({ Icon, label }) => (
                <TouchableOpacity
                  key={label}
                  style={styles.ideaChip}
                  onPress={() => navigation.navigate('CreateCategory')}
                  activeOpacity={0.75}
                >
                  <View style={styles.ideaIcon}>
                    <Icon size={18} color={T.brand} />
                  </View>
                  <Text style={styles.ideaLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  greetSmall: { fontSize: 14, color: T.ink3 },
  greetName: { fontSize: 28, fontWeight: '700', color: T.ink, letterSpacing: -0.5, marginTop: 2 },
  iconCircle: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
  },
  balanceCard: {
    borderRadius: 24, padding: 22, backgroundColor: T.surface,
    borderWidth: 1, borderColor: T.sep, overflow: 'hidden',
  },
  balanceLabel: { fontSize: 13, color: T.ink3, fontWeight: '500' },
  balanceAmount: { fontSize: 38, fontWeight: '700', letterSpacing: -1, color: T.ink, marginTop: 6 },
  balanceSub: { fontSize: 13, color: T.ink3, marginTop: 4 },
  balanceIcon: { position: 'absolute', right: 14, top: 18 },
  illustrationWrap: { height: 200, width: '100%', justifyContent: 'center' },
  halo: {
    position: 'absolute', alignSelf: 'center', width: 200, height: 180, borderRadius: 100,
    backgroundColor: T.brandSoft, opacity: 0.5,
  },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: T.ink, textAlign: 'center', marginTop: 8 },
  subtitle: {
    fontSize: 15, color: T.ink3, marginTop: 8, lineHeight: 22,
    textAlign: 'center', paddingHorizontal: 14,
  },
  joinLink: { marginTop: 12, fontSize: 13, color: T.brand, fontWeight: '600' },
  sectionLabel: {
    fontSize: 13, color: T.ink3, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
  },
  ideaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingLeft: 10, paddingRight: 14,
    backgroundColor: T.surface, borderRadius: 14,
    borderWidth: 1, borderColor: T.sep,
  },
  ideaIcon: {
    width: 30, height: 30, borderRadius: 8, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  ideaLabel: { fontSize: 13, fontWeight: '600', color: T.ink },
});
