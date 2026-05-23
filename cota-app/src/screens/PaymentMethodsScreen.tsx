import React, { Suspense, lazy, useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { BackIcon, CardIcon, PlusIcon, ShieldIcon } from '../icons/Icons';
import { usePaymentMethods, PaymentMethod } from '../data/hooks';
import { callStripe } from '../lib/stripe';
import { ProfileStackParamList } from '../navigation';

type Nav = StackNavigationProp<ProfileStackParamList, 'PaymentMethods'>;

// Lazy so the native Stripe SDK is only evaluated the first time the user
// opens the add-card sheet — keeps the rest of the app Expo-Go friendly.
const AddCardSheet = lazy(() => import('../components/AddCardSheet'));

const brandLabel = (b: string | null): string =>
  b ? b.charAt(0).toUpperCase() + b.slice(1) : 'Carte';

const expLabel = (card: PaymentMethod): string =>
  card.exp_month && card.exp_year
    ? `${String(card.exp_month).padStart(2, '0')}/${String(card.exp_year).slice(-2)}`
    : '—';

export const PaymentMethodsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { cards, loading, refresh } = usePaymentMethods();

  const [sheetMounted, setSheetMounted] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Refresh the list each time the screen comes back into focus (e.g. after
  // dismissing the add-card sheet).
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const openAddCard = () => {
    setSheetMounted(true);
    setSheetVisible(true);
  };

  const handleDelete = (card: PaymentMethod) => {
    Alert.alert(
      'Supprimer la carte',
      `Supprimer la carte ${brandLabel(card.brand)} •••• ${card.last4 ?? ''} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await callStripe({
                action: 'delete-payment-method',
                paymentMethodId: card.stripe_payment_method_id,
              });
              refresh();
            } catch (e) {
              Alert.alert('Erreur', e instanceof Error ? e.message : 'Échec de la suppression.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moyens de paiement</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingHorizontal: 20 }}
      >
        <Text style={styles.sectionLabel}>Mes cartes</Text>

        {loading ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator color={T.brand} />
          </View>
        ) : cards && cards.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <CardIcon size={22} color={T.brand} />
            </View>
            <Text style={styles.emptyTitle}>Aucune carte enregistrée</Text>
            <Text style={styles.emptySub}>
              Ajoutez une carte pour contribuer à des cagnottes en un tap.
            </Text>
          </View>
        ) : (
          cards?.map(card => (
            <View key={card.id} style={styles.cardRow}>
              <View style={styles.cardBrandIcon}>
                <CardIcon size={18} color={T.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardLabel}>
                  {brandLabel(card.brand)} •••• {card.last4 ?? '••••'}
                </Text>
                <Text style={styles.cardSub}>
                  Expire {expLabel(card)}
                  {card.is_default ? ' · Par défaut' : ''}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(card)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.cardDelete}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addCard} onPress={openAddCard} activeOpacity={0.8}>
          <View style={styles.addCardIcon}>
            <PlusIcon size={14} color={T.ink3} />
          </View>
          <Text style={styles.addCardText}>Ajouter une carte</Text>
        </TouchableOpacity>

        <View style={styles.securityRow}>
          <ShieldIcon size={14} color={T.ink3} />
          <Text style={styles.securityText}>
            Vos données de paiement sont chiffrées par Stripe.
          </Text>
        </View>
      </ScrollView>

      {sheetMounted && (
        <Suspense fallback={null}>
          <AddCardSheet
            visible={sheetVisible}
            onClose={() => setSheetVisible(false)}
            onSaved={() => {
              setSheetVisible(false);
              refresh();
            }}
          />
        </Suspense>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '600', color: T.ink, textAlign: 'center' },
  sectionLabel: {
    fontSize: 12, color: T.ink3, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 8, marginTop: 12,
  },
  cardRow: {
    backgroundColor: T.surface, borderRadius: 16, padding: 14, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: T.sep,
  },
  cardBrandIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  cardLabel: { fontSize: 15, fontWeight: '600', color: T.ink },
  cardSub: { fontSize: 12, color: T.ink3, marginTop: 2 },
  cardDelete: { fontSize: 13, fontWeight: '600', color: T.danger },
  emptyCard: {
    backgroundColor: T.surface, borderRadius: 18, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: T.sep, alignItems: 'center',
  },
  emptyIconWrap: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: T.ink, textAlign: 'center' },
  emptySub: { fontSize: 13, color: T.ink3, marginTop: 6, lineHeight: 18, textAlign: 'center', paddingHorizontal: 8 },
  addCard: {
    backgroundColor: T.surface, borderRadius: 18, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: T.ink4, borderStyle: 'dashed',
    marginTop: 4, marginBottom: 16,
  },
  addCardIcon: {
    width: 34, height: 22, borderRadius: 6,
    borderWidth: 1, borderColor: T.ink4, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  addCardText: { fontSize: 15, fontWeight: '500', color: T.ink3 },
  securityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    justifyContent: 'center', marginTop: 8,
  },
  securityText: { fontSize: 12, color: T.ink3, textAlign: 'center', flexShrink: 1 },
});
