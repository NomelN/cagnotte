import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { Chip } from '../components/Chip';
import { PrimaryButton } from '../components/Button';
import { BackIcon, LockIcon, CheckIcon, PlusIcon, ShieldIcon, CardIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';

type Nav = StackNavigationProp<HomeStackParamList>;

const AMOUNTS = [10, 20, 50, 100];

export const ContributeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState(50);

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contribuer</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <LockIcon size={20} color={T.ink3} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 20 }}>
          {/* Amount */}
          <Text style={styles.label}>MONTANT</Text>
          <View style={styles.amountCard}>
            <Text style={styles.amountText}>{selected} <Text style={{ color: T.ink3, fontWeight: '600' }}>€</Text></Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {AMOUNTS.map(a => (
              <Chip key={a} active={selected === a} onPress={() => setSelected(a)}>{a} €</Chip>
            ))}
            <Chip dashed onPress={() => {}}>Autre</Chip>
          </View>

          {/* Payment */}
          <Text style={[styles.label, { marginTop: 26 }]}>MOYEN DE PAIEMENT</Text>
          <View style={[styles.payCard, { borderColor: T.brand, borderWidth: 2 }]}>
            <CardIcon size={22} color={T.ink2} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: T.ink }}>Carte bancaire</Text>
              <Text style={{ fontSize: 12, color: T.ink3, marginTop: 2, letterSpacing: 1 }}>•••• •••• •••• 1234</Text>
            </View>
            <View style={styles.checkBadge}>
              <CheckIcon size={14} color="#fff" />
            </View>
          </View>

          <TouchableOpacity style={styles.addCard}>
            <View style={styles.addCardIcon}>
              <PlusIcon size={14} color={T.ink3} />
            </View>
            <Text style={{ fontSize: 15, fontWeight: '500', color: T.ink3 }}>Ajouter une carte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 8 }]}>
        <PrimaryButton onPress={() => navigation.navigate('PaymentProcessing', { amount: selected })}>
          Contribuer {selected} €
        </PrimaryButton>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          <ShieldIcon size={14} color={T.ink3} />
          <Text style={{ fontSize: 12, color: T.ink3 }}>Paiement 100% sécurisé</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '600', color: T.ink, textAlign: 'center' },
  label: { fontSize: 13, color: T.ink3, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  amountCard: { backgroundColor: T.surface, borderRadius: 20, paddingVertical: 30, alignItems: 'center' },
  amountText: { fontSize: 54, fontWeight: '700', letterSpacing: -1.5, color: T.ink },
  payCard: { backgroundColor: T.surface, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center' },
  checkBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: T.brand, alignItems: 'center', justifyContent: 'center' },
  addCard: { backgroundColor: T.surface, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, borderWidth: 1, borderColor: T.ink4, borderStyle: 'dashed' },
  addCardIcon: { width: 34, height: 22, borderRadius: 6, borderWidth: 1, borderColor: T.ink4, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  cta: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(242,242,247,0.97)', borderTopWidth: 0.5, borderTopColor: T.sep },
});
