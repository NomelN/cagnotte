import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Circle, Path, Rect, Ellipse, G, Text as SvgText } from 'react-native-svg';
import { T } from '../../theme';
import { PrimaryButton } from '../../components/Button';
import {
  BellIcon, PlusIcon, EyeIcon, ArrowRIcon,
  GiftIcon, PlaneIcon, BabyIcon, HeartIcon, HandIcon,
} from '../../icons/Icons';
import { HomeStackParamList } from '../../navigation';
import { useProfile } from '../../data/hooks';

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
  const { profile } = useProfile();
  const firstName = profile?.first_name ?? '';
  const [balanceHidden, setBalanceHidden] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>

        {/* Header — identical to HomeScreen */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetSmall}>Bonjour,</Text>
            <Text style={styles.greetName}>{firstName}</Text>
          </View>
          <TouchableOpacity
            style={[styles.iconCircle, styles.iconCirclePrimary, { marginRight: 10 }]}
            onPress={() => navigation.navigate('CreateCategory')}
            accessibilityLabel="Créer une cagnotte"
            activeOpacity={0.85}
          >
            <PlusIcon size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('Notifications')}>
            <BellIcon size={22} color={T.ink3} />
          </TouchableOpacity>
        </View>

        {/* Hero card — identical layout, just €0 */}
        <LinearGradient
          colors={[T.brand, T.brandDeep]}
          start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Svg width="100%" height="60" viewBox="0 0 360 60" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <Path d="M0 40 Q60 20 120 35 Q180 50 240 30 Q300 10 360 25 L360 60 L0 60 Z" fill="rgba(255,255,255,0.12)"/>
            <Path d="M0 50 Q80 30 160 45 Q240 60 320 40 L360 45 L360 60 L0 60 Z" fill="rgba(255,255,255,0.08)"/>
          </Svg>
          <View style={styles.heroTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={styles.heroLabel}>Solde disponible</Text>
              <TouchableOpacity
                style={{ marginLeft: 8, padding: 4 }}
                onPress={() => setBalanceHidden(v => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <EyeIcon size={16} color={balanceHidden ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.9)'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroAmount}>
              {balanceHidden ? '•••• €' : '0,00 €'}
            </Text>
            <Text style={styles.heroSub}>Aucune cagnotte active pour l'instant</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <TouchableOpacity
              style={styles.heroArrowBtn}
              onPress={() => navigation.navigate('CreateCategory')}
            >
              <ArrowRIcon size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Section: Mes cagnottes — empty state */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes cagnottes</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.emptyCard}>
            <View style={styles.illustrationWrap}>
              <View style={styles.halo} />
              <EmptyPotIllustration />
            </View>
            <Text style={styles.emptyTitle}>Lancez votre première cagnotte</Text>
            <Text style={styles.emptySub}>
              Anniversaire, voyage, cadeau commun… Récoltez en quelques minutes, sans frais.
            </Text>
            <View style={{ marginTop: 16, alignSelf: 'stretch' }}>
              <PrimaryButton onPress={() => navigation.navigate('CreateCategory')}>
                + Créer une cagnotte
              </PrimaryButton>
            </View>
          </View>
        </View>

        {/* Ideas */}
        <View style={{ marginTop: 24 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Idées populaires</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingBottom: 4 }}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Header — match HomeScreen exactly
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  greetSmall: { fontSize: 14, color: T.ink3 },
  greetName: { fontSize: 28, fontWeight: '700', color: T.ink, letterSpacing: -0.5, marginTop: 2 },
  iconCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
  },
  iconCirclePrimary: {
    backgroundColor: T.brand,
    shadowColor: T.brand,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  // Hero card — match HomeScreen exactly
  heroCard: {
    marginHorizontal: 20, borderRadius: 24,
    paddingHorizontal: 24, paddingVertical: 24,
    overflow: 'hidden', minHeight: 160,
  },
  heroTop: { zIndex: 1 },
  heroLabel: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  heroAmount: { fontSize: 38, fontWeight: '700', color: '#fff', letterSpacing: -1, marginBottom: 4 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  heroArrowBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  // Section header — match HomeScreen
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 28, marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: T.ink, letterSpacing: -0.3 },
  // Empty-state body
  emptyCard: {
    backgroundColor: T.surface, borderRadius: 22, padding: 20,
    borderWidth: 1, borderColor: T.sep,
    alignItems: 'center',
  },
  illustrationWrap: { height: 180, width: '100%', justifyContent: 'center', alignItems: 'center' },
  halo: {
    position: 'absolute', width: 180, height: 160, borderRadius: 90,
    backgroundColor: T.brandSoft, opacity: 0.55,
  },
  emptyTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, color: T.ink, textAlign: 'center', marginTop: 4 },
  emptySub: {
    fontSize: 14, color: T.ink3, marginTop: 8, lineHeight: 21,
    textAlign: 'center', paddingHorizontal: 8,
  },
  // Ideas chips
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
