import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
  Linking, Share, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Ellipse, G } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { T } from '../theme';
import { BackIcon, ChevRIcon, CopyIcon, QrIcon, DotsIcon, WhatsAppIcon, SmsIcon, MailIcon, CheckIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';

type Rt = RouteProp<HomeStackParamList, 'Share'>;

const ShareIllustration = () => (
  <Svg viewBox="0 0 220 130" width={220} height={130}>
    <Ellipse cx="110" cy="118" rx="92" ry="6" fill="rgba(0,0,0,0.06)"/>
    <G transform="translate(28,18)">
      <Circle cx="22" cy="22" r="14" fill="#F4D6C4"/>
      <Path d="M10 36 q 12 -6 24 0 v 28 a4 4 0 0 1 -4 4 h-16 a4 4 0 0 1 -4 -4 z" fill={T.brand}/>
      <Path d="M30 56 q 12 -2 24 -10" stroke={T.brandDeep} strokeWidth="3" fill="none" strokeLinecap="round"/>
    </G>
    <G transform="translate(138,12)">
      <Circle cx="28" cy="22" r="14" fill="#F2C4A8"/>
      <Path d="M14 36 q 12 -6 28 0 v 32 a4 4 0 0 1 -4 4 h-20 a4 4 0 0 1 -4 -4 z" fill={T.brand} fillOpacity="0.75"/>
      <Path d="M12 56 q -10 -4 -16 -14" stroke={T.brandDeep} strokeWidth="3" fill="none" strokeLinecap="round"/>
    </G>
    <G transform="translate(94,40)">
      <Rect x="0" y="14" width="32" height="26" rx="2" fill="#fff" stroke={T.brandDeep} strokeWidth="2"/>
      <Rect x="0" y="14" width="32" height="6" fill={T.brand}/>
      <Rect x="14" y="14" width="4" height="26" fill={T.brandDeep}/>
      <Path d="M14 14 c -8 -10 -16 -8 -14 0 c 4 4 8 0 14 0z M18 14 c 8 -10 16 -8 14 0 c -4 4 -8 0 -14 0z" fill={T.brand}/>
    </G>
    <Path d="M82 36 l 2 -6 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2z" fill={T.brand} fillOpacity="0.55"/>
    <Path d="M148 20 l 1.5 -5 l 1.5 5 l 5 1.5 l -5 1.5 l -1.5 5 l -1.5 -5 l -5 -1.5z" fill={T.brand} fillOpacity="0.5"/>
  </Svg>
);

const Channel = ({
  icon, title, sub, onPress,
}: {
  icon: React.ReactNode; title: string; sub?: string; onPress: () => void;
}) => (
  <TouchableOpacity style={styles.channel} onPress={onPress} activeOpacity={0.7}>
    <View style={{ width: 22 }}>{icon}</View>
    <View style={{ flex: 1, marginLeft: 14 }}>
      <Text style={styles.channelTitle}>{title}</Text>
      {sub ? <Text style={styles.channelSub}>{sub}</Text> : null}
    </View>
    <ChevRIcon size={16} color={T.ink3} />
  </TouchableOpacity>
);

export const ShareScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<Rt>();
  const { potId, potTitle } = route.params;

  const url = `https://cota.app/pot/${potId}`;
  const message = `Rejoins la cagnotte « ${potTitle} » sur Cota : ${url}`;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openUrl = async (target: string) => {
    const supported = await Linking.canOpenURL(target);
    if (supported) {
      await Linking.openURL(target);
    } else {
      Alert.alert('Non disponible', "Cette application n'est pas installée sur votre appareil.");
    }
  };

  const handleWhatsApp = () =>
    openUrl(`whatsapp://send?text=${encodeURIComponent(message)}`);

  const handleSms = () =>
    openUrl(`sms:?&body=${encodeURIComponent(message)}`);

  const handleMail = () =>
    openUrl(
      `mailto:?subject=${encodeURIComponent(`Cagnotte : ${potTitle}`)}&body=${encodeURIComponent(message)}`,
    );

  const handleMore = async () => {
    try {
      await Share.share({ message, url });
    } catch { /* user cancelled */ }
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partager la cagnotte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
          <ShareIllustration />
        </View>

        <View style={{ paddingHorizontal: 22 }}>
          <Text style={styles.title}>Invitez vos proches</Text>
          <Text style={styles.subtitle}>Plus vous partagez, plus votre cagnotte atteint son objectif !</Text>

          {/* Link row */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText} numberOfLines={1}>{url}</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.8}>
              {copied
                ? <CheckIcon size={14} color="#fff" />
                : <CopyIcon size={14} color="#fff" />}
              <Text style={styles.copyBtnText}>{copied ? 'Copié !' : 'Copier'}</Text>
            </TouchableOpacity>
          </View>

          {/* Channels */}
          <View style={{ gap: 8, marginTop: 18 }}>
            <Channel
              icon={<WhatsAppIcon size={22} />}
              title="Partager par WhatsApp"
              sub="Direct, ou via un groupe"
              onPress={handleWhatsApp}
            />
            <Channel
              icon={<SmsIcon size={22} />}
              title="Partager par SMS"
              sub="À une ou plusieurs personnes"
              onPress={handleSms}
            />
            <Channel
              icon={<MailIcon size={22} />}
              title="Partager par email"
              onPress={handleMail}
            />
            <Channel
              icon={<View style={[styles.squareIcon, { backgroundColor: T.ink }]}><DotsIcon size={14} color="#fff" /></View>}
              title="Plus d'options"
              sub="AirDrop, Messages, et plus"
              onPress={handleMore}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '600', color: T.ink, textAlign: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: T.ink, textAlign: 'center', letterSpacing: -0.3 },
  subtitle: { fontSize: 14, color: T.ink3, textAlign: 'center', marginTop: 6, lineHeight: 20, marginBottom: 18 },
  linkRow: {
    backgroundColor: T.surface, borderRadius: 14, padding: 10, paddingLeft: 16,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: T.sep,
  },
  linkText: { flex: 1, fontSize: 13, color: T.ink3 },
  copyBtn: {
    backgroundColor: T.brand, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  copyBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  channel: {
    backgroundColor: T.surface, borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: T.sep,
  },
  channelTitle: { fontSize: 16, fontWeight: '600', color: T.ink },
  channelSub: { fontSize: 12, color: T.ink3, marginTop: 2 },
  squareIcon: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
});
