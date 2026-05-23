import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../../theme';
import { Chip } from '../../components/Chip';
import { PrimaryButton } from '../../components/Button';
import { StickyCTA } from '../../components/StickyCTA';
import { TopNav } from '../../components/TopNav';
import { BackIcon, LockIcon, ArrowRIcon } from '../../icons/Icons';
import { GuestStackParamList } from '../../navigation';
import { StepIndicator } from './StepIndicator';

type Nav = StackNavigationProp<GuestStackParamList, 'GuestContribute'>;

const AMOUNTS = [10, 20, 50, 100];

const Section = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.label}>{children}</Text>
);

export const PublicContributeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [amountStr, setAmountStr] = useState('50');
  const amountInputRef = useRef<TextInput>(null);
  const amount = (() => {
    const v = parseFloat(amountStr.replace(',', '.'));
    return Number.isFinite(v) && v > 0 ? Math.round(v * 100) / 100 : 0;
  })();

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ paddingTop: insets.top }}>
        <TopNav
          title="Contribuer"
          sub="Vacances en famille — Bali"
          left={
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
              <BackIcon size={22} color={T.ink} />
            </TouchableOpacity>
          }
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 18 }}>
          <StepIndicator step={1} />

          <Section>MONTANT</Section>
          <TouchableOpacity
            style={styles.amountCard}
            onPress={() => amountInputRef.current?.focus()}
            activeOpacity={0.9}
          >
            <Text style={styles.amountText}>
              {amountStr || '0'}
              <Text style={{ color: T.ink3, fontWeight: '600' }}> €</Text>
            </Text>
            <Text style={styles.amountSub}>Frais de service : 0 € · 100% pour Alexandre</Text>
            <TextInput
              ref={amountInputRef}
              style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }}
              value={amountStr}
              onChangeText={(t) => setAmountStr(t.replace(/[^\d.,]/g, ''))}
              keyboardType="decimal-pad"
              returnKeyType="done"
              maxLength={7}
              caretHidden
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {AMOUNTS.map((a) => (
              <Chip key={a} active={amount === a} onPress={() => setAmountStr(String(a))}>
                {a} €
              </Chip>
            ))}
          </View>

          <Section>DE VOTRE PART</Section>
          <View style={styles.fieldCard}>
            <View style={[styles.fieldRow, { borderBottomWidth: 0.5, borderBottomColor: T.sep }]}>
              <Text style={styles.fieldKey}>Prénom</Text>
              <Text style={styles.fieldValue}>Camille</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldKey}>Email</Text>
              <Text style={styles.fieldValue}>camille.b@email.com</Text>
            </View>
          </View>
          <View style={styles.privacyRow}>
            <LockIcon size={12} color={T.ink3} />
            <Text style={styles.privacyText}>Pour le reçu de paiement uniquement, jamais partagé.</Text>
          </View>

          <Section>
            PETIT MOT <Text style={styles.optional}>(optionnel)</Text>
          </Section>
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>Bon voyage à Bali, profitez bien !</Text>
          </View>
          <View style={styles.messageMeta}>
            <Text style={styles.privacyText}>Visible par Alexandre et les autres contributeurs.</Text>
            <Text style={styles.privacyText}>34 / 200</Text>
          </View>
        </View>
      </ScrollView>

      <StickyCTA>
        <PrimaryButton onPress={() => navigation.navigate('GuestPayment', { amount })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.ctaText}>Continuer vers le paiement</Text>
            <ArrowRIcon size={18} color="#fff" />
          </View>
        </PrimaryButton>
      </StickyCTA>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: T.ink3,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginTop: 22,
    marginBottom: 8,
  },
  optional: { textTransform: 'none', letterSpacing: 0, color: T.ink4, fontWeight: '500' },
  amountCard: {
    backgroundColor: T.surface,
    borderRadius: 20,
    paddingVertical: 26,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.sep,
  },
  amountText: { fontSize: 52, fontWeight: '700', letterSpacing: -1.5, color: T.ink, lineHeight: 56 },
  amountSub: { fontSize: 12, color: T.ink3, marginTop: 8 },
  fieldCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: T.sep,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  fieldKey: { fontSize: 13, color: T.ink3, width: 60 },
  fieldValue: { flex: 1, fontSize: 15, fontWeight: '500', color: T.ink },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingHorizontal: 4 },
  privacyText: { fontSize: 11, color: T.ink3 },
  messageCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 14,
    minHeight: 90,
    borderWidth: 1,
    borderColor: T.sep,
  },
  messageText: { fontSize: 15, color: T.ink2, lineHeight: 22 },
  messageMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
