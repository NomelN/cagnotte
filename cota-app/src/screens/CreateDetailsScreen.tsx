import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert,
  Modal, Platform, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../lib/uploadImage';
import { T } from '../theme';
import { PrimaryButton } from '../components/Button';
import {
  BackIcon, CameraIcon, PlusIcon, CalIcon,
  GiftIcon, PlaneIcon, BabyIcon, HeartIcon, HandIcon, MoreIcon,
} from '../icons/Icons';
import { HomeStackParamList } from '../navigation';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

type Nav = StackNavigationProp<HomeStackParamList>;
type Rt = RouteProp<HomeStackParamList, 'CreateDetails'>;

type IconFC = React.FC<{ size?: number; color?: string }>;

const CATEGORIES: Record<string, { label: string; Icon: IconFC }> = {
  birthday:   { label: 'Anniversaire',     Icon: GiftIcon },
  travel:     { label: 'Voyage',           Icon: PlaneIcon },
  baby:       { label: 'Bébé · Famille',   Icon: BabyIcon },
  wedding:    { label: 'Mariage',          Icon: HeartIcon },
  solidarity: { label: 'Solidarité',       Icon: HandIcon },
  other:      { label: 'Autre',            Icon: MoreIcon },
};

// Convert e.g. "Vacances en famille" -> "vacances-en-famille-a7c4"
const slugify = (input: string): string => {
  const base = input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || 'cagnotte'}-${suffix}`;
};

const Field = ({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.fieldLabel}>
      {label}{optional ? <Text style={{ color: T.ink3, fontWeight: '400' }}> (optionnel)</Text> : null}
    </Text>
    {children}
  </View>
);

export const CreateDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { user } = useAuth();

  const categoryId = route.params?.category ?? 'other';
  const category = CATEGORIES[categoryId] ?? CATEGORIES.other;
  const CategoryIcon = category.Icon;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [focus, setFocus] = useState<'title' | 'desc' | 'goal' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const pickCover = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Autorisation requise", "Autorisez l'accès à vos photos pour choisir une couverture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) setCoverUri(result.assets[0].uri);
  };

  // The deadline cannot be in the past — earliest possible value is tomorrow.
  const minDate = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
  })();

  // On iOS we stage the picker value and commit only on "OK", so the user can
  // cancel without losing their previous choice. On Android the native dialog
  // already handles commit/cancel itself.
  const [stagedDate, setStagedDate] = useState<Date>(minDate);

  const openPicker = () => {
    setStagedDate(deadline ?? minDate);
    setPickerVisible(true);
  };

  const formatDeadline = (d: Date) =>
    d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  // Postgres `date` wants YYYY-MM-DD in the user's local calendar — using
  // toISOString() would shift the day in negative-offset timezones.
  const dateToIsoDay = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const goalCents = (() => {
    const cleaned = goal.replace(/[^\d.,]/g, '').replace(',', '.');
    const value = parseFloat(cleaned);
    return Number.isFinite(value) && value > 0 ? Math.round(value * 100) : 0;
  })();

  const canSubmit = title.trim().length > 0 && goalCents > 0 && !!user && !submitting;

  const handleCreate = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // Upload the cover image first (if any) so we can store its URL on the
      // pot row in a single insert. If upload fails, abort before touching DB.
      let coverUrl: string | null = null;
      if (coverUri) {
        const { publicUrl } = await uploadImage({
          bucket: 'pot-covers',
          userId: user!.id,
          uri: coverUri,
          fileNamePrefix: 'cover',
        });
        coverUrl = publicUrl;
      }

      const { data, error } = await supabase
        .from('pots')
        .insert({
          owner_id: user!.id,
          slug: slugify(title.trim()),
          title: title.trim(),
          description: description.trim() || null,
          category: categoryId,
          goal_amount_cents: goalCents,
          currency: 'EUR',
          deadline: deadline ? dateToIsoDay(deadline) : null,
          cover_url: coverUrl,
        })
        .select('id')
        .single();
      if (error) throw error;
      navigation.navigate('SuccessCreated', { potId: data.id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible de créer la cagnotte';
      Alert.alert('Erreur', message);
    } finally {
      setSubmitting(false);
    }
  };

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
      >
          {/* Photo picker */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={pickCover} activeOpacity={0.8} style={{ position: 'relative' }}>
              <View style={styles.photoPicker}>
                {coverUri ? (
                  <Image source={{ uri: coverUri }} style={styles.photoPreview} />
                ) : (
                  <CameraIcon size={28} color={T.ink3} />
                )}
              </View>
              <View style={styles.photoAddBtn}>
                <PlusIcon size={14} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Category */}
          <Field label="Catégorie">
            <View style={styles.catRow}>
              <View style={styles.catIcon}>
                <CategoryIcon size={18} color={T.brand} />
              </View>
              <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: T.ink }}>
                {category.label}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ fontSize: 13, color: T.brand, fontWeight: '600' }}>Changer</Text>
              </TouchableOpacity>
            </View>
          </Field>

          <Field label="Titre de la cagnotte">
            <TextInput
              style={[styles.input, focus === 'title' && styles.inputFocused]}
              placeholder="Ex : Vacances en famille, Bali 2026…"
              placeholderTextColor={T.ink3}
              value={title}
              onChangeText={setTitle}
              onFocus={() => setFocus('title')}
              onBlur={() => setFocus(null)}
              returnKeyType="next"
            />
          </Field>

          <Field label="Description" optional>
            <TextInput
              style={[styles.input, styles.inputMulti, focus === 'desc' && styles.inputFocused]}
              placeholder="Décrivez votre cagnotte…"
              placeholderTextColor={T.ink3}
              value={description}
              onChangeText={setDescription}
              onFocus={() => setFocus('desc')}
              onBlur={() => setFocus(null)}
              multiline
              textAlignVertical="top"
            />
          </Field>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Field label="Objectif">
                <TextInput
                  style={[styles.input, focus === 'goal' && styles.inputFocused]}
                  placeholder="2 000 €"
                  placeholderTextColor={T.ink3}
                  value={goal}
                  onChangeText={setGoal}
                  onFocus={() => setFocus('goal')}
                  onBlur={() => setFocus(null)}
                  keyboardType="numeric"
                  inputMode="decimal"
                />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Date limite" optional>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={openPicker}
                  style={[styles.input, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}
                >
                  <CalIcon size={18} color={deadline ? T.brand : T.ink3} />
                  <Text
                    style={{ fontSize: 15, flex: 1, color: deadline ? T.ink : T.ink3 }}
                    numberOfLines={1}
                  >
                    {deadline ? formatDeadline(deadline) : 'Choisir'}
                  </Text>
                  {deadline ? (
                    <TouchableOpacity
                      onPress={() => setDeadline(null)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={{ color: T.ink3, fontSize: 14 }}>✕</Text>
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>
              </Field>
            </View>
          </View>

          <View style={styles.submitWrap}>
            <PrimaryButton
              onPress={handleCreate}
              style={!canSubmit ? { opacity: 0.4 } : undefined}
            >
              {submitting ? 'Création…' : 'Créer la cagnotte'}
            </PrimaryButton>
          </View>
        </ScrollView>

      {/* Android: native modal dialog opens itself while the picker is mounted. */}
      {Platform.OS === 'android' && pickerVisible && (
        <DateTimePicker
          value={deadline ?? minDate}
          mode="date"
          minimumDate={minDate}
          onChange={(event, d) => {
            setPickerVisible(false);
            if (event.type === 'set' && d) setDeadline(d);
          }}
        />
      )}

      {/* iOS: bottom-sheet with a spinner + Annuler/OK so the user can cancel. */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={pickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setPickerVisible(false)}
        >
          <View style={styles.pickerBackdrop}>
            <View style={[styles.pickerSheet, { paddingBottom: insets.bottom + 12 }]}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setPickerVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.pickerCancel}>Annuler</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>Date limite</Text>
                <TouchableOpacity
                  onPress={() => { setDeadline(stagedDate); setPickerVisible(false); }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.pickerOk}>OK</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={stagedDate}
                mode="date"
                display="spinner"
                minimumDate={minDate}
                locale="fr-FR"
                themeVariant="light"
                onChange={(_, d) => d && setStagedDate(d)}
              />
            </View>
          </View>
        </Modal>
      )}
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
  photoPicker: { width: 104, height: 104, borderRadius: 52, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: T.field, overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%' },
  photoAddBtn: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: T.brand, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: T.ink2, marginBottom: 6 },
  input: {
    backgroundColor: T.surface, borderRadius: 14, paddingHorizontal: 14,
    minHeight: 48, fontSize: 15, color: T.ink,
    borderWidth: 1, borderColor: T.sep,
  },
  inputMulti: { minHeight: 86, paddingTop: 12, paddingBottom: 12 },
  inputFocused: { borderWidth: 2, borderColor: T.brand },
  catRow: { backgroundColor: T.surface, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: T.sep },
  catIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: T.brandSoft, alignItems: 'center', justifyContent: 'center' },
  submitWrap: { marginTop: 24 },
  pickerBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  pickerSheet: {
    backgroundColor: T.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 6,
  },
  pickerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.sep,
  },
  pickerTitle: { fontSize: 15, fontWeight: '600', color: T.ink },
  pickerCancel: { fontSize: 15, color: T.ink3, fontWeight: '500' },
  pickerOk: { fontSize: 15, color: T.brand, fontWeight: '700' },
});
