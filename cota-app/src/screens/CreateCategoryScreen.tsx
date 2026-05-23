import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { PrimaryButton } from '../components/Button';
import { BackIcon, CheckIcon, GiftIcon, PlaneIcon, BabyIcon, HeartIcon, HandIcon, MoreIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';

type Nav = StackNavigationProp<HomeStackParamList>;

const CATEGORIES = [
  { id: 'birthday',   Icon: GiftIcon,  title: 'Anniversaire',   hint: 'cadeau, fête' },
  { id: 'travel',     Icon: PlaneIcon, title: 'Voyage',          hint: 'amis, coloc' },
  { id: 'baby',       Icon: BabyIcon,  title: 'Bébé · Famille',  hint: 'naissance' },
  { id: 'wedding',    Icon: HeartIcon, title: 'Mariage',         hint: 'PACS, union' },
  { id: 'solidarity', Icon: HandIcon,  title: 'Solidarité',      hint: 'urgence, soutien' },
  { id: 'other',      Icon: MoreIcon,  title: 'Autre',           hint: 'à vous de jouer' },
];

export const CreateCategoryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState('travel');

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle cagnotte</Text>
        <View style={styles.stepBadge}><Text style={styles.stepText}>1 / 2</Text></View>
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={[styles.progressSeg, { backgroundColor: T.brand }]} />
        <View style={[styles.progressSeg, { backgroundColor: T.ink4 }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        <Text style={styles.bigTitle}>Quelle est{'\n'}l'occasion ?</Text>
        <Text style={styles.bigSub}>Choisissez une catégorie pour démarrer.</Text>

        <View style={styles.grid}>
          {CATEGORIES.map(({ id, Icon, title, hint }) => {
            const on = selected === id;
            return (
              <TouchableOpacity key={id} activeOpacity={0.75}
                style={[styles.tile, on && styles.tileOn]}
                onPress={() => setSelected(id)}>
                {on && (
                  <View style={styles.tileCheck}>
                    <CheckIcon size={12} color={T.brand} />
                  </View>
                )}
                <View style={[styles.iconBox, on ? { backgroundColor: T.surface } : { backgroundColor: T.bg }]}>
                  <Icon size={24} color={on ? T.brand : T.ink3} />
                </View>
                <Text style={[styles.tileTitle, on && { color: T.brand }]}>{title}</Text>
                <Text style={styles.tileHint}>{hint}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 8 }]}>
        <PrimaryButton onPress={() => navigation.navigate('CreateDetails', { category: selected })}>
          Continuer
        </PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '600', color: T.ink, textAlign: 'center' },
  stepBadge: { backgroundColor: T.surface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, borderWidth: 1, borderColor: T.sep },
  stepText: { fontSize: 13, fontWeight: '600', color: T.ink2 },
  progressRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginBottom: 24 },
  progressSeg: { flex: 1, height: 4, borderRadius: 99 },
  bigTitle: { fontSize: 30, fontWeight: '700', color: T.ink, letterSpacing: -0.5, lineHeight: 36, marginBottom: 8 },
  bigSub: { fontSize: 16, color: T.ink3, marginBottom: 28, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47%', minHeight: 118, backgroundColor: T.surface,
    borderRadius: 18, padding: 14, borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
    position: 'relative',
  },
  tileOn: { backgroundColor: T.brandSoft, borderColor: T.brand },
  tileCheck: {
    position: 'absolute', top: 10, right: 10,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: T.brandSoft, borderWidth: 1.5, borderColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileTitle: { fontSize: 15, fontWeight: '700', color: T.ink, letterSpacing: -0.2, marginBottom: 3 },
  tileHint: { fontSize: 12, color: T.ink3 },
  cta: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(242,242,247,0.97)', borderTopWidth: 0.5, borderTopColor: T.sep },
});
