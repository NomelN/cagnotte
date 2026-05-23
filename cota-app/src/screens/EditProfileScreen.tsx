import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { T } from '../theme';
import { Avatar } from '../components/Avatar';
import { PrimaryButton } from '../components/Button';
import { BackIcon, CameraIcon } from '../icons/Icons';
import { ProfileStackParamList } from '../navigation';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/uploadImage';

type Nav = StackNavigationProp<ProfileStackParamList, 'EditProfile'>;

export const EditProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [focused, setFocused] = useState<'first' | 'last' | null>(null);

  const lastNameRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFirstName(data.first_name ?? '');
          setLastName(data.last_name ?? '');
          setAvatarUrl(data.avatar_url ?? null);
        }
        setLoading(false);
      });
  }, [user]);

  const changeAvatar = async () => {
    if (!user || uploadingAvatar) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Autorisation requise', "Autorisez l'accès à vos photos pour changer votre image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    setUploadingAvatar(true);
    try {
      const { publicUrl } = await uploadImage({
        bucket: 'avatars',
        userId: user.id,
        uri: result.assets[0].uri,
        fileNamePrefix: 'avatar',
      });
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      if (error) throw error;
      setAvatarUrl(publicUrl);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : "Impossible de mettre à jour la photo.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || saving) return;
    setSaving(true);
    try {
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : "Impossible de sauvegarder.");
    } finally {
      setSaving(false);
    }
  };

  const initials = ((firstName[0] ?? '') + (lastName[0] ?? '')).toUpperCase() || 'U';
  const hasChanges = firstName.trim().length > 0;

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

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color={T.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes informations</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { flexGrow: 1, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <TouchableOpacity onPress={changeAvatar} activeOpacity={0.85}>
            <Avatar initials={initials} size={96} tone="green" imageUrl={avatarUrl} />
            <View style={styles.cameraBtn}>
              {uploadingAvatar
                ? <ActivityIndicator size="small" color="#fff" />
                : <CameraIcon size={14} color="#fff" />}
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Appuyer pour changer la photo</Text>
        </View>

        {/* Editable fields */}
        <Text style={styles.sectionLabel}>IDENTITÉ</Text>
        <View style={styles.fieldGroup}>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Prénom</Text>
            <TextInput
              style={[styles.fieldInput, focused === 'first' && styles.fieldInputFocused]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Votre prénom"
              placeholderTextColor={T.ink4}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              onFocus={() => setFocused('first')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.fieldSep} />
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Nom</Text>
            <TextInput
              ref={lastNameRef}
              style={[styles.fieldInput, focused === 'last' && styles.fieldInputFocused]}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Votre nom"
              placeholderTextColor={T.ink4}
              returnKeyType="done"
              onFocus={() => setFocused('last')}
              onBlur={() => setFocused(null)}
            />
          </View>
        </View>

        {/* Read-only fields */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>CONTACT</Text>
        <View style={styles.fieldGroup}>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldReadOnly}>{user?.email ?? '—'}</Text>
          </View>
          {!!user?.phone && (
            <>
              <View style={styles.fieldSep} />
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Téléphone</Text>
                <Text style={styles.fieldReadOnly}>{user.phone}</Text>
              </View>
            </>
          )}
        </View>
        <Text style={styles.readOnlyHint}>
          Pour modifier votre email ou téléphone, contactez le support.
        </Text>
        </View>

        {/* CTA */}
        <PrimaryButton
          onPress={handleSave}
          style={{ ...styles.saveButton, ...(!hasChanges || saving ? { opacity: 0.4 } : {}) }}
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </PrimaryButton>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: T.ink,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3,
  },
  scrollContent: { padding: 20, justifyContent: 'space-between' },
  avatarWrap: { alignItems: 'center', marginBottom: 28 },
  cameraBtn: {
    position: 'absolute', right: -2, bottom: -2,
    width: 30, height: 30, borderRadius: 15, backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 4,
  },
  avatarHint: { fontSize: 12, color: T.ink3, marginTop: 10 },
  sectionLabel: {
    fontSize: 12, color: T.ink3, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
  },
  fieldGroup: {
    backgroundColor: T.surface, borderRadius: 16,
    borderWidth: 1, borderColor: T.sep, overflow: 'hidden',
  },
  fieldWrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  fieldLabel: { fontSize: 14, color: T.ink3, width: 72 },
  fieldInput: { flex: 1, fontSize: 16, color: T.ink, paddingVertical: 0 },
  fieldInputFocused: { color: T.brand },
  fieldReadOnly: { flex: 1, fontSize: 16, color: T.ink2 },
  fieldSep: { height: StyleSheet.hairlineWidth, backgroundColor: T.sep, marginLeft: 16 },
  readOnlyHint: { fontSize: 11, color: T.ink4, marginTop: 8, paddingHorizontal: 4 },
  saveButton: { marginTop: 32 },
});
