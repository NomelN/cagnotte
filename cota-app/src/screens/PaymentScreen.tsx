import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { T } from '../theme';
import { CardIcon, ArrowRIcon } from '../icons/Icons';
import { usePaymentHistory, formatEur, PaymentEntry } from '../data/hooks';
import { HomeStackParamList, RootTabParamList } from '../navigation';

// Navigating to Detail requires jumping to the Home tab first (where the
// HomeStack lives), so we compose tab + stack navigation props.
type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList>,
  StackNavigationProp<HomeStackParamList>
>;

export const PaymentScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { groups, summary, loading, refresh } = usePaymentHistory();

  // Refresh whenever the user lands on this tab so new contributions show up
  // without restarting the app.
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const openPot = (potId: string) => {
    if (!potId) return;
    navigation.navigate('Home', { screen: 'Detail', params: { potId } } as never);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Paiement</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* Balance summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { flex: 1 }]}>
            <Text style={styles.summaryLabel}>Reçus ce mois</Text>
            <Text style={[styles.summaryValue, { color: T.brand }]}>
              +{formatEur(summary.receivedThisMonthCents)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { flex: 1 }]}>
            <Text style={styles.summaryLabel}>Contribués</Text>
            <Text style={[styles.summaryValue, { color: T.ink2 }]}>
              −{formatEur(summary.contributedThisMonthCents)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Historique</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={T.brand} style={{ marginTop: 32 }} />
        ) : !groups || groups.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <CardIcon size={22} color={T.brand} />
            </View>
            <Text style={styles.emptyTitle}>Aucune transaction</Text>
            <Text style={styles.emptySub}>
              L'historique de vos contributions et encaissements apparaîtra ici.
            </Text>
          </View>
        ) : (
          groups.map(g => (
            <View key={g.section} style={{ marginBottom: 12 }}>
              <Text style={styles.dateHeader}>{g.section}</Text>
              <View style={styles.txGroup}>
                {g.items.map((tx, i) => (
                  <React.Fragment key={tx.id}>
                    <TxRow tx={tx} onPress={() => openPot(tx.potId)} />
                    {i < g.items.length - 1 && <View style={styles.sep} />}
                  </React.Fragment>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};


const TxRow = ({ tx, onPress }: { tx: PaymentEntry; onPress: () => void }) => {
  const isIn = tx.direction === 'in';
  const sign = isIn ? '+' : '−';
  const tone = isIn ? T.brand : T.ink2;
  const titleText = isIn
    ? `Contribution de ${tx.counterpartyLabel}`
    : tx.potTitle;
  const subText = isIn
    ? tx.potTitle
    : tx.counterpartyLabel || '—';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.txRow}>
      <View style={[
        styles.txDot,
        { backgroundColor: isIn ? T.brandSoft : T.field },
      ]}>
        <View style={{ transform: [{ rotate: isIn ? '90deg' : '-90deg' }] }}>
          <ArrowRIcon size={18} color={isIn ? T.brand : T.ink2} />
        </View>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.txLabel} numberOfLines={1}>{titleText}</Text>
        <Text style={styles.txSub} numberOfLines={1}>{subText}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.txAmount, { color: tone }]}>
          {`${sign}${formatEur(tx.amountCents)}`}
        </Text>
        <Text style={styles.txTime}>{tx.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: T.ink, letterSpacing: -0.5 },
  summaryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16, marginTop: 4 },
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
  dateHeader: {
    fontSize: 12, color: T.ink3, fontWeight: '600',
    paddingHorizontal: 20, marginBottom: 6, marginTop: 4,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  txGroup: {
    backgroundColor: T.surface, borderRadius: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: T.sep, marginHorizontal: 20,
  },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  txDot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txLabel: { fontSize: 15, fontWeight: '600', color: T.ink },
  txSub: { fontSize: 12, color: T.ink3, marginTop: 1 },
  txAmount: { fontSize: 15, fontWeight: '700' },
  txTime: { fontSize: 11, color: T.ink4, marginTop: 2 },
  sep: { height: 0.5, backgroundColor: T.sep, marginLeft: 66 },
});
