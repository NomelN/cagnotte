import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
  Image, Modal, Share, Linking, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { G, Path, Circle } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { T } from '../../theme';
import { Thumb } from '../../components/Thumb';
import { PrimaryButton } from '../../components/Button';
import {
  CopyIcon, ChevRIcon, WhatsAppIcon, SmsIcon, MailIcon, QrIcon,
} from '../../icons/Icons';
import { HomeStackParamList } from '../../navigation';
import { supabase } from '../../lib/supabase';
import { formatEur } from '../../data/hooks';
import type { ThumbType } from '../../data/types';

type Nav = StackNavigationProp<HomeStackParamList, 'SuccessCreated'>;
type Rt = RouteProp<HomeStackParamList, 'SuccessCreated'>;

interface PotRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover_url: string | null;
  goal_amount_cents: number;
  deadline: string | null;
}

const CATEGORY_THUMB: Record<string, ThumbType> = {
  travel: 'beach',
  birthday: 'gift',
  wedding: 'gift',
  baby: 'gift',
  solidarity: 'house',
  other: 'gift',
};

// The deep-link config in App.tsx maps `https://cota.app/pot/:potId` to the
// guest landing screen. We share that exact URL so taps open the app directly.
const shareUrlFor = (potId: string) => `https://cota.app/pot/${potId}`;

const formatDeadline = (iso: string) => {
  const d = new Date(iso);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
};

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

