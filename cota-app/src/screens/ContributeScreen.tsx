import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { Chip } from '../components/Chip';
import { PrimaryButton } from '../components/Button';
import { BackIcon, LockIcon, CheckIcon, PlusIcon, ShieldIcon, CardIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';
import { usePaymentMethods, PaymentMethod, formatEur } from '../data/hooks';

type Nav = StackNavigationProp<HomeStackParamList>;
type Rt = RouteProp<HomeStackParamList, 'Contribute'>;

// Lazy so the Stripe native module isn't loaded until the user actually opens
// the add-card sheet — keeps the app runnable in Expo Go.
const AddCardSheet = lazy(() => import('../components/AddCardSheet'));

const AMOUNTS = [10, 20, 50, 100];

const brandLabel = (b: string | null) =>
  b ? b.charAt(0).toUpperCase() + b.slice(1) : 'Carte';

export const ContributeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { potId } = route.params;

  const [amountStr, setAmountStr] = useState('50');
  const amountInputRef = useRef<TextInput>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const selectedAmount = (() => {
    const v = parseFloat(amountStr.replace(',', '.'));
    return Number.isFinite(v) && v > 0 ? Math.round(v * 100) / 100 : 0;
  })();
  const [cardSheetMounted, setCardSheetMounted] = useState(false);
  const [cardSheetVisible, setCardSheetVisible] = useState(false);

  const { cards, loading: cardsLoading, refresh: refreshCards } = usePaymentMethods();

  // Refresh saved cards each time the screen comes back into focus (e.g. after
  // returning from the add-card sheet so a freshly-saved card shows up).
  useFocusEffect(React.useCallback(() => { refreshCards(); }, [refreshCards]));

  // Auto-select the user's default card (or first available) when the list loads.
  useEffect(() => {
    if (!cards || cards.length === 0) {
      setSelectedCardId(null);
      return;
    }
    if (selectedCardId && cards.some(c => c.id === selectedCardId)) return;
    const def = cards.find(c => c.is_default) ?? cards[0];
    setSelectedCardId(def.id);
  }, [cards, selectedCardId]);

  const isAmountValid = selectedAmount > 0;
  const canPay = isAmountValid && !!selectedCardId;

  const openAddCard = () => {
    setCardSheetMounted(true);
    setCardSheetVisible(true);
  };

  const onContribute = () => {
    if (!canPay || !selectedCardId) return;
    navigation.navigate('PaymentProcessing', {
      potId,
      amount: selectedAmount,
      cardId: selectedCardId,
    });
  };

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 24 }}>
        <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'space-between' }}>
          <View>
          {/* Amount */}
          <Text style={styles.label}>MONTANT</Text>
          <TouchableOpacity
            style={styles.amountCard}
            onPress={() => amountInputRef.current?.focus()}
            activeOpacity={0.9}
          >
            <Text style={styles.amountText}>
              {amountStr || '0'}
              <Text style={styles.amountUnit}> €</Text>
            </Text>
            <TextInput
              ref={amountInputRef}
              style={styles.hiddenInput}
              value={amountStr}
              onChangeText={(t) => setAmountStr(t.replace(/[^\d.,]/g, ''))}
              keyboardType="decimal-pad"
              returnKeyType="done"
              maxLength={7}
              caretHidden
            />
          </TouchableOpacity>
          <View style={styles.chipsRow}>
            {AMOUNTS.map(a => (
              <Chip key={a} active={selectedAmount === a} onPress={() => setAmountStr(String(a))}>
                {`${a} €`}
              </Chip>
            ))}
          </View>

          {/* Payment */}
          <Text style={[styles.label, { marginTop: 26 }]}>MOYEN DE PAIEMENT</Text>

          {cardsLoading ? (
            <View style={styles.cardsLoading}>
              <ActivityIndicator color={T.brand} />
            </View>
          ) : !cards || cards.length === 0 ? (
            <View style={styles.emptyCards}>
              <Text style={styles.emptyCardsText}>
                Aucune carte enregistrée. Ajoutez-en une pour contribuer.
              </Text>
            </View>
          ) : (
            cards.map(card => {
              const isSelected = card.id === selectedCardId;
              return (
                <TouchableOpacity
                  key={card.id}
                  onPress={() => setSelectedCardId(card.id)}
                  activeOpacity={0.8}
                  style={[styles.payCard, isSelected && styles.payCardSelected]}
                >
                  <CardIcon size={22} color={T.ink2} />
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.payCardLabel}>{brandLabel(card.brand)}</Text>
                    <Text style={styles.payCardSub}>
                      {`•••• •••• •••• ${card.last4 ?? '••••'}`}
                    </Text>
                  </View>
                  {isSelected ? (
                    <View style={styles.checkBadge}>
                      <CheckIcon size={14} color="#fff" />
                    </View>
                  ) : (
                    <View style={styles.radioOuter} />
                  )}
                </TouchableOpacity>
              );
            })
          )}

          <TouchableOpacity style={styles.addCard} onPress={openAddCard} activeOpacity={0.8}>
            <View style={styles.addCardIcon}>
              <PlusIcon size={14} color={T.ink3} />
            </View>
            <Text style={styles.addCardText}>Ajouter une carte</Text>
          </TouchableOpacity>
          </View>

          <View style={styles.ctaSection}>
          <PrimaryButton
            onPress={onContribute}
            style={{ ...styles.ctaButton, ...(!canPay && { opacity: 0.4 }) }}
          >
            {`Contribuer ${formatEur(Math.round(selectedAmount * 100))}`}
          </PrimaryButton>
          <View style={styles.secureRow}>
            <ShieldIcon size={14} color={T.ink3} />
            <Text style={styles.secureText}>Paiement 100% sécurisé</Text>
          </View>
          </View>
        </View>
      </ScrollView>

      {/* Add card sheet — lazy so Stripe SDK loads only on first open */}
      {cardSheetMounted && (
        <Suspense fallback={null}>
          <AddCardSheet
            visible={cardSheetVisible}
            onClose={() => setCardSheetVisible(false)}
            onSaved={() => {
              setCardSheetVisible(false);
              refreshCards();
            }}
          />
        </Suspense>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '600', color: T.ink, textAlign: 'center' },
  label: { fontSize: 13, color: T.ink3, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  amountCard: { backgroundColor: T.surface, borderRadius: 20, paddingVertical: 30, alignItems: 'center' },
  amountText: { fontSize: 54, fontWeight: '700', letterSpacing: -1.5, color: T.ink },
  amountUnit: { color: T.ink3, fontWeight: '600', fontSize: 36 },
  hiddenInput: { position: 'absolute', opacity: 0, width: '100%', height: '100%' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  payCard: {
    backgroundColor: T.surface, borderRadius: 18, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: T.sep, marginBottom: 8,
  },
  payCardSelected: { borderColor: T.brand, borderWidth: 2 },
  payCardLabel: { fontSize: 16, fontWeight: '600', color: T.ink },
  payCardSub: { fontSize: 12, color: T.ink3, marginTop: 2, letterSpacing: 1 },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: T.ink4 },
  checkBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: T.brand, alignItems: 'center', justifyContent: 'center' },
  cardsLoading: { paddingVertical: 28, alignItems: 'center', backgroundColor: T.surface, borderRadius: 18 },
  emptyCards: {
    backgroundColor: T.surface, borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: T.sep,
  },
  emptyCardsText: { fontSize: 14, color: T.ink3, textAlign: 'center' },
  addCard: {
    backgroundColor: T.surface, borderRadius: 18, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8,
    borderWidth: 1, borderColor: T.ink4, borderStyle: 'dashed',
  },
  addCardIcon: {
    width: 34, height: 22, borderRadius: 6,
    borderWidth: 1, borderColor: T.ink4, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  addCardText: { fontSize: 15, fontWeight: '500', color: T.ink3 },
  ctaSection: { paddingTop: 24 },
  ctaButton: {},
  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 },
  secureText: { fontSize: 12, color: T.ink3 },
});
