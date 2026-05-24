import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet, StatusBar, Alert,
  ScrollView, Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../../theme';
import { TopNav } from '../../components/TopNav';
import { PrimaryButton } from '../../components/Button';
import { StepProgress } from '../../components/StepProgress';
import { BackIcon, ShieldIcon } from '../../icons/Icons';
import { OnboardingStackParamList } from '../../navigation';
import { useAuth } from '../../lib/auth';

type Nav = StackNavigationProp<OnboardingStackParamList, 'OTP'>;
type Rt = RouteProp<OnboardingStackParamList, 'OTP'>;

const OTP_LENGTH = 6;

export const OTPScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();

  const email = route.params?.email;
  const phone = route.params?.phone;
  const isPhone = !!phone;
  const recipient = phone ?? email ?? '';

  const { verifyOtp, verifyPhoneOtp, resendOtp } = useAuth();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [submitting, setSubmitting] = useState(false);

  const handleVerify = async () => {
    if (code.length < OTP_LENGTH || submitting) return;
    setSubmitting(true);
    Keyboard.dismiss();
    try {
      if (isPhone) {
        await verifyPhoneOtp(phone!, code);
        // Session auto-set → RootNavigator switches to Main
      } else {
        await verifyOtp(email!, code);
        // Session is now active. justSignedUp flag in AuthContext makes
        // RootNavigator render WelcomeHomeScreen before unlocking Main.
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Code invalide';
      Alert.alert('Vérification échouée', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      if (isPhone) {
        // For phone, re-send by calling signInWithPhone again
        Alert.alert('Code renvoyé', `Un nouveau code a été envoyé au ${phone}`);
      } else {
        await resendOtp(email!);
      }
      setSeconds(30);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible de renvoyer le code';
      Alert.alert('Erreur', message);
    }
  };

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const handleChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
    if (digits.length === OTP_LENGTH) Keyboard.dismiss();
  };

  const cells = Array.from({ length: OTP_LENGTH }).map((_, i) => code[i] ?? '');
  const cursorIndex = code.length < OTP_LENGTH ? code.length : -1;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ paddingTop: insets.top }}>
        <TopNav
          title="Vérification"
          sub={isPhone ? undefined : '2 / 3'}
          left={
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <BackIcon size={22} color={T.ink} />
            </TouchableOpacity>
          }
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 22,
          paddingBottom: insets.bottom + 24,
          justifyContent: 'space-between',
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
      >
        <View>
          {!isPhone && <StepProgress total={3} current={2} style={{ marginBottom: 22 }} />}

          <View style={styles.badge}>
            <ShieldIcon size={14} color={T.brandInk} />
            <Text style={styles.badgeText}>Code envoyé</Text>
          </View>

          <Text style={styles.title}>Saisissez le code à {OTP_LENGTH} chiffres</Text>
          <Text style={styles.subtitle}>
            Envoyé {isPhone ? 'par SMS au' : 'à'}{' '}
            <Text style={{ color: T.ink, fontWeight: '600' }}>{recipient}</Text>
            {'  ·  '}
            <Text style={styles.link} onPress={() => navigation.goBack()}>changer</Text>
          </Text>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            autoFocus
            style={styles.hiddenInput}
          />

          <Pressable style={styles.cells} onPress={() => inputRef.current?.focus()}>
            {cells.map((digit, i) => (
              <View key={i} style={[styles.cell, i === cursorIndex && styles.cellActive]}>
                <Text style={styles.cellText}>{digit}</Text>
              </View>
            ))}
          </Pressable>

          <Text style={styles.resend}>
            Pas reçu ?{' '}
            {seconds > 0 ? (
              <Text style={{ color: T.brand, fontWeight: '600' }}>
                Renvoyer dans 0:{seconds.toString().padStart(2, '0')}
              </Text>
            ) : (
              <Text style={styles.link} onPress={handleResend}>Renvoyer le code</Text>
            )}
          </Text>
        </View>

        <PrimaryButton
          onPress={handleVerify}
          style={code.length < OTP_LENGTH || submitting ? { opacity: 0.4, marginTop: 24 } : { marginTop: 24 }}
        >
          {submitting ? 'Vérification…' : 'Vérifier'}
        </PrimaryButton>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99,
    backgroundColor: T.brandSoft,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: T.brandInk },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3, color: T.ink, lineHeight: 29, marginTop: 12 },
  subtitle: { fontSize: 14, color: T.ink3, marginTop: 6, lineHeight: 20 },
  link: { color: T.brand, fontWeight: '600' },
  hiddenInput: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  cells: { flexDirection: 'row', gap: 8, marginTop: 22 },
  cell: {
    flex: 1, aspectRatio: 1, borderRadius: 12, backgroundColor: T.surface,
    borderWidth: 1, borderColor: T.sep,
    alignItems: 'center', justifyContent: 'center',
  },
  cellActive: { borderWidth: 2, borderColor: T.brand },
  cellText: { fontSize: 22, fontWeight: '700', color: T.ink },
  resend: { marginTop: 18, textAlign: 'center', fontSize: 13, color: T.ink3 },
});
