import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar,
  Alert, ScrollView, ActivityIndicator, Modal, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { T } from '../theme';
import { PrimaryButton } from '../components/Button';
import { BackIcon, CalIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';
import { supabase } from '../lib/supabase';

type Nav = StackNavigationProp<HomeStackParamList, 'EditPot'>;
type Rt = RouteProp<HomeStackParamList, 'EditPot'>;

const formatDeadlineDisplay = (date: Date) =>
  date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const EditPotScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { potId } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [goalStr, setGoalStr] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const [focused, setFocused] = useState<'title' | 'goal' | null>(null);

  const goalRef = useRef<TextInput>(null);

  useEffect(() => {
    supabase
      .from('pots')
      .select('title, goal_amount_cents, deadline')
      .eq('id', potId)
      .single()
      .then(({ data }) => {
        if (data) {
          setTitle(data.title ?? '');
          setGoalStr(data.goal_amount_cents ? String(Math.round(data.goal_amount_cents / 100)) : '');
          setDeadline(data.deadline ? new Date(data.deadline) : null);
        }
        setLoading(false);
      });
  }, [potId]);

  const handleSave = async () => {
    if (!title.trim() || saving) return;
    const goalCents = goalStr.trim()
      ? Math.round(parseFloat(goalStr.replace(',', '.')) * 100)
      : null;
    if (goalStr.trim() && (!goalCents || goalCents <= 0)) {
      Alert.alert('Montant invalide', 'Entrez un montant valide ou laissez le champ vide.');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('pots')
        .update({
          title: title.trim(),
          ...(goalCents !== null ? { goal_amount_cents: goalCents } : {}),
          deadline: deadline ? deadline.toISOString() : null,
        })
        .eq('id', potId);
      if (error) throw error;
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de sauvegarder.');
    } finally {
      setSaving(false);
    }
  };

  const onDateChange = (_: unknown, date?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (date) setDeadline(date);
  };

  const canSave = title.trim().length > 0 && !saving;

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={T.brand} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier la cagnotte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View>
          {/* Titre */}
          <Text style={styles.label}>NOM DE LA CAGNOTTE</Text>
          <TextInput
            style={[styles.input, focused === 'title' && styles.inputFocused]}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex : Voyage à Bali"
            placeholderTextColor={T.ink4}
            returnKeyType="next"
            onSubmitEditing={() => goalRef.current?.focus()}
            onFocus={() => setFocused('title')}
            onBlur={() => setFocused(null)}
            maxLength={80}
          />

          {/* Objectif */}
          <Text style={[styles.label, { marginTop: 20 }]}>OBJECTIF (€)</Text>
          <View style={[styles.inputRow, focused === 'goal' && styles.inputFocused]}>
            <TextInput
              ref={goalRef}
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              value={goalStr}
              onChangeText={(t) => setGoalStr(t.replace(/[^\d.,]/g, ''))}
              placeholder="500"
              placeholderTextColor={T.ink4}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onFocus={() => setFocused('goal')}
              onBlur={() => setFocused(null)}
              maxLength={8}
            />
            <Text style={styles.unit}>€</Text>
          </View>

          {/* Date limite */}
          <Text style={[styles.label, { marginTop: 20 }]}>DATE LIMITE</Text>
          <TouchableOpacity
            style={[styles.input, styles.dateRow]}
            onPress={() => setShowPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={deadline ? styles.dateText : styles.datePlaceholder}>
              {deadline ? formatDeadlineDisplay(deadline) : 'Aucune date limite'}
            </Text>
            <CalIcon size={18} color={T.ink3} />
          </TouchableOpacity>
          {deadline && (
            <TouchableOpacity onPress={() => setDeadline(null)} style={{ marginTop: 6, paddingHorizontal: 4 }}>
              <Text style={styles.clearDate}>Supprimer la date</Text>
            </TouchableOpacity>
          )}

          {/* iOS inline picker */}
          {showPicker && Platform.OS === 'ios' && (
            <Modal transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
              <View style={styles.pickerBackdrop}>
                <View style={[styles.pickerSheet, { paddingBottom: insets.bottom + 8 }]}>
                  <View style={styles.pickerHeader}>
                    <TouchableOpacity onPress={() => setShowPicker(false)}>
                      <Text style={styles.pickerDone}>Terminé</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={deadline ?? new Date()}
                    mode="date"
                    display="spinner"
                    minimumDate={new Date()}
                    onChange={onDateChange}
                    locale="fr-FR"
                  />
                </View>
              </View>
            </Modal>
          )}

          {showPicker && Platform.OS === 'android' && (
            <DateTimePicker
              value={deadline ?? new Date()}
              mode="date"
              minimumDate={new Date()}
              onChange={onDateChange}
            />
          )}
        </View>

        <PrimaryButton
          onPress={handleSave}
          style={{ ...styles.saveBtn, ...(!canSave ? { opacity: 0.4 } : {}) }}
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </PrimaryButton>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12, gap: 8,
  },
  headerTitle: {
    flex: 1, fontSize: 17, fontWeight: '600',
    color: T.ink, textAlign: 'center',
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3,
  },
  label: {
    fontSize: 12, color: T.ink3, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
  },
  input: {
    backgroundColor: T.surface, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 14,
    fontSize: 16, color: T.ink,
    borderWidth: 1, borderColor: T.sep,
  },
  inputFocused: { borderColor: T.brand, borderWidth: 2 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.surface, borderRadius: 14,
    paddingRight: 14, borderWidth: 1, borderColor: T.sep,
  },
  unit: { fontSize: 18, fontWeight: '600', color: T.ink3 },
  dateRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  dateText: { fontSize: 16, color: T.ink },
  datePlaceholder: { fontSize: 16, color: T.ink4 },
  clearDate: { fontSize: 13, color: T.danger, fontWeight: '500' },
  saveBtn: { marginTop: 32 },
  pickerBackdrop: {
    flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerSheet: {
    backgroundColor: T.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  pickerHeader: {
    flexDirection: 'row', justifyContent: 'flex-end',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.sep,
  },
  pickerDone: { fontSize: 16, fontWeight: '600', color: T.brand },
});
