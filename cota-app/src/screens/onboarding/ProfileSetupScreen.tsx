import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../../theme';
import { TopNav } from '../../components/TopNav';
import { Avatar } from '../../components/Avatar';
import { PrimaryButton } from '../../components/Button';
import { StepProgress } from '../../components/StepProgress';
import { BackIcon, CameraIcon } from '../../icons/Icons';
import { OnboardingStackParamList } from '../../navigation';
import { useAuth } from '../../lib/auth';

type Nav = StackNavigationProp<OnboardingStackParamList, 'ProfileSetup'>;

export const ProfileSetupScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { updateProfile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [focused, setFocused] = useState<'first' | 'last' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const initial = (firstName.trim()[0] ?? 'A').toUpperCase();

  const handleFinish = async () => {
    if (!firstName.trim() || submitting) return;
    setSubmitting(true);
    try {
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() });
      navigation.navigate('WelcomeHome', { firstName: firstName.trim() });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible d\'enregistrer le profil';
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
          title="Votre profil"
          sub="3 / 3"
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
          <StepProgress total={3} current={3} style={{ marginBottom: 22 }} />

          <Text style={styles.title}>Comment vous appelle-t-on ?</Text>
          <Text style={styles.subtitle}>
            Vos proches verront ce nom quand vous créerez une cagnotte.
          </Text>

          {/* Avatar picker */}
          <View style={styles.avatarWrap}>
            <View>
              <Avatar initials={initial} tone="green" size={112} />
              <TouchableOpacity style={styles.cameraBtn}>
                <CameraIcon size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={[styles.input, focused === 'first' && styles.inputFocused]}
            placeholder="Votre prénom"
            placeholderTextColor={T.ink3}
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setFocused('first')}
            onBlur={() => setFocused(null)}
          />

          <Text style={[styles.label, { marginTop: 14 }]}>Nom</Text>
          <TextInput
            style={[styles.input, focused === 'last' && styles.inputFocused]}
            placeholder="Votre nom"
            placeholderTextColor={T.ink3}
            value={lastName}
            onChangeText={setLastName}
            onFocus={() => setFocused('last')}
            onBlur={() => setFocused(null)}
          />
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
          <PrimaryButton
            onPress={handleFinish}
            style={!firstName.trim() || submitting ? { opacity: 0.4 } : undefined}
          >
            {submitting ? 'Enregistrement…' : 'Terminer'}
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
  avatarWrap: { alignItems: 'center', marginVertical: 22 },
  cameraBtn: {
    position: 'absolute', right: -4, bottom: 0,
    width: 34, height: 34, borderRadius: 17, backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.16, shadowRadius: 6,
  },
  label: { fontSize: 12, fontWeight: '600', color: T.ink2, marginBottom: 6 },
  input: {
    backgroundColor: T.surface, borderRadius: 14, paddingHorizontal: 14,
    minHeight: 50, fontSize: 16, color: T.ink,
    borderWidth: 1, borderColor: T.sep,
  },
  inputFocused: { borderWidth: 2, borderColor: T.brand },
  footer: {
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: 'rgba(242,242,247,0.97)',
    borderTopWidth: 0.5, borderTopColor: T.sep,
  },
});
