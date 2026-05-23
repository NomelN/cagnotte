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
import { BackIcon, EyeIcon, CheckIcon } from '../../icons/Icons';
import { StepProgress } from '../../components/StepProgress';
import { OnboardingStackParamList } from '../../navigation';
import { useAuth } from '../../lib/auth';

type Nav = StackNavigationProp<OnboardingStackParamList, 'EmailForm'>;
type Rt = RouteProp<OnboardingStackParamList, 'EmailForm'>;

export const EmailFormScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const mode = route.params?.mode ?? 'signup';
  const isLogin = mode === 'login';

  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);

  const canContinue = email.includes('@') && password.length >= 8 && !submitting;

  const handleSubmit = async () => {
    if (!canContinue) return;
    setSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email.trim(), password);
        // Session change in AuthContext triggers RootNavigator to switch to Main automatically
      } else {
        await signUp(email.trim(), password);
        navigation.navigate('OTP', { email: email.trim() });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : isLogin ? 'Identifiants incorrects' : 'Échec de l\'inscription';
      Alert.alert(isLogin ? 'Connexion impossible' : 'Inscription impossible', message);
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
          sub={isLogin ? undefined : '1 / 3'}
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
          {!isLogin && <StepProgress total={3} current={1} style={{ marginBottom: 22 }} />}

          <Text style={styles.title}>
            {isLogin ? 'Votre adresse email' : 'Votre adresse email'}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? 'Saisissez l\'email et le mot de passe de votre compte.'
              : 'Nous enverrons un code à 6 chiffres pour confirmer.'}
          </Text>

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

          {isLogin && (
            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          )}

          {!isLogin && (
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
          )}

          <PrimaryButton
            onPress={handleSubmit}
            style={canContinue ? styles.submitBtn : { ...styles.submitBtn, opacity: 0.4 }}
          >
            {submitting
              ? isLogin ? 'Connexion…' : 'Envoi…'
              : isLogin ? 'Se connecter' : 'Continuer'}
          </PrimaryButton>

          <Text style={styles.switchMode}>
            {isLogin ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
            <Text
              style={styles.switchModeLink}
              onPress={() => navigation.replace('EmailForm', { mode: isLogin ? 'signup' : 'login' })}
            >
              {isLogin ? 'Créer un compte' : 'Se connecter'}
            </Text>
          </Text>
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
  scrollContent: {
    padding: 22,
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
  forgotRow: { alignSelf: 'flex-end', marginTop: 8, padding: 4 },
  forgotText: { fontSize: 13, color: T.brand, fontWeight: '600' },
  consentRow: { flexDirection: 'row', gap: 8, marginTop: 14, alignItems: 'flex-start' },
  checkbox: {
    width: 18, height: 18, borderRadius: 5, marginTop: 1,
    borderWidth: 1.5, borderColor: T.ink4,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: T.brand, borderColor: T.brand },
  consentText: { flex: 1, fontSize: 12, color: T.ink2, lineHeight: 18 },
  submitBtn: { marginTop: 24 },
  switchMode: { marginTop: 16, textAlign: 'center', fontSize: 13, color: T.ink3 },
  switchModeLink: { color: T.brand, fontWeight: '600' },
});
