import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { Avatar } from '../components/Avatar';
import { BellIcon, CameraIcon, ChevRIcon, IdCardIcon, CardIcon, ShieldIcon, GearIcon, HelpIcon, LogoutIcon } from '../icons/Icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/uploadImage';
import { useUserStats, formatEur } from '../data/hooks';
import { RootStackParamList } from '../navigation';

const Row = ({ icon, title, sub, danger, last, onPress }: {
  icon: React.ReactNode; title: string; sub?: string; danger?: boolean; last?: boolean; onPress?: () => void;
}) => (
  <>
    <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress} style={styles.row}>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>{icon}</View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={[styles.rowTitle, danger && { color: T.danger }]}>{title}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      {!danger && <ChevRIcon size={14} color={T.ink4} />}
    </TouchableOpacity>
    {!last && <View style={styles.rowSep} />}
  </>
);

const Group = ({ header, children }: { header: string; children: React.ReactNode }) => (
  <>
    <Text style={styles.groupHeader}>{header}</Text>
    <View style={styles.group}>{children}</View>
  </>
);

type RootNav = StackNavigationProp<RootStackParamList>;

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const { stats } = useUserStats();
  const [profile, setProfile] = useState<{ first_name: string | null; last_name: string | null; avatar_url: string | null } | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const changeAvatar = async () => {
    if (!user || uploadingAvatar) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Autorisation requise", "Autorisez l'accès à vos photos pour changer votre image.");
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
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : prev);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de mettre à jour la photo.";
      Alert.alert('Erreur', message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled) setProfile(data ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() || 'Utilisateur Cota';
  const initials =
    ((profile?.first_name?.[0] ?? '') + (profile?.last_name?.[0] ?? '')).toUpperCase() || 'U';

  const confirmSignOut = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            const root = navigation.getParent<RootNav>() ?? (navigation as unknown as RootNav);
            root.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Échec de la déconnexion';
            Alert.alert('Erreur', message);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        {/* Header */}
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: T.ink, flex: 1, textAlign: 'center' }}>Profil</Text>
          <TouchableOpacity style={styles.iconCircle}>
            <BellIcon size={22} color={T.ink3} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={{ alignItems: 'center', paddingBottom: 14, paddingTop: 8 }}>
          <TouchableOpacity onPress={changeAvatar} activeOpacity={0.85} style={{ position: 'relative' }}>
            <Avatar initials={initials} size={92} tone="green" imageUrl={profile?.avatar_url} />
            <View style={styles.cameraBtn}>
              <CameraIcon size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { v: String(stats?.pots ?? 0), l: 'cagnottes' },
            { v: String(stats?.contributions ?? 0), l: 'contributions' },
            { v: formatEur(stats?.raisedCents ?? 0), l: 'levés' },
          ].map(s => (
            <View key={s.l} style={styles.statCard}>
              <Text style={styles.statVal}>{s.v}</Text>
              <Text style={styles.statLbl}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Groups */}
        <Group header="Compte">
          <Row icon={<IdCardIcon size={20} />} title="Mes informations" sub="Nom, email, téléphone" />
          <Row icon={<CardIcon size={20} color={T.brand} />} title="Moyens de paiement" sub="Aucune carte enregistrée" />
          <Row icon={<ShieldIcon size={20} />} title="Sécurité & Face ID" last />
        </Group>

        <Group header="Préférences">
          <Row icon={<GearIcon size={20} />} title="Paramètres" />
          <Row icon={<BellIcon size={20} color={T.brand} />} title="Notifications" last />
        </Group>

        <Group header="Cota">
          <Row icon={<HelpIcon size={20} />} title="Aide et support" />
          <Row icon={<LogoutIcon size={20} />} title="Déconnexion" danger last onPress={confirmSignOut} />
        </Group>

        <Text style={{ textAlign: 'center', paddingTop: 18, color: T.ink4, fontSize: 12 }}>Cota · v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  iconCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  cameraBtn: { position: 'absolute', right: -2, bottom: -2, width: 30, height: 30, borderRadius: 15, backgroundColor: T.brand, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4 },
  name: { fontSize: 22, fontWeight: '700', color: T.ink, letterSpacing: -0.3, marginTop: 10 },
  email: { fontSize: 14, color: T.ink3, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 4 },
  statCard: { flex: 1, backgroundColor: T.surface, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: T.sep },
  statVal: { fontSize: 18, fontWeight: '700', color: T.ink, letterSpacing: -0.3 },
  statLbl: { fontSize: 11, color: T.ink3, marginTop: 2 },
  groupHeader: { fontSize: 12, color: T.ink3, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600', paddingHorizontal: 22, paddingTop: 18, paddingBottom: 6 },
  group: { marginHorizontal: 20, backgroundColor: T.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: T.sep },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: T.brandSoft, alignItems: 'center', justifyContent: 'center' },
  rowIconDanger: { backgroundColor: 'rgba(255,59,48,0.10)' },
  rowTitle: { fontSize: 16, fontWeight: '500', color: T.ink },
  rowSub: { fontSize: 12, color: T.ink3, marginTop: 1 },
  rowSep: { height: 0.5, backgroundColor: T.sep, marginLeft: 64 },
});
