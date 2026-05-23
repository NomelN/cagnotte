import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../../theme';
import { BackIcon, CotaMark, GoogleIcon, FacebookIcon, EyeIcon, EyeOffIcon } from '../../icons/Icons';
import { OnboardingStackParamList } from '../../navigation';
import { useAuth } from '../../lib/auth';

type Nav = StackNavigationProp<OnboardingStackParamList, 'AuthMethods'>;
type Rt = RouteProp<OnboardingStackParamList, 'AuthMethods'>;

export const AuthMethodsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const mode = route.params?.mode ?? 'signup';
  const isLogin = mode === 'login';

  const { signIn, signUp, signInWithGoogle, signInWithFacebook } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const handleEmailSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert('Champs requis', 'Veuillez saisir votre email et votre mot de passe.');
      return;
    }
    setLoadingEmail(true);
    try {
      if (isLogin) {
        await signIn(trimmedEmail, password);
      } else {
        await signUp(trimmedEmail, password);
      }
    } catch (err: any) {
      Alert.alert(
        isLogin ? 'Connexion impossible' : 'Inscription impossible',
        err?.message ?? 'Une erreur est survenue.',
      );
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogle = async () => {
    setLoadingGoogle(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      Alert.alert('Google', err?.message ?? 'Connexion Google impossible');
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleFacebook = async () => {
    setLoadingFacebook(true);
    try {
      await signInWithFacebook();
    } catch (err: any) {
      Alert.alert('Facebook', err?.message ?? 'Connexion Facebook impossible');
    } finally {
      setLoadingFacebook(false);
    }
  };

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loadingEmail;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: T.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 24 }}
      >
        <View style={styles.intro}>
          <CotaMark size={52} color={T.brand} />
          <Text style={styles.title}>{isLogin ? 'Bon retour !' : 'Créez votre compte'}</Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? 'Connectez-vous pour accéder à vos cagnottes.'
              : 'Créez votre compte pour démarrer.'}
          </Text>
        </View>

        {/* Email + password form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Adresse email"
            placeholderTextColor={T.ink4}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <View style={styles.passwordRow}>
            <TextInput
              ref={passwordRef}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Mot de passe"
              placeholderTextColor={T.ink4}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleEmailSubmit}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(v => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {showPassword
                ? <EyeOffIcon size={20} color={T.ink3} />
                : <EyeIcon size={20} color={T.ink3} />
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && { opacity: 0.5 }]}
            onPress={handleEmailSubmit}
            activeOpacity={0.85}
            disabled={!canSubmit}
          >
            {loadingEmail
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitBtnText}>{isLogin ? 'Se connecter' : 'Créer mon compte'}</Text>
            }
          </TouchableOpacity>

          {isLogin && (
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => navigation.navigate('EmailForm', { mode: 'login' })}
            >
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Social divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.divider} />
        </View>

        {/* Social round buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={[styles.socialBtn, { backgroundColor: '#fff', borderWidth: 1, borderColor: T.sep }]}
            onPress={handleGoogle}
            activeOpacity={0.8}
            disabled={loadingGoogle}
          >
            {loadingGoogle
              ? <ActivityIndicator size="small" color={T.ink} />
              : <GoogleIcon size={22} />
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialBtn, { backgroundColor: '#1877F2' }]}
            onPress={handleFacebook}
            activeOpacity={0.8}
            disabled={loadingFacebook}
          >
            {loadingFacebook
              ? <ActivityIndicator size="small" color="#fff" />
              : <FacebookIcon size={22} color="#fff" />
            }
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {isLogin ? (
            <Text style={styles.legal}>
              Pas encore de compte ?{' '}
              <Text
                style={styles.legalLink}
                onPress={() => navigation.replace('AuthMethods', { mode: 'signup' })}
              >
                Créer un compte
              </Text>
            </Text>
          ) : (
            <>
              <Text style={styles.legal}>
                En continuant, vous acceptez nos{' '}
                <Text style={styles.legalLink}>Conditions d'utilisation</Text> et notre{' '}
                <Text style={styles.legalLink}>Politique de confidentialité</Text>.
              </Text>
              <Text style={[styles.legal, { marginTop: 10 }]}>
                Déjà un compte ?{' '}
                <Text
                  style={styles.legalLink}
                  onPress={() => navigation.replace('AuthMethods', { mode: 'login' })}
                >
                  Se connecter
                </Text>
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  intro: { paddingHorizontal: 28, alignItems: 'center', marginTop: 4 },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5, color: T.ink, marginTop: 16 },
  subtitle: { fontSize: 14, color: T.ink3, marginTop: 6, lineHeight: 20, textAlign: 'center' },
  form: { paddingHorizontal: 20, marginTop: 24, gap: 12 },
  input: {
    backgroundColor: T.surface, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: T.ink,
    borderWidth: 1, borderColor: T.sep,
  },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.surface, borderRadius: 14,
    borderWidth: 1, borderColor: T.sep,
    paddingRight: 14,
  },
  passwordInput: {
    flex: 1, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: T.ink,
  },
  eyeBtn: { padding: 4 },
  submitBtn: {
    backgroundColor: T.brand, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  forgotBtn: { alignItems: 'center', marginTop: -2 },
  forgotText: { fontSize: 13, color: T.brand, fontWeight: '500' },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, marginTop: 22,
  },
  divider: { flex: 1, height: 0.5, backgroundColor: T.sep },
  dividerText: { fontSize: 12, color: T.ink3, fontWeight: '500' },
  socialRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 18,
  },
  socialBtn: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4,
  },
  footer: { paddingHorizontal: 28, marginTop: 28, alignItems: 'center' },
  legal: { fontSize: 11, color: T.ink3, lineHeight: 17, textAlign: 'center' },
  legalLink: { textDecorationLine: 'underline', color: T.brand, fontWeight: '600' },
});