export const SuccessCreatedScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { potId } = route.params;

  const [pot, setPot] = useState<PotRow | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('pots')
      .select('id, title, slug, category, cover_url, goal_amount_cents, deadline')
      .eq('id', potId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setPot((data as PotRow | null) ?? null);
      });
    return () => { cancelled = true; };
  }, [potId]);

  const goHome = () => navigation.navigate('HomeMain');

  if (pot === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={T.brand} />
      </View>
    );
  }

  // If the pot can't be found (shouldn't normally happen after a fresh create),
  // fall back to a non-blocking message so the user still has a way out.
  if (pot === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 17, fontWeight: '600', color: T.ink, textAlign: 'center', marginBottom: 16 }}>
          Cagnotte introuvable.
        </Text>
        <PrimaryButton onPress={goHome}>Retour à l'accueil</PrimaryButton>
      </View>
    );
  }

  const url = shareUrlFor(pot.id);
  const linkLabel = `cota.app/pot/${pot.id.slice(0, 8)}`;
  const shareMessage = `Soutiens ma cagnotte « ${pot.title} » sur Cota : ${url}`;
  const goalLabel = formatEur(pot.goal_amount_cents);
  const subtitleParts = [`Objectif ${goalLabel}`];
  if (pot.deadline) subtitleParts.push(`jusqu'au ${formatDeadline(pot.deadline)}`);

  const copyLink = async () => {
    await Clipboard.setStringAsync(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const openExternal = async (target: string, fallbackMessage?: string) => {
    try {
      const can = await Linking.canOpenURL(target);
      if (!can) {
        if (fallbackMessage) await Share.share({ message: shareMessage });
        return;
      }
      await Linking.openURL(target);
    } catch {
      // Silent — the user can always use the native share sheet below.
    }
  };

  const shareWhatsApp = () =>
    openExternal(`whatsapp://send?text=${encodeURIComponent(shareMessage)}`, shareMessage);

  const shareSms = () => {
    // iOS uses sms:&body=…, Android uses sms:?body=…
    const sep = Platform.OS === 'ios' ? '&' : '?';
    openExternal(`sms:${sep}body=${encodeURIComponent(shareMessage)}`);
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(`Ma cagnotte « ${pot.title} »`);
    const body = encodeURIComponent(shareMessage);
    openExternal(`mailto:?subject=${subject}&body=${body}`);
  };

  const sharePrimary = async () => {
    try {
      await Share.share({ message: shareMessage, url });
    } catch {
      // user cancelled
    }
  };

  const channels = [
    { key: 'wa',   label: 'WhatsApp', icon: <WhatsAppIcon size={22} />, onPress: shareWhatsApp },
    { key: 'sms',  label: 'SMS',      icon: <SmsIcon size={22} />,      onPress: shareSms },
    { key: 'mail', label: 'Email',    icon: <MailIcon size={22} />,     onPress: shareEmail },
    { key: 'qr',   label: 'QR',
      icon: <View style={styles.qrBox}><QrIcon size={14} color="#fff" /></View>,
      onPress: () => setQrVisible(true),
    },
  ];

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
          {/* Real pot preview */}
          <TouchableOpacity
            style={styles.potCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Detail', { potId: pot.id })}
          >
            {pot.cover_url ? (
              <Image source={{ uri: pot.cover_url }} style={styles.cover} />
            ) : (
              <Thumb type={CATEGORY_THUMB[pot.category] ?? 'gift'} size={56} radius={14} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.potTitle} numberOfLines={1}>{pot.title}</Text>
              <Text style={styles.potSub} numberOfLines={1}>{subtitleParts.join(' · ')}</Text>
            </View>
            <ChevRIcon size={18} color={T.brand} />
          </TouchableOpacity>

          {/* Real shareable link */}
          <View style={styles.linkCard}>
            <Text style={styles.linkText} numberOfLines={1}>{linkLabel}</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={copyLink}>
              <CopyIcon size={14} color="#fff" />
              <Text style={styles.copyBtnText}>{copied ? 'Copié !' : 'Copier'}</Text>
            </TouchableOpacity>
          </View>

          {/* Quick share */}
          <View style={styles.shareGrid}>
            {channels.map(c => (
              <TouchableOpacity key={c.key} style={styles.shareCell} activeOpacity={0.8} onPress={c.onPress}>
                {c.icon}
                <Text style={styles.shareCellLabel}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* QR modal */}
      <Modal visible={qrVisible} transparent animationType="fade" onRequestClose={() => setQrVisible(false)}>
        <View style={styles.qrBackdrop}>
          <View style={styles.qrSheet}>
            <Text style={styles.qrTitle}>{pot.title}</Text>
            <Text style={styles.qrSubtitle} numberOfLines={1}>{linkLabel}</Text>
            <View style={{ marginVertical: 20 }}>
              <QRCode value={url} size={220} backgroundColor="#fff" color={T.ink} />
            </View>
            <TouchableOpacity onPress={() => setQrVisible(false)} style={styles.qrCloseBtn}>
              <Text style={styles.qrCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sticky CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 8 }]}>
        <PrimaryButton onPress={sharePrimary}>Partager maintenant</PrimaryButton>
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
  cover: { width: 56, height: 56, borderRadius: 14 },
  potTitle: { fontSize: 16, fontWeight: '600', color: T.ink },
  potSub: { fontSize: 12, color: T.ink3, marginTop: 1 },
  linkCard: {
    marginTop: 14, backgroundColor: T.brandSoft, borderRadius: 14,
    padding: 10, paddingLeft: 16, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  linkText: { flex: 1, fontSize: 14, color: T.brandInk, fontWeight: '500' },
  copyBtn: {
    backgroundColor: T.brand, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 86, justifyContent: 'center',
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
  qrBackdrop: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 32,
  },
  qrSheet: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24,
    alignItems: 'center', width: '100%',
  },
  qrTitle: { fontSize: 18, fontWeight: '700', color: T.ink, textAlign: 'center' },
  qrSubtitle: { fontSize: 13, color: T.ink3, marginTop: 4, textAlign: 'center' },
  qrCloseBtn: {
    paddingHorizontal: 22, paddingVertical: 10, borderRadius: 12,
    backgroundColor: T.field,
  },
  qrCloseText: { fontSize: 14, fontWeight: '600', color: T.ink },
  cta: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 18, paddingTop: 12,
    backgroundColor: '#fff', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: T.sep,
  },
  laterText: { fontSize: 13, fontWeight: '600', color: T.ink3 },
});
