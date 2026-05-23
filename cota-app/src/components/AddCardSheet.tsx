import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StripeProvider, CardField, useConfirmSetupIntent } from '@stripe/stripe-react-native';
import type { CardFieldInput } from '@stripe/stripe-react-native';
import { T } from '../theme';
import { callStripe } from '../lib/stripe';
import { PrimaryButton } from './Button';
import { ShieldIcon } from '../icons/Icons';

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

interface AddCardSheetProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const Sheet = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.backdrop}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ width: '100%' }}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>{children}</View>
      </KeyboardAvoidingView>
    </View>
  );
};

const SheetHeader = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.header}>
    <Text style={styles.title}>Ajouter une carte</Text>
    <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Text style={styles.close}>Fermer</Text>
    </TouchableOpacity>
  </View>
);

// Shown when EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured yet.
const MissingKey = ({ onClose }: { onClose: () => void }) => (
  <Sheet>
    <SheetHeader onClose={onClose} />
    <Text style={styles.warn}>
      La clé Stripe n'est pas encore configurée. Ajoute{' '}
      <Text style={{ fontWeight: '700' }}>EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY</Text> dans le
      fichier .env puis relance l'application.
    </Text>
  </Sheet>
);

const CardForm = ({ onClose, onSaved }: Omit<AddCardSheetProps, 'visible'>) => {
  const { confirmSetupIntent } = useConfirmSetupIntent();
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!complete || submitting) return;
    setSubmitting(true);
    try {
      // 1. Server creates a Stripe Customer + SetupIntent.
      const { clientSecret } = await callStripe<{ clientSecret: string }>({
        action: 'setup-intent',
      });
      // 2. Stripe tokenises the card on-device and confirms the SetupIntent.
      const { setupIntent, error } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: 'Card',
      });
      if (error) throw new Error(error.message);
      const paymentMethodId = setupIntent?.paymentMethodId;
      if (!paymentMethodId) throw new Error("La carte n'a pas pu être validée.");
      // 3. Server persists the card metadata (brand / last4 / expiry).
      await callStripe({ action: 'save-payment-method', paymentMethodId });
      onSaved();
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : "Échec de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetHeader onClose={onClose} />

      <CardField
        postalCodeEnabled={false}
        placeholders={{ number: '4242 4242 4242 4242' }}
        cardStyle={{
          backgroundColor: T.field,
          textColor: T.ink,
          placeholderColor: T.ink3,
          borderRadius: 12,
          fontSize: 15,
        }}
        style={styles.cardField}
        onCardChange={(d: CardFieldInput.Details) => setComplete(d.complete)}
      />

      <View style={styles.securityRow}>
        <ShieldIcon size={14} color={T.ink3} />
        <Text style={styles.securityText}>
          Saisie chiffrée par Stripe — le numéro ne transite jamais par nos serveurs.
        </Text>
      </View>

      <PrimaryButton
        onPress={handleSave}
        style={!complete || submitting ? { opacity: 0.4 } : undefined}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          'Enregistrer la carte'
        )}
      </PrimaryButton>
    </Sheet>
  );
};

export default function AddCardSheet({ visible, onClose, onSaved }: AddCardSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {PUBLISHABLE_KEY ? (
        <StripeProvider publishableKey={PUBLISHABLE_KEY}>
          <CardForm onClose={onClose} onSaved={onSaved} />
        </StripeProvider>
      ) : (
        <MissingKey onClose={onClose} />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: T.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: { fontSize: 19, fontWeight: '700', color: T.ink, letterSpacing: -0.3 },
  close: { fontSize: 15, fontWeight: '600', color: T.brand },
  cardField: {
    height: 50,
    marginBottom: 14,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
  },
  securityText: { fontSize: 12, color: T.ink3, flex: 1, lineHeight: 16 },
  warn: { fontSize: 14, color: T.ink2, lineHeight: 21, marginBottom: 8 },
});
