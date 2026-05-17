import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { PrimaryButton } from '../components/Button';
import { BackIcon, CameraIcon, PlusIcon, PlaneIcon, CalIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';

type Nav = StackNavigationProp<HomeStackParamList>;

const Field = ({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.fieldLabel}>
      {label}{optional ? <Text style={{ color: T.ink3, fontWeight: '400' }}> (optionnel)</Text> : null}
    </Text>
    {children}
  </View>
);

const Input = ({ placeholder, multiline }: { placeholder: string; multiline?: boolean }) => (
  <View style={[styles.input, multiline && { minHeight: 78, alignItems: 'flex-start', paddingTop: 12 }]}>
    <Text style={{ fontSize: 15, color: T.ink3 }}>{placeholder}</Text>
  </View>
);

export const CreateDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails</Text>
        <View style={styles.stepBadge}><Text style={styles.stepText}>2 / 2</Text></View>
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressSeg, { backgroundColor: T.brand }]} />
        <View style={[styles.progressSeg, { backgroundColor: T.brand }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        {/* Photo picker */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{ position: 'relative' }}>
            <View style={styles.photoPicker}>
              <CameraIcon size={28} color={T.ink3} />
            </View>
            <View style={styles.photoAddBtn}>
              <PlusIcon size={14} color="#fff" />
            </View>
          </View>
        </View>

        {/* Category */}
        <Field label="Catégorie">
          <View style={styles.catRow}>
            <View style={styles.catIcon}>
              <PlaneIcon size={18} color={T.brand} />
            </View>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: T.ink }}>Voyage</Text>
            <Text style={{ fontSize: 13, color: T.brand, fontWeight: '600' }}>Changer</Text>
          </View>
        </Field>

        <Field label="Titre de la cagnotte">
          <Input placeholder="Ex : Vacances en famille, Bali 2026…" />
        </Field>

        <Field label="Description" optional>
          <Input placeholder="Décrivez votre cagnotte…" multiline />
        </Field>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field label="Objectif">
              <Input placeholder="2 000 €" />
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Date limite" optional>
              <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
                <CalIcon size={18} color={T.ink3} />
                <Text style={{ fontSize: 15, color: T.ink3 }}>Choisir</Text>
              </View>
            </Field>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 8 }]}>
        <PrimaryButton onPress={() => navigation.navigate('SuccessCreated')}>
          Créer la cagnotte
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
  progressRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginBottom: 20 },
  progressSeg: { flex: 1, height: 4, borderRadius: 99 },
  photoPicker: { width: 104, height: 104, borderRadius: 52, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: T.field },
  photoAddBtn: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: T.brand, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: T.ink2, marginBottom: 6 },
  input: { backgroundColor: T.surface, borderRadius: 14, padding: 14, minHeight: 48, justifyContent: 'center', borderWidth: 1, borderColor: T.sep },
  catRow: { backgroundColor: T.surface, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: T.sep },
  catIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: T.brandSoft, alignItems: 'center', justifyContent: 'center' },
  cta: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(242,242,247,0.97)', borderTopWidth: 0.5, borderTopColor: T.sep },
});
