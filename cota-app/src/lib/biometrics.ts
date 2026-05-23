import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_KEY = 'cota_biometric_enabled';

export type BiometricType = 'faceid' | 'fingerprint' | 'none';

export async function getBiometricType(): Promise<BiometricType> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return 'none';
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) return 'none';
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return 'faceid';
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return 'fingerprint';
  return 'none';
}

export async function isBiometricEnabled(): Promise<boolean> {
  const val = await SecureStore.getItemAsync(BIOMETRIC_KEY);
  return val === 'true';
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(BIOMETRIC_KEY, enabled ? 'true' : 'false');
}

export async function promptBiometric(reason: string): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    cancelLabel: 'Annuler',
    disableDeviceFallback: false,
  });
  return result.success;
}
