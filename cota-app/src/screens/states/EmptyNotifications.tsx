import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import { T } from '../../theme';
import { BackIcon, BellIcon } from '../../icons/Icons';

const SleepingBell = () => (
  <Svg viewBox="0 0 160 140" width="100%" height={160}>
    <G transform="translate(60,18)">
      <Path
        d="M20 8 a 18 18 0 0 0 -18 18 v 22 l -6 10 h 48 l -6 -10 v -22 a 18 18 0 0 0 -18 -18z"
        fill={T.brand} fillOpacity="0.15"
      />
      <Path
        d="M20 8 a 18 18 0 0 0 -18 18 v 22 l -6 10 h 48 l -6 -10 v -22 a 18 18 0 0 0 -18 -18z"
        fill="none" stroke={T.brand} strokeWidth="2.5" strokeLinejoin="round"
      />
      <Path d="M14 62 a 8 8 0 0 0 16 0" stroke={T.brand} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <SvgText x="44" y="14" fontSize="14" fontWeight="700" fill={T.brand} opacity="0.55">z</SvgText>
      <SvgText x="52" y="6" fontSize="10" fontWeight="700" fill={T.brand} opacity="0.4">z</SvgText>
    </G>
  </Svg>
);

export const EmptyNotifications = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationWrap}>
          <View style={styles.halo} />
          <SleepingBell />
        </View>

        <Text style={styles.title}>Tout est calme</Text>
        <Text style={styles.subtitle}>
          Vous serez prévenu·e ici quand quelqu'un contribue à vos cagnottes ou que l'objectif est atteint.
        </Text>

        <View style={styles.pushCard}>
          <View style={styles.pushIcon}>
            <BellIcon size={20} color={T.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pushTitle}>Notifications push</Text>
            <Text style={styles.pushSub}>Activez-les pour suivre vos cagnottes en temps réel.</Text>
          </View>
          <TouchableOpacity style={styles.pushBtn} activeOpacity={0.85}>
            <Text style={styles.pushBtnText}>Activer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '600', color: T.ink, textAlign: 'center' },
  content: { paddingHorizontal: 32, paddingTop: 24, alignItems: 'center' },
  illustrationWrap: { width: '100%', height: 160, justifyContent: 'center' },
  halo: {
    position: 'absolute', alignSelf: 'center', width: 130, height: 120, borderRadius: 65,
    backgroundColor: T.brandSoft, opacity: 0.6,
  },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, color: T.ink, marginTop: 4 },
  subtitle: { fontSize: 14, color: T.ink3, marginTop: 8, lineHeight: 21, textAlign: 'center' },
  pushCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginTop: 24, padding: 14, alignSelf: 'stretch',
    backgroundColor: T.surface, borderRadius: 16,
    borderWidth: 1, borderColor: T.sep,
  },
  pushIcon: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  pushTitle: { fontSize: 14, fontWeight: '600', color: T.ink },
  pushSub: { fontSize: 12, color: T.ink3, marginTop: 1 },
  pushBtn: { backgroundColor: T.brand, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 8 },
  pushBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
