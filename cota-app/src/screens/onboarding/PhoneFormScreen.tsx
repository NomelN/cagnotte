import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../../theme';
import { TopNav } from '../../components/TopNav';
import { PrimaryButton } from '../../components/Button';
import { BackIcon } from '../../icons/Icons';
import { OnboardingStackParamList } from '../../navigation';
import { useAuth } from '../../lib/auth';

type Nav = StackNavigationProp<OnboardingStackParamList, 'PhoneForm'>;
type Rt = RouteProp<OnboardingStackParamList, 'PhoneForm'>;

const COUNTRY_CODES = [
  { flag: '🇫🇷', code: '+33', label: 'France' },
  { flag: '🇧🇪', code: '+32', label: 'Belgique' },
  { flag: '🇨🇭', code: '+41', label: 'Suisse' },
  { flag: '🇨🇦', code: '+1', label: 'Canada' },
];

export const PhoneFormScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const mode = route.params?.mode ?? 'signup';
  const isLogin = mode === 'login';

  const { signInWithPhone } = useAuth();
  const [countryIndex, setCountryIndex] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const country = COUNTRY_CODES[countryIndex];
  const fullPhone = country.code + phoneNumber.replace(/\s/g, '');
  const canContinue = phoneNumber.replace(/\D/g, '').length >= 9 && !submitting;

  const handleSubmit = async () => {
    if (!canContinue) return;
    setSubmitting(true);
    try {
      await signInWithPhone(fullPhone);
      navigation.navigate('OTP', { phone: fullPhone });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible d\'envoyer le code';
      Alert.alert('Erreur', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ paddingTop: insets.top }}>
        <TopNav
          title={isLogin ? 'Connexion' : 'Inscription'}
          left={
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <BackIcon size={22} color={T.ink} />
            </TouchableOpacity>
          }
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 56}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Votre numéro de téléphone</Text>
          <Text style={styles.subtitle}>
            Nous vous enverrons un code par SMS pour confirmer votre numéro.
          </Text>

          <Text style={[styles.label, { marginTop: 22 }]}>Numéro de téléphone</Text>
          <View style={[styles.phoneRow, focused && styles.phoneRowFocused]}>
            <TouchableOpacity
              style={styles.countryBtn}
              onPress={() => setShowPicker(s => !s)}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{country.flag}</Text>
              <Text style={styles.countryCode}>{country.code}</Text>
              <Text style={styles.chevron}>▾</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TextInput
              style={styles.phoneInput}
              placeholder="06 12 34 56 78"
              placeholderTextColor={T.ink3}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoFocus
            />
          </View>

          {showPicker && (
            <View style={styles.picker}>
              {COUNTRY_CODES.map((c, i) => (
                <TouchableOpacity
                  key={c.code}
                  style={[styles.pickerRow, i === countryIndex && styles.pickerRowActive]}
                  onPress={() => { setCountryIndex(i); setShowPicker(false); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flag}>{c.flag}</Text>
                  <Text style={styles.pickerLabel}>{c.label}</Text>
                  <Text style={styles.pickerCode}>{c.code}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.hint}>
            En continuant, vous acceptez de recevoir un SMS de confirmation. Des frais opérateur peuvent s'appliquer.
          </Text>

          <PrimaryButton
            onPress={handleSubmit}
            style={canContinue ? styles.submitBtn : { ...styles.submitBtn, opacity: 0.4 }}
          >
            {submitting ? 'Envoi du code…' : 'Recevoir le code'}
          </PrimaryButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  scrollContent: { padding: 22 },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3, color: T.ink, lineHeight: 29 },
  subtitle: { fontSize: 14, color: T.ink3, marginTop: 6, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '600', color: T.ink2, marginBottom: 6 },
  phoneRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.surface, borderRadius: 14,
    borderWidth: 1, borderColor: T.sep, overflow: 'hidden',
    minHeight: 50,
  },
  phoneRowFocused: { borderWidth: 2, borderColor: T.brand },
  countryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 14,
  },
  flag: { fontSize: 20 },
  countryCode: { fontSize: 15, fontWeight: '600', color: T.ink },
  chevron: { fontSize: 10, color: T.ink3 },
  separator: { width: 1, height: 28, backgroundColor: T.sep },
  phoneInput: {
    flex: 1, paddingHorizontal: 12, fontSize: 16, color: T.ink,
  },
  picker: {
    backgroundColor: T.surface, borderRadius: 14, marginTop: 6,
    borderWidth: 1, borderColor: T.sep, overflow: 'hidden',
  },
  pickerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 13,
  },
  pickerRowActive: { backgroundColor: T.brandSoft },
  pickerLabel: { flex: 1, fontSize: 15, color: T.ink, fontWeight: '500' },
  pickerCode: { fontSize: 14, color: T.ink3 },
  hint: { fontSize: 12, color: T.ink3, lineHeight: 18, marginTop: 14 },
  submitBtn: { marginTop: 24 },
});
