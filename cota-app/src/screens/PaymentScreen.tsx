import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../theme';
import { CardIcon, ChevRIcon, PlusIcon, ShieldIcon } from '../icons/Icons';

const TABS = ['Historique', 'Cartes'] as const;
type Tab = typeof TABS[number];

export const PaymentScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('Historique');

  // TODO: hydrate from contributions + payment_methods once flows are wired.
  const transactions: { section: string; items: never[] }[] = [];
  const cards: never[] = [];

  const totalIn = 0;
  const totalOut = 0;

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

            {cards.length === 0 && (
              <View style={[styles.emptyCard]}>
                <Text style={styles.emptySub}>Aucune carte enregistrée.</Text>
              </View>
            )}

            <TouchableOpacity style={styles.addCard}>
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
  txGroup: {
    backgroundColor: T.surface, borderRadius: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: T.sep, marginBottom: 8,
  },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  txDot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txLabel: { fontSize: 15, fontWeight: '600', color: T.ink },
  txSub: { fontSize: 12, color: T.ink3, marginTop: 1 },
  txAmount: { fontSize: 15, fontWeight: '700' },
  txTime: { fontSize: 11, color: T.ink4, marginTop: 2 },
  sep: { height: 0.5, backgroundColor: T.sep, marginLeft: 66 },
  addCard: {
    backgroundColor: T.surface, borderRadius: 18, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: T.ink4, borderStyle: 'dashed',
    marginBottom: 16,
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
