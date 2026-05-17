import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { T } from '../../theme';
import { Thumb } from '../../components/Thumb';
import { PrimaryButton } from '../../components/Button';
import {
  CopyIcon, ChevRIcon, ShareIcon, WhatsAppIcon, SmsIcon, MailIcon, QrIcon,
} from '../../icons/Icons';
import { HomeStackParamList } from '../../navigation';

type Nav = StackNavigationProp<HomeStackParamList, 'SuccessCreated'>;

const TrophyIllustration = () => (
  <Svg viewBox="0 0 200 170" width="100%" height={170}>
    <G fill={T.brand}>
      <Path d="M28 60 l 1.5 -5 l 1.5 5 l 5 1.5 l -5 1.5 l -1.5 5 l -1.5 -5 l -5 -1.5z" fillOpacity="0.5" />
      <Path d="M168 50 l 2 -6 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2z" fillOpacity="0.55" />
      <Path d="M40 130 l 1 -4 l 1 4 l 4 1 l -4 1 l -1 4 l -1 -4 l -4 -1z" fillOpacity="0.5" />
      <Path d="M158 132 l 1.2 -4 l 1.2 4 l 4 1.2 l -4 1.2 l -1.2 4 l -1.2 -4 l -4 -1.2z" fillOpacity="0.55" />
    </G>
    <G transform="translate(100 85)">
      <Circle r="56" fill={T.brand} fillOpacity="0.12" />
      <Circle r="40" fill="#fff" stroke={T.brand} strokeWidth="3" />
      <Path d="M -10 0 l 8 10 l 18 -20" stroke={T.brand} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M -26 28 l -10 22 l 14 -4 l 6 12 l 10 -22" fill={T.brandDeep} />
      <Path d="M 26 28 l 10 22 l -14 -4 l -6 12 l -10 -22" fill={T.brand} />
    </G>
  </Svg>
);

const SHARE_CHANNELS = [
  { key: 'wa', label: 'WhatsApp', node: <WhatsAppIcon size={22} /> },
  { key: 'sms', label: 'SMS', node: <SmsIcon size={22} /> },
  { key: 'mail', label: 'Email', node: <MailIcon size={22} /> },
];

export const SuccessCreatedScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const goHome = () => navigation.navigate('HomeMain');

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 130 }}>
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={goHome}>
            <Text style={styles.closeX}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.illustrationWrap}>
          <View style={styles.halo} />
          <TrophyIllustration />
        </View>

        <View style={{ paddingHorizontal: 28 }}>
          <Text style={styles.title}>Votre cagnotte est en ligne !</Text>
          <Text style={styles.subtitle}>
            Partagez-la pour récolter vos premières contributions. Plus tôt vous partagez, mieux ça marche.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 18, paddingTop: 22 }}>
          {/* Pot preview */}
          <TouchableOpacity
            style={styles.potCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Detail', { isNew: true })}
          >
            <Thumb type="gift" size={56} radius={14} />
            <View style={{ flex: 1 }}>
              <Text style={styles.potTitle}>Anniversaire Léa</Text>
              <Text style={styles.potSub}>Objectif 500 € · jusqu'au 15 juin</Text>
            </View>
            <ChevRIcon size={18} color={T.brand} />
          </TouchableOpacity>

          {/* Link card */}
          <View style={styles.linkCard}>
            <Text style={styles.linkText} numberOfLines={1}>cota.app/c/anniversaire-lea</Text>
            <TouchableOpacity style={styles.copyBtn}>
              <CopyIcon size={14} color="#fff" />
              <Text style={styles.copyBtnText}>Copier</Text>
            </TouchableOpacity>
          </View>

          {/* Quick share grid */}
          <View style={styles.shareGrid}>
            {SHARE_CHANNELS.map(c => (
              <TouchableOpacity key={c.key} style={styles.shareCell} activeOpacity={0.8}>
                {c.node}
                <Text style={styles.shareCellLabel}>{c.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.shareCell} activeOpacity={0.8}>
              <View style={styles.qrBox}>
                <QrIcon size={14} color="#fff" />
              </View>
              <Text style={styles.shareCellLabel}>QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 8 }]}>
        <PrimaryButton onPress={() => navigation.navigate('Share')}>↑ Partager maintenant</PrimaryButton>
        <TouchableOpacity onPress={goHome} style={{ marginTop: 10, alignItems: 'center' }}>
          <Text style={styles.laterText}>Plus tard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: { alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: 4 },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  closeX: { color: T.ink, fontSize: 18, fontWeight: '500' },
  illustrationWrap: { height: 170, width: '100%', justifyContent: 'center', marginTop: 8 },
  halo: {
    position: 'absolute', alignSelf: 'center', width: 170, height: 150, borderRadius: 85,
    backgroundColor: T.brandSoft, opacity: 0.55,
  },
  title: {
    fontSize: 26, fontWeight: '700', letterSpacing: -0.5, lineHeight: 31,
    color: T.ink, textAlign: 'center',
  },
  subtitle: { fontSize: 15, color: T.ink3, marginTop: 10, lineHeight: 22, textAlign: 'center' },
  potCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: T.surface, borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: T.sep,
  },
  potTitle: { fontSize: 16, fontWeight: '600', color: T.ink },
  potSub: { fontSize: 12, color: T.ink3, marginTop: 1 },
  linkCard: {
    marginTop: 14, backgroundColor: T.brandSoft, borderRadius: 14,
    padding: 10, paddingLeft: 16, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  linkText: { flex: 1, fontSize: 14, color: T.brandInk, fontWeight: '500' },
  copyBtn: {
    backgroundColor: T.brand, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  copyBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  shareGrid: { flexDirection: 'row', gap: 8, marginTop: 14 },
  shareCell: {
    flex: 1, backgroundColor: T.surface, borderRadius: 14, paddingVertical: 12,
    alignItems: 'center', gap: 6, borderWidth: 1, borderColor: T.sep,
  },
  shareCellLabel: { fontSize: 11, fontWeight: '600', color: T.ink2 },
  qrBox: {
    width: 22, height: 22, borderRadius: 6, backgroundColor: T.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  cta: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 18, paddingTop: 12,
    backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: T.sep,
  },
  laterText: { fontSize: 13, fontWeight: '600', color: T.ink3 },
});
