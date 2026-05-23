import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { G, Path, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { T } from '../../theme';
import { PrimaryButton } from '../../components/Button';
import { OnboardingStackParamList } from '../../navigation';

type Nav = StackNavigationProp<OnboardingStackParamList, 'ValueProps'>;

const ContactRow = ({ y, fill, fg, initial, name, sub, checked }: {
  y: number; fill: string; fg: string; initial: string; name: string; sub: string; checked: boolean;
}) => (
  <G transform={`translate(14 ${y})`}>
    <Circle cx="12" cy="12" r="11" fill={fill} />
    <SvgText x="12" y="15" textAnchor="middle" fontSize="9" fontWeight="700" fill={fg}>{initial}</SvgText>
    <SvgText x="32" y="11" fontSize="8" fill={T.ink}>{name}</SvgText>
    <SvgText x="32" y="20" fontSize="6.5" fill={T.ink3}>{sub}</SvgText>
    {checked ? (
      <>
        <Circle cx="86" cy="12" r="6" fill={T.brand} />
        <Path d="M 83 12 l 2 2 l 4 -4" stroke="#fff" strokeWidth="1.4" fill="none" />
      </>
    ) : (
      <Circle cx="86" cy="12" r="6" fill="none" stroke={T.ink4} strokeWidth="1.4" />
    )}
  </G>
);

const ValuePropsIllustration = () => (
  <Svg viewBox="0 0 280 240" width="100%" height={240}>
    <G transform="translate(40 30)">
      <Rect x="0" y="0" width="120" height="200" rx="18" fill="#fff" stroke={T.brandDeep} strokeWidth="2.5" />
      <Rect x="6" y="6" width="108" height="188" rx="12" fill="#fff" />
      <Rect x="14" y="14" width="92" height="46" rx="8" fill={T.brand} />
      <SvgText x="22" y="32" fontSize="9" fontWeight="600" fill="#fff" fillOpacity="0.9">Anniv. Léa</SvgText>
      <SvgText x="22" y="50" fontSize="14" fontWeight="700" fill="#fff">320 €</SvgText>
      <ContactRow y={78}  fill="#F4D6C4" fg="#7A4A22" initial="M" name="Marie Dupuis" sub="marie@gmail.com" checked />
      <ContactRow y={104} fill="#D6E7FB" fg="#1F5BBC" initial="T" name="Thomas Martin" sub="+33 6 12 …" checked />
      <ContactRow y={130} fill="#F8DCE3" fg="#A2335C" initial="S" name="Sarah B." sub="sarah.b@…" checked={false} />
      <Rect x="14" y="166" width="92" height="20" rx="10" fill={T.brand} />
      <SvgText x="60" y="180" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">Inviter 2 personnes</SvgText>
    </G>
    <G>
      <Circle cx="200" cy="60" r="22" fill="#fff" stroke={T.brandDeep} strokeWidth="2" />
      <SvgText x="200" y="68" textAnchor="middle" fontSize="20" fontWeight="800" fill={T.brand}>+</SvgText>
      <Circle cx="232" cy="100" r="14" fill={T.brand} />
      <SvgText x="232" y="106" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">€</SvgText>
      <Circle cx="218" cy="170" r="10" fill="#fff" stroke={T.brandDeep} strokeWidth="2" />
      <Path d="M 213 170 l 4 4 l 8 -8" stroke={T.brand} strokeWidth="2.2" fill="none" />
    </G>
  </Svg>
);

export const ValuePropsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      <View style={{ paddingTop: insets.top, alignItems: 'flex-end', paddingHorizontal: 18 }}>
        <TouchableOpacity onPress={() => navigation.navigate('AuthMethods', { mode: 'signup' })} style={{ padding: 10 }}>
          <Text style={styles.skip}>Passer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.illuCard}>
        <ValuePropsIllustration />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Invitez vos proches en un tap.</Text>
        <Text style={styles.subtitle}>
          Lien, SMS, WhatsApp, QR code. Tout le monde participe, même sans compte.
        </Text>
      </View>

      <View style={[styles.dots, { bottom: insets.bottom + 90 }]}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <PrimaryButton onPress={() => navigation.navigate('AuthMethods', { mode: 'signup' })}>Suivant</PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skip: { fontSize: 15, color: T.ink3, fontWeight: '600' },
  illuCard: {
    marginHorizontal: 28, marginTop: 10, padding: 18,
    borderRadius: 28, backgroundColor: T.brandSoft,
  },
  body: { paddingHorizontal: 28, alignItems: 'center', marginTop: 24 },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3, lineHeight: 29, color: T.ink, textAlign: 'center' },
  subtitle: { fontSize: 15, color: T.ink3, marginTop: 8, lineHeight: 22, textAlign: 'center' },
  dots: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(60,60,67,0.22)' },
  dotActive: { width: 22, backgroundColor: T.brand },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18 },
});
