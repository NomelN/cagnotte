import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  Switch, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T } from '../theme';
import { BackIcon, ShieldIcon, KeyIcon, ChevRIcon } from '../icons/Icons';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import {
  getBiometricType, isBiometricEnabled, setBiometricEnabled, promptBiometric,
  BiometricType,
} from '../lib/biometrics';

const BIOMETRIC_LABELS: Record<BiometricType, string> = {
  faceid: 'Face ID',
  fingerprint: 'Touch ID / Empreinte',
  none: 'Biométrie',
};

export const SecurityScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuth();

  const [biometricType, setBiometricType] = useState<BiometricType>('none');
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [togglingBiometric, setTogglingBiometric] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  useEffect(() => {
    (async () => {
      const [type, enabled] = await Promise.all([getBiometricType(), isBiometricEnabled()]);
      setBiometricType(type);
      setBiometricEnabledState(enabled);
      setLoading(false);
    })();
  }, []);

  const handleToggleBiometric = async (value: boolean) => {
    if (togglingBiometric) return;
    setTogglingBiometric(true);
    try {
      if (value) {
        const ok = await promptBiometric(`Activer ${BIOMETRIC_LABELS[biometricType]} pour Cota`);
        if (!ok) return;
      }
      await setBiometricEnabled(value);
      setBiometricEnabledState(value);
    } catch {
      Alert.alert('Erreur', 'Impossible de modifier le paramètre biométrique.');
    } finally {
      setTogglingBiometric(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email || sendingReset) return;
    Alert.alert(
      'Changer le mot de passe',
      `Un email de réinitialisation sera envoyé à ${user.email}.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Envoyer',
          onPress: async () => {
            setSendingReset(true);
            try {
              const { error } = await supabase.auth.resetPasswordForEmail(user.email!, {
                redirectTo: 'cota://reset-password',
              });
              if (error) throw error;
              Alert.alert('Email envoyé', `Consultez votre boîte mail pour réinitialiser votre mot de passe.`);
            } catch (err) {
              Alert.alert('Erreur', err instanceof Error ? err.message : "Impossible d'envoyer l'email.");
            } finally {
              setSendingReset(false);
            }
          },
        },
      ],
    );
  };

  const biometricAvailable = biometricType !== 'none';
  const hasEmail = !!user?.email;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sécurité</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={T.brand} />
        </View>
      ) : (
        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>

          {/* Biometrics */}
          <Text style={styles.sectionLabel}>DÉVERROUILLAGE</Text>
          <View style={styles.group}>
            <View style={[styles.row, !biometricAvailable && { opacity: 0.4 }]}>
              <View style={styles.rowIcon}>
                <ShieldIcon size={20} color={T.brand} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.rowTitle}>{BIOMETRIC_LABELS[biometricType]}</Text>
                <Text style={styles.rowSub}>
                  {biometricAvailable
                    ? 'Déverrouillez l\'app avec votre biométrie'
                    : 'Non disponible sur cet appareil'}
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleToggleBiometric}
                disabled={!biometricAvailable || togglingBiometric}
                trackColor={{ false: T.sep, true: T.brand }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Password */}
          {hasEmail && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 24 }]}>MOT DE PASSE</Text>
              <View style={styles.group}>
                <TouchableOpacity
                  style={styles.row}
                  activeOpacity={0.7}
                  onPress={handlePasswordReset}
                  disabled={sendingReset}
                >
                  <View style={styles.rowIcon}>
                    <KeyIcon size={20} color={T.brand} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.rowTitle}>Changer le mot de passe</Text>
                    <Text style={styles.rowSub}>{user.email}</Text>
                  </View>
                  {sendingReset
                    ? <ActivityIndicator size="small" color={T.brand} />
                    : <ChevRIcon size={14} color={T.ink4} />}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12, gap: 8,
  },
  headerTitle: {
    flex: 1, fontSize: 17, fontWeight: '600',
    color: T.ink, textAlign: 'center',
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3,
  },
  sectionLabel: {
    fontSize: 12, color: T.ink3, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
  },
  group: {
    backgroundColor: T.surface, borderRadius: 16,
    borderWidth: 1, borderColor: T.sep, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  rowIcon: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { fontSize: 16, fontWeight: '500', color: T.ink },
  rowSub: { fontSize: 12, color: T.ink3, marginTop: 1 },
});
