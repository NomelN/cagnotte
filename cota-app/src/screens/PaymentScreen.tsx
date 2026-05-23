import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../theme';
import { CardIcon } from '../icons/Icons';

export const PaymentScreen = () => {
  const insets = useSafeAreaInsets();

  // TODO: hydrate from contributions once payment flows are fully wired.
  const transactions: { section: string; items: never[] }[] = [];

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

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Historique</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {transactions.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <CardIcon size={22} color={T.brand} />
            </View>
            <Text style={styles.emptyTitle}>Aucune transaction</Text>
            <Text style={styles.emptySub}>
              L'historique de vos contributions et encaissements apparaîtra ici.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: T.ink, letterSpacing: -0.5 },
  summaryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  summaryCard: {
    backgroundColor: T.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: T.sep,
  },
  summaryLabel: { fontSize: 12, color: T.ink3, fontWeight: '500', marginBottom: 4 },
  summaryValue: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 8 },
  sectionTitle: {
    fontSize: 12, color: T.ink3, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  empty: { paddingHorizontal: 28, paddingTop: 40, alignItems: 'center' },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: T.ink, textAlign: 'center' },
  emptySub: { fontSize: 14, color: T.ink3, marginTop: 6, lineHeight: 20, textAlign: 'center' },
});
