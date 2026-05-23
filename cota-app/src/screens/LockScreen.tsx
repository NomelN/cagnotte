import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../theme';
import { CotaMark, ShieldIcon } from '../icons/Icons';
import { promptBiometric, getBiometricType, BiometricType } from '../lib/biometrics';

const BUTTON_LABELS: Record<BiometricType, string> = {
  faceid: 'Déverrouiller avec Face ID',
  fingerprint: 'Déverrouiller avec l\'empreinte',
  none: 'Déverrouiller',
};

interface Props {
  onUnlock: () => void;
}

export const LockScreen = ({ onUnlock }: Props) => {
  const insets = useSafeAreaInsets();
  const [trying, setTrying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [biometricType, setBiometricType] = React.useState<BiometricType>('none');

  React.useEffect(() => {
    getBiometricType().then(setBiometricType);
    tryUnlock();
  }, []);

  const tryUnlock = async () => {
    if (trying) return;
    setTrying(true);
    setFailed(false);
    try {
      const ok = await promptBiometric('Déverrouillez Cota');
      if (ok) {
        onUnlock();
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setTrying(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.top}>
        <CotaMark size={64} color="#fff" />
        <Text style={styles.appName}>Cota</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.lockBadge}>
          <ShieldIcon size={28} color={T.brand} />
        </View>
        <Text style={styles.title}>Application verrouillée</Text>
        <Text style={styles.subtitle}>
          {failed
            ? 'Identification échouée. Réessayez pour accéder à Cota.'
            : 'Vérification en cours…'}
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={tryUnlock}
          activeOpacity={0.85}
          disabled={trying}
        >
          <Text style={styles.btnText}>
            {trying ? 'Vérification…' : BUTTON_LABELS[biometricType]}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.ink,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  top: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 },
  appName: { fontSize: 28, fontWeight: '700', color: '#fff', letterSpacing: -0.5 },
  bottom: { width: '100%', alignItems: 'center', gap: 10 },
  lockBadge: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 20 },
  btn: {
    marginTop: 12, backgroundColor: T.brand,
    borderRadius: 14, paddingVertical: 16,
    width: '100%', alignItems: 'center',
  },
  btnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
