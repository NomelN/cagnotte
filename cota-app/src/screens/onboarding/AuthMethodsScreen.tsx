import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../../theme';
import { BackIcon, CotaMark, AppleIcon, GoogleIcon, MailIcon } from '../../icons/Icons';
import { OnboardingStackParamList } from '../../navigation';

type Nav = StackNavigationProp<OnboardingStackParamList, 'AuthMethods'>;

interface MethodProps {
  icon: React.ReactNode;
  label: string;
  bg: string;
  fg: string;
  border?: boolean;
  onPress: () => void;
}

const Method = ({ icon, label, bg, fg, border, onPress }: MethodProps) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.method, { backgroundColor: bg }, border && styles.methodBorder]}
  >
    {icon}
    <Text style={[styles.methodLabel, { color: fg }]}>{label}</Text>
  </TouchableOpacity>
);

export const AuthMethodsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const goToEmail = () => navigation.navigate('EmailForm');

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
      </View>

      <View style={styles.intro}>
        <CotaMark size={56} color={T.brand} />
        <Text style={styles.title}>Créez votre compte</Text>
        <Text style={styles.subtitle}>
          Choisissez votre méthode préférée. Vous pourrez la changer plus tard.
        </Text>
      </View>

      <View style={styles.methods}>
        <Method
          bg="#000" fg="#fff"
          icon={<AppleIcon size={20} color="#fff" />}
          label="Continuer avec Apple"
          onPress={goToEmail}
        />
        <Method
          bg="#fff" fg={T.ink} border
          icon={<GoogleIcon size={20} />}
          label="Continuer avec Google"
          onPress={goToEmail}
        />
        <Method
          bg={T.brand} fg="#fff"
          icon={<MailIcon size={20} />}
          label="Continuer avec email"
          onPress={goToEmail}
        />

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={goToEmail} style={styles.phoneBtn}>
          <Text style={styles.phoneBtnText}>Continuer avec un n° de téléphone</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <Text style={styles.legal}>
          En continuant, vous acceptez nos <Text style={styles.legalLink}>Conditions d'utilisation</Text> et notre{' '}
          <Text style={styles.legalLink}>Politique de confidentialité</Text>.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  intro: { paddingHorizontal: 28, alignItems: 'center', marginTop: 8 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, color: T.ink, marginTop: 18 },
  subtitle: { fontSize: 14, color: T.ink3, marginTop: 6, lineHeight: 21, textAlign: 'center' },
  methods: { paddingHorizontal: 18, marginTop: 26, gap: 10 },
  method: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 15, paddingHorizontal: 16, borderRadius: 14,
  },
  methodBorder: { borderWidth: 1, borderColor: T.sep },
  methodLabel: { fontSize: 16, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4, paddingHorizontal: 4 },
  divider: { flex: 1, height: 0.5, backgroundColor: T.sep },
  dividerText: { fontSize: 12, color: T.ink3 },
  phoneBtn: {
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14,
    borderWidth: 1, borderColor: T.ink4, borderStyle: 'dashed', alignItems: 'center',
  },
  phoneBtnText: { fontSize: 15, fontWeight: '600', color: T.ink },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 28 },
  legal: { fontSize: 11, color: T.ink3, lineHeight: 17, textAlign: 'center' },
  legalLink: { textDecorationLine: 'underline' },
});
