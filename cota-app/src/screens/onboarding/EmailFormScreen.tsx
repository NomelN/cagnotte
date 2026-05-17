import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../../theme';
import { TopNav } from '../../components/TopNav';
import { PrimaryButton } from '../../components/Button';
import { BackIcon, EyeIcon, CheckIcon } from '../../icons/Icons';
import { StepProgress } from '../../components/StepProgress';
import { OnboardingStackParamList } from '../../navigation';

type Nav = StackNavigationProp<OnboardingStackParamList, 'EmailForm'>;

export const EmailFormScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(true);

  const [emailFocused, setEmailFocused] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);

  const canContinue = email.includes('@') && password.length >= 8;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ paddingTop: insets.top }}>
        <TopNav
          title="Inscription"
          sub="1 / 3"
          left={
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <BackIcon size={22} color={T.ink} />
            </TouchableOpacity>
          }
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 56}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 22 }}
          keyboardShouldPersistTaps="handled"
        >
          <StepProgress total={3} current={1} style={{ marginBottom: 22 }} />

          <Text style={styles.title}>Votre adresse email</Text>
          <Text style={styles.subtitle}>Nous enverrons un code à 6 chiffres pour confirmer.</Text>

          <Text style={[styles.label, { marginTop: 22 }]}>Email</Text>
          <TextInput
            style={[styles.input, emailFocused && styles.inputFocused]}
            placeholder="vous@email.com"
            placeholderTextColor={T.ink3}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />

          <Text style={[styles.label, { marginTop: 14 }]}>Mot de passe</Text>
          <View style={[styles.input, styles.inputRow, pwdFocused && styles.inputFocused]}>
            <TextInput
              style={{ flex: 1, fontSize: 16, color: T.ink, padding: 0 }}
              placeholder="8 caractères minimum"
              placeholderTextColor={T.ink3}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPwdFocused(true)}
              onBlur={() => setPwdFocused(false)}
            />
            <TouchableOpacity onPress={() => setShowPassword(s => !s)}>
              <EyeIcon size={20} color={T.ink3} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.consentRow}
            onPress={() => setConsent(c => !c)}
          >
            <View style={[styles.checkbox, consent && styles.checkboxOn]}>
              {consent && <CheckIcon size={13} color="#fff" />}
            </View>
            <Text style={styles.consentText}>
              J'accepte de recevoir les emails liés à mes cagnottes et notifications importantes.
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
          <PrimaryButton
            onPress={() => navigation.navigate('OTP', { email: email || 'vous@email.com' })}
            style={!canContinue ? { opacity: 0.4 } : undefined}
          >
            Continuer
          </PrimaryButton>
        </View>
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
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3, color: T.ink, lineHeight: 29 },
  subtitle: { fontSize: 14, color: T.ink3, marginTop: 6, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '600', color: T.ink2, marginBottom: 6 },
  input: {
    backgroundColor: T.surface, borderRadius: 14, paddingHorizontal: 14,
    minHeight: 50, fontSize: 16, color: T.ink,
    borderWidth: 1, borderColor: T.sep,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inputFocused: { borderWidth: 2, borderColor: T.brand },
  consentRow: { flexDirection: 'row', gap: 8, marginTop: 14, alignItems: 'flex-start' },
  checkbox: {
    width: 18, height: 18, borderRadius: 5, marginTop: 1,
    borderWidth: 1.5, borderColor: T.ink4,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: T.brand, borderColor: T.brand },
  consentText: { flex: 1, fontSize: 12, color: T.ink2, lineHeight: 18 },
  footer: {
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: 'rgba(242,242,247,0.97)',
    borderTopWidth: 0.5, borderTopColor: T.sep,
  },
});
