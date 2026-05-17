import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../theme';
import { CardIcon, ChevRIcon, PlusIcon, ShieldIcon } from '../icons/Icons';

type TxType = 'in' | 'out';

interface Transaction {
  label: string;
  sub: string;
  amount: string;
  type: TxType;
  date: string;
}

const TRANSACTIONS: { section: string; items: Transaction[] }[] = [
  {
    section: "Aujourd'hui",
    items: [
      { label: 'Anniversaire Léa',      sub: 'Contribution reçue · Thomas',  amount: '+50 €',   type: 'in',  date: '13:24' },
      { label: 'Vacances en famille',    sub: 'Contribution reçue · Julie',   amount: '+30 €',   type: 'in',  date: '09:11' },
    ],
  },
  {
    section: '14 mai 2026',
    items: [
      { label: 'Anniversaire Léa',      sub: 'Contribution reçue · Marc',    amount: '+100 €',  type: 'in',  date: '18:40' },
      { label: 'Road trip Bretagne',     sub: 'Ta contribution',              amount: '-50 €',   type: 'out', date: '11:05' },
    ],
  },
  {
    section: '10 mai 2026',
    items: [
      { label: 'Pot départ Camille',     sub: 'Ta contribution',              amount: '-30 €',   type: 'out', date: '16:22' },
      { label: 'Vacances en famille',    sub: 'Contribution reçue · Sophie',  amount: '+20 €',   type: 'in',  date: '08:55' },
    ],
  },
];

const CARDS = [
  { label: 'Visa', last4: '1234', isDefault: true },
  { label: 'Mastercard', last4: '5678', isDefault: false },
];

const TABS = ['Historique', 'Cartes'] as const;
type Tab = typeof TABS[number];

export const PaymentScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('Historique');

  const totalIn = 200;
  const totalOut = 80;

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
          <View style={{ paddingHorizontal: 20 }}>
            {TRANSACTIONS.map((group) => (
              <View key={group.section}>
                <Text style={styles.sectionLabel}>{group.section}</Text>
                <View style={styles.txGroup}>
                  {group.items.map((tx, i) => (
                    <View key={i}>
                      <View style={styles.txRow}>
                        <View style={[styles.txDot, { backgroundColor: tx.type === 'in' ? T.brandSoft : T.field }]}>
                          <Text style={{ fontSize: 16, color: tx.type === 'in' ? T.brand : T.ink3 }}>
                            {tx.type === 'in' ? '↓' : '↑'}
                          </Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.txLabel}>{tx.label}</Text>
                          <Text style={styles.txSub}>{tx.sub}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={[styles.txAmount, { color: tx.type === 'in' ? T.brand : T.ink }]}>{tx.amount}</Text>
                          <Text style={styles.txTime}>{tx.date}</Text>
                        </View>
                      </View>
                      {i < group.items.length - 1 && <View style={styles.sep} />}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.sectionLabel}>Mes cartes</Text>
            <View style={styles.txGroup}>
              {CARDS.map((card, i) => (
                <View key={i}>
                  <View style={styles.txRow}>
                    <CardIcon size={22} color={T.ink2} />
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={styles.txLabel}>{card.label} •••• {card.last4}</Text>
                      {card.isDefault && <Text style={[styles.txSub, { color: T.brand }]}>Par défaut</Text>}
                    </View>
                    <ChevRIcon size={14} color={T.ink4} />
                  </View>
                  {i < CARDS.length - 1 && <View style={styles.sep} />}
                </View>
              ))}
            </View>

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
});
