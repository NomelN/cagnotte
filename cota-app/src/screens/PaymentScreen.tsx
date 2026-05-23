import React, { Suspense, lazy, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../theme';
import { CardIcon, PlusIcon, ShieldIcon } from '../icons/Icons';
import { usePaymentMethods, PaymentMethod } from '../data/hooks';
import { callStripe } from '../lib/stripe';

// Lazily loaded so the native Stripe SDK is only evaluated when the user
// actually opens the "add card" sheet — keeps the app runnable in Expo Go.
const AddCardSheet = lazy(() => import('../components/AddCardSheet'));

const TABS = ['Historique', 'Cartes'] as const;
type Tab = typeof TABS[number];

const brandLabel = (brand: string | null): string =>
  brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : 'Carte';

const expLabel = (card: PaymentMethod): string =>
  card.exp_month && card.exp_year
    ? `${String(card.exp_month).padStart(2, '0')}/${String(card.exp_year).slice(-2)}`
    : '—';

export const PaymentScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('Historique');
  const { cards, loading, refresh } = usePaymentMethods();

  const [sheetMounted, setSheetMounted] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  // TODO: hydrate from contributions once payment flows are wired.
  const transactions: { section: string; items: never[] }[] = [];
  const totalIn = 0;
  const totalOut = 0;

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
        <Text style={styles.headerTitle}>Paiement</Text>
      </View>

      {/* Balance summary */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { flex: 1 }]}>
          <Text style={styles.summaryLabel}>Reçus ce mois</Text>
          <Text style={[styles.summaryValue, { color: T.brand }]}>+{totalIn} €</Text>
        </View>
        <View style={[styles.summaryCard, { flex: 1 }]}>
          <Text style={styles.summaryLabel}>Contribués</Text>
          <Text style={[styles.summaryValue, { color: T.ink2 }]}>-{totalOut} €</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {activeTab === 'Historique' ? (
          transactions.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <CardIcon size={22} color={T.brand} />
              </View>
              <Text style={styles.emptyTitle}>Aucune transaction</Text>
              <Text style={styles.emptySub}>
                L'historique de vos contributions et encaissements apparaîtra ici.
              </Text>
            </View>
          ) : null
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.sectionLabel}>Mes cartes</Text>

            {loading ? (
              <View style={styles.emptyCard}>
                <ActivityIndicator color={T.brand} />
              </View>
            ) : cards && cards.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptySub}>Aucune carte enregistrée.</Text>
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

            <TouchableOpacity style={styles.addCard} onPress={openAddCard}>
              <View style={styles.addCardIcon}>
                <PlusIcon size={14} color={T.ink3} />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: T.ink3 }}>Ajouter une carte</Text>
            </TouchableOpacity>

            <View style={styles.securityRow}>
              <ShieldIcon size={14} color={T.ink3} />
              <Text style={styles.securityText}>Vos données de paiement sont chiffrées et sécurisées</Text>
            </View>
          </View>
        )}
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
    paddingHorizontal: 20, paddingBottom: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: T.ink, letterSpacing: -0.5 },
  summaryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  summaryCard: {
    backgroundColor: T.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: T.sep,
  },
  summaryLabel: { fontSize: 12, color: T.ink3, fontWeight: '500', marginBottom: 4 },
  summaryValue: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  tabRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99,
    backgroundColor: T.surface, borderWidth: 1, borderColor: T.sep,
  },
  tabActive: { backgroundColor: T.brand, borderColor: T.brand },
  tabText: { fontSize: 14, fontWeight: '500', color: T.ink2 },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  sectionLabel: {
    fontSize: 12, color: T.ink3, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 8, marginTop: 4,
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
  securityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    justifyContent: 'center', marginTop: 8,
  },
  securityText: { fontSize: 12, color: T.ink3, flex: 1 },
  empty: {
    paddingHorizontal: 28, paddingTop: 40, alignItems: 'center',
  },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: T.ink, textAlign: 'center' },
  emptySub: { fontSize: 14, color: T.ink3, marginTop: 6, lineHeight: 20, textAlign: 'center' },
  emptyCard: {
    backgroundColor: T.surface, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: T.sep, alignItems: 'center',
  },
});
