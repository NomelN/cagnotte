import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { G, Path, Circle, Ellipse, Rect, Text as SvgText } from 'react-native-svg';
import { T } from '../../theme';
import { PrimaryButton } from '../../components/Button';
import { OnboardingStackParamList } from '../../navigation';

type Nav = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;

const WelcomeIllustration = () => (
  <Svg viewBox="0 0 380 320" width="100%" height={300}>
    {/* Pot */}
    <G transform="translate(120 130)">
      <Ellipse cx="70" cy="130" rx="90" ry="14" fill="rgba(0,0,0,0.08)" />
      <Path
        d="M 0 50 Q 0 30 20 26 L 120 26 Q 140 30 140 50 L 132 122 Q 130 138 116 138 L 24 138 Q 10 138 8 122 Z"
        fill={T.brand}
      />
      <Ellipse cx="70" cy="26" rx="70" ry="14" fill={T.brandDeep} />
      <Ellipse cx="70" cy="22" rx="62" ry="10" fill={T.brandSoft} />
      <Rect x="56" y="20" width="28" height="4" rx="2" fill={T.brand} />
      <Circle cx="70" cy="6" r="6" fill="#F4C95E" stroke="#B58721" strokeWidth="1.4" />
      <SvgText x="70" y="9" textAnchor="middle" fontSize="8" fontWeight="700" fill="#7A5A12">€</SvgText>
      <Circle cx="100" cy="-10" r="5" fill="#F4C95E" stroke="#B58721" strokeWidth="1.2" />
    </G>
    {/* Person left */}
    <G transform="translate(34 138)">
      <Circle cx="22" cy="22" r="16" fill="#F4D6C4" />
      <Path d="M 6 38 Q 22 30 38 38 L 38 88 Q 38 96 30 96 L 14 96 Q 6 96 6 88 Z" fill={T.brand} />
      <Path d="M 6 18 Q 22 4 38 12 Q 36 -2 22 -2 Q 8 -2 6 18 Z" fill="#5C3B1E" />
      <Path d="M 36 60 Q 70 50 92 56" stroke="#F4D6C4" strokeWidth="9" fill="none" strokeLinecap="round" />
    </G>
    {/* Person right */}
    <G transform="translate(284 142)">
      <Circle cx="22" cy="22" r="16" fill="#E8B59A" />
      <Path d="M 6 38 Q 22 30 38 38 L 38 86 Q 38 94 30 94 L 14 94 Q 6 94 6 86 Z" fill={T.brand} fillOpacity="0.8" />
      <Path d="M 4 14 Q 22 -4 40 8 Q 32 -8 22 -8 Q 8 -8 4 14 Z" fill="#3E2718" />
      <Path d="M 6 58 Q -28 50 -44 56" stroke="#E8B59A" strokeWidth="9" fill="none" strokeLinecap="round" />
    </G>
    {/* Sparkles */}
    <G fill={T.brand}>
      <Path d="M 60 80 l 3 -8 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3z" fillOpacity="0.7" />
      <Path d="M 320 96 l 2 -5 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2z" fillOpacity="0.6" />
      <Path d="M 200 40 l 2 -6 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2z" fillOpacity="0.55" />
    </G>
  </Svg>
);

export const WelcomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.illustration, { paddingTop: insets.top + 24 }]}>
        <View style={styles.halo} />
        <WelcomeIllustration />
      </View>

      <View style={styles.body}>
        <Text style={styles.wordmark}>
          cota<Text style={{ color: T.brand }}>.</Text>
        </Text>
        <Text style={styles.title}>Mettons-nous d'accord{'\n'}sur ce qu'on va offrir.</Text>
        <Text style={styles.subtitle}>
          Une cagnotte simple, partagée à plusieurs, qui atteint son objectif. Pour les anniversaires, voyages, cadeaux et coups durs.
        </Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <PrimaryButton onPress={() => navigation.navigate('ValueProps')}>Commencer</PrimaryButton>
        <Text style={styles.signIn}>
          Déjà un compte ?{' '}
          <Text style={styles.signInLink} onPress={() => navigation.navigate('AuthMethods')}>
            Se connecter
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  illustration: { alignItems: 'center', minHeight: 360 },
  halo: {
    position: 'absolute', top: 0, width: 380, height: 380, borderRadius: 190,
    backgroundColor: T.brandSoft, opacity: 0.5,
  },
  body: { paddingHorizontal: 28, alignItems: 'center' },
  wordmark: { fontSize: 38, fontWeight: '700', letterSpacing: -1.5, color: T.ink },
  title: {
    fontSize: 30, fontWeight: '700', letterSpacing: -0.6, lineHeight: 35,
    color: T.ink, marginTop: 24, textAlign: 'center',
  },
  subtitle: {
    fontSize: 15, color: T.ink3, marginTop: 10, lineHeight: 22, textAlign: 'center',
  },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18 },
  signIn: { textAlign: 'center', marginTop: 14, fontSize: 14, color: T.ink2 },
  signInLink: { color: T.brand, fontWeight: '600' },
});
