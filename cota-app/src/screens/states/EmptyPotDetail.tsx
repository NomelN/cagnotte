import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Circle } from 'react-native-svg';
import { T } from '../../theme';
import { PrimaryButton, SecondaryButton } from '../../components/Button';
import { BackIcon, DotsIcon, ShareIcon, CopyIcon } from '../../icons/Icons';
import { HomeStackParamList } from '../../navigation';

type Nav = StackNavigationProp<HomeStackParamList>;

const TIPS: [string, string, string][] = [
  ['1', 'Partagez sur WhatsApp ou par SMS', 'Le plus efficace : un message direct.'],
  ['2', 'Ajoutez un mot personnel', 'Les cagnottes avec un message reçoivent 3× plus de contributions.'],
  ['3', 'Relancez gentiment au bout de 3 jours', 'Un petit rappel fait souvent toute la différence.'],
];

export const EmptyPotDetail = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Green header */}
        <LinearGradient
          colors={[T.brand, T.brandDeep]}
          start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 8 }]}
        >
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <BackIcon size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginHorizontal: 12, alignItems: 'center' }}>
              <Text style={styles.navTitle} numberOfLines={1}>Anniversaire Léa</Text>
              <Text style={styles.navSub}>Créée à l'instant</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn}>
              <DotsIcon size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Dashed empty ring */}
          <View style={{ alignItems: 'center', marginTop: 4 }}>
            <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={220} height={220} viewBox="0 0 220 220" style={{ position: 'absolute' }}>
                <Circle cx={110} cy={110} r={92} stroke="rgba(255,255,255,0.25)" strokeWidth={11} fill="none" />
                <Circle
                  cx={110} cy={110} r={92}
                  stroke="rgba(255,255,255,0.55)" strokeWidth={11} fill="none"
                  strokeLinecap="round" strokeDasharray="3 14"
                  rotation="-90" origin="110,110"
                />
              </Svg>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.ringAmount}>0 €</Text>
                <Text style={styles.ringSub}>sur 500 €</Text>
                <View style={styles.ringBadge}>
                  <Text style={styles.ringBadgeText}>En attente</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[{ v: '0', l: 'Participants' }, { v: '500 €', l: 'Reste' }, { v: '30', l: 'Jours' }].map(s => (
              <View key={s.l} style={{ alignItems: 'center' }}>
                <Text style={styles.statVal}>{s.v}</Text>
                <Text style={styles.statLbl}>{s.l}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Empty body */}
        <View style={{ paddingHorizontal: 22, paddingTop: 22, alignItems: 'center' }}>
          <View style={styles.emptyIcon}>
            <ShareIcon size={30} color={T.brand} />
          </View>
          <Text style={styles.emptyTitle}>Aucune contribution pour l'instant</Text>
          <Text style={styles.emptySub}>
            Partagez le lien de la cagnotte pour que vos proches puissent participer.
          </Text>

          {/* Link */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText} numberOfLines={1}>cota.app/c/anniversaire-lea</Text>
            <TouchableOpacity style={styles.copyBtn}>
              <CopyIcon size={14} color="#fff" />
              <Text style={styles.copyBtnText}>Copier</Text>
            </TouchableOpacity>
          </View>

          {/* Tips */}
          <View style={{ alignSelf: 'stretch', marginTop: 18 }}>
            {TIPS.map(([n, title, sub]) => (
              <View key={n} style={styles.tipRow}>
                <View style={styles.tipNum}>
                  <Text style={styles.tipNumText}>{n}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tipTitle}>{title}</Text>
                  <Text style={styles.tipSub}>{sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 8 }]}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1.6 }}>
            <PrimaryButton onPress={() => navigation.navigate('Share')}>↑ Partager</PrimaryButton>
          </View>
          <View style={{ flex: 1 }}>
            <SecondaryButton onPress={() => navigation.goBack()}>Modifier</SecondaryButton>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28, paddingBottom: 24, paddingHorizontal: 20 },
  navRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  navSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  ringAmount: { fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: -0.8 },
  ringSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  ringBadge: { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, marginTop: 8 },
  ringBadgeText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
  statVal: { fontSize: 20, fontWeight: '700', color: '#fff' },
  statLbl: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, color: T.ink, textAlign: 'center' },
  emptySub: { fontSize: 14, color: T.ink3, marginTop: 8, lineHeight: 21, textAlign: 'center' },
  linkRow: {
    alignSelf: 'stretch', marginTop: 18, backgroundColor: T.field, borderRadius: 14,
    padding: 10, paddingLeft: 16, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  linkText: { flex: 1, fontSize: 14, color: T.ink2 },
  copyBtn: {
    backgroundColor: T.brand, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  copyBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  tipRow: { flexDirection: 'row', gap: 12, paddingVertical: 10, alignItems: 'flex-start' },
  tipNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  tipNumText: { fontSize: 12, fontWeight: '700', color: T.brand },
  tipTitle: { fontSize: 14, fontWeight: '600', color: T.ink },
  tipSub: { fontSize: 12, color: T.ink3, marginTop: 1, lineHeight: 18 },
  cta: {
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 0.5, borderTopColor: T.sep,
  },
});
