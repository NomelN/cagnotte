import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
  Alert, Modal, Pressable, Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../theme';
import { Avatar } from '../components/Avatar';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { BackIcon, CopyIcon, DotsIcon, ShareIcon } from '../icons/Icons';
import { HomeStackParamList } from '../navigation';
import { DetailSkeleton } from './states/DetailSkeleton';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { formatEur } from '../data/hooks';

type Nav = StackNavigationProp<HomeStackParamList>;
type Rt = RouteProp<HomeStackParamList, 'Detail'>;

interface PotRow {
  id: string;
  title: string;
  description: string | null;
  goal_amount_cents: number;
  raised_amount_cents: number;
  created_at: string;
  deadline: string | null;
  owner_id: string;
  status: 'active' | 'closed' | 'archived';
}

interface ContribRow {
  id: string;
  amount_cents: number;
  message: string | null;
  is_anonymous: boolean;
  contributor_id: string | null;
  created_at: string;
  profile: { first_name: string | null; last_name: string | null } | null;
}

const RING_R = 92;
const RING_STROKE = 11;
const RING_C = 2 * Math.PI * RING_R;

const TONES = ['amber', 'green', 'blue', 'pink', 'violet'] as const;
type Tone = typeof TONES[number];
const toneFor = (key: string): Tone => TONES[
  [...key].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % TONES.length
];

const formatRelativeDate = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.floor((startOf(now) - startOf(date)) / 86_400_000);
  if (diffDays <= 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const daysUntil = (isoDate: string | null): string => {
  if (!isoDate) return '—';
  const target = new Date(isoDate);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
  if (diff < 0) return 'Fin';
  return String(diff);
};

export const DetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { potId } = route.params;
  const { user } = useAuth();

  const [pot, setPot] = useState<PotRow | null | undefined>(undefined);
  const [contributions, setContributions] = useState<ContribRow[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const load = React.useCallback(async () => {
    const [{ data: potData }, { data: contribsData }] = await Promise.all([
      supabase
        .from('pots')
        .select('id, title, description, goal_amount_cents, raised_amount_cents, created_at, deadline, owner_id, status')
        .eq('id', potId)
        .maybeSingle(),
      supabase
        .from('contributions')
        .select('id, amount_cents, message, is_anonymous, contributor_id, created_at')
        .eq('pot_id', potId)
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false }),
    ]);

    const contribs = (contribsData ?? []) as Omit<ContribRow, 'profile'>[];
    // Hydrate profile names for non-anonymous contributors in one extra query.
    const profileIds = Array.from(new Set(
      contribs.filter(c => !c.is_anonymous && c.contributor_id).map(c => c.contributor_id!),
    ));
    let profilesById: Record<string, { first_name: string | null; last_name: string | null }> = {};
    if (profileIds.length) {
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', profileIds);
      profilesById = Object.fromEntries((profs ?? []).map(p => [p.id, { first_name: p.first_name, last_name: p.last_name }]));
    }

    setPot((potData as PotRow | null) ?? null);
    setContributions(contribs.map(c => ({
      ...c,
      profile: c.is_anonymous || !c.contributor_id ? null : profilesById[c.contributor_id] ?? null,
    })));
  }, [potId]);

  useEffect(() => { setPot(undefined); load(); }, [load]);
  // Refresh when navigating back to this screen (e.g. after a contribution).
  useFocusEffect(React.useCallback(() => { load(); }, [load]));

  if (pot === undefined) return <DetailSkeleton />;

  if (pot === null) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 17, fontWeight: '600', color: T.ink, textAlign: 'center', marginBottom: 16 }}>
          Cette cagnotte est introuvable.
        </Text>
        <SecondaryButton onPress={() => navigation.goBack()}>Retour</SecondaryButton>
      </View>
    );
  }

  const goalCents = pot.goal_amount_cents;
  const raisedCents = pot.raised_amount_cents;
  const pct = goalCents > 0 ? Math.min(100, Math.round((raisedCents / goalCents) * 100)) : 0;
  const ringOffset = RING_C * (1 - pct / 100);

  const participants = new Set(contributions.map(c => c.contributor_id ?? `anon-${c.id}`)).size;
  const remainingCents = Math.max(0, goalCents - raisedCents);
  const daysLeft = daysUntil(pot.deadline);
  const createdLabel = new Date(pot.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const stats: { v: string; l: string }[] = [
    { v: String(participants), l: 'Participants' },
    { v: formatEur(remainingCents), l: 'Reste' },
    { v: daysLeft, l: daysLeft === '—' ? 'Sans date' : daysLeft === 'Fin' ? '' : 'Jours' },
  ];

  const displayName = (c: ContribRow): string => {
    if (c.is_anonymous) return 'Anonyme';
    const first = c.profile?.first_name?.trim();
    const last = c.profile?.last_name?.trim();
    if (first && last) return `${first} ${last.charAt(0)}.`;
    if (first) return first;
    return 'Contributeur';
  };
  const initialFor = (c: ContribRow): string => {
    if (c.is_anonymous) return '?';
    const f = c.profile?.first_name?.trim();
    if (f) return f.charAt(0).toUpperCase();
    return 'C';
  };

  // Each menu action runs *after* the popover closes (small delay so the
  // dismiss animation doesn't fight with a follow-up Alert / Share sheet).
  const runMenuAction = (fn: () => void) => {
    setMenuOpen(false);
    setTimeout(fn, 120);
  };

  const handleCopyLink = () => runMenuAction(async () => {
    if (!pot) return;
    await Clipboard.setStringAsync(`https://cota.app/pot/${pot.id}`);
    Alert.alert('Lien copié', `https://cota.app/pot/${pot.id}`);
  });

  const handleShare = () => runMenuAction(async () => {
    if (!pot) return;
    const url = `https://cota.app/pot/${pot.id}`;
    try {
      await Share.share({
        message: `Soutiens la cagnotte « ${pot.title} » sur Cota : ${url}`,
        url,
      });
    } catch { /* user cancelled */ }
  });

  const handleClose = () => runMenuAction(() => {
    if (!pot) return;
    Alert.alert(
      'Fermer la cagnotte',
      "Plus aucune contribution ne pourra être reçue. Vous pourrez la rouvrir à tout moment.",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Fermer',
          onPress: async () => {
            const { error } = await supabase
              .from('pots')
              .update({ status: 'closed' })
              .eq('id', pot.id);
            if (error) Alert.alert('Erreur', error.message);
            else load();
          },
        },
      ],
    );
  });

  const handleReopen = () => runMenuAction(async () => {
    if (!pot) return;
    const { error } = await supabase
      .from('pots')
      .update({ status: 'active' })
      .eq('id', pot.id);
    if (error) Alert.alert('Erreur', error.message);
    else load();
  });

  const handleArchive = () => runMenuAction(() => {
    if (!pot) return;
    Alert.alert(
      'Archiver la cagnotte',
      "Elle disparaîtra de vos listes. Les contributions déjà versées sont conservées.",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Archiver',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('pots')
              .update({ status: 'archived' })
              .eq('id', pot.id);
            if (error) Alert.alert('Erreur', error.message);
            else navigation.goBack();
          },
        },
      ],
    );
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Green header */}
        <LinearGradient
          colors={[T.brand, T.brandDeep]}
          start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.headerGrad, { paddingTop: insets.top + 8 }]}
        >
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <BackIcon size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginHorizontal: 12, alignItems: 'center' }}>
              <Text style={styles.navTitle} numberOfLines={1}>{pot.title}</Text>
              <Text style={styles.navSub}>
                {`Créée le ${createdLabel}`}
                {pot.status === 'closed' ? ' · Fermée' : ''}
                {pot.status === 'archived' ? ' · Archivée' : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setMenuOpen(true)}
              accessibilityLabel="Plus d'actions"
            >
              <DotsIcon size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Ring */}
          <View style={{ alignItems: 'center', marginVertical: 8 }}>
            <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={220} height={220} viewBox="0 0 220 220" style={{ position: 'absolute' }}>
                <Circle cx={110} cy={110} r={RING_R} stroke="rgba(255,255,255,0.25)" strokeWidth={RING_STROKE} fill="none" />
                {raisedCents > 0 ? (
                  <Circle
                    cx={110} cy={110} r={RING_R}
                    stroke="rgba(255,255,255,0.95)" strokeWidth={RING_STROKE} fill="none"
                    strokeDasharray={`${RING_C}`} strokeDashoffset={ringOffset}
                    strokeLinecap="round" rotation="-90" origin="110,110"
                  />
                ) : (
                  <Circle
                    cx={110} cy={110} r={RING_R}
                    stroke="rgba(255,255,255,0.55)" strokeWidth={RING_STROKE} fill="none"
                    strokeLinecap="round" strokeDasharray="3 14"
                    rotation="-90" origin="110,110"
                  />
                )}
              </Svg>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.ringAmount}>{formatEur(raisedCents)}</Text>
                <Text style={styles.ringSub}>sur {formatEur(goalCents)}</Text>
                <View style={styles.ringBadge}>
                  <Text style={styles.ringBadgeText}>{raisedCents > 0 ? `${pct}%` : 'En attente'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {stats.map(s => (
              <View key={s.l + s.v} style={{ alignItems: 'center' }}>
                <Text style={styles.statVal}>{s.v}</Text>
                {s.l ? <Text style={styles.statLbl}>{s.l}</Text> : null}
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Contributions */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <Text style={styles.cardTitle}>Contributions récentes</Text>
            {contributions.length > 0 && (
              <Text style={{ fontSize: 13, color: T.ink3 }}>
                {contributions.length === 1 ? '1 au total' : `${contributions.length} au total`}
              </Text>
            )}
          </View>

          {contributions.length === 0 ? (
            <View style={styles.emptyInner}>
              <View style={styles.emptyIcon}>
                <ShareIcon size={22} color={T.brand} />
              </View>
              <Text style={styles.emptyTitle}>Aucune contribution pour l'instant</Text>
              <Text style={styles.emptySub}>
                Partagez le lien de la cagnotte pour recevoir vos premières contributions.
              </Text>
            </View>
          ) : (
            <>
              {contributions.slice(0, 5).map((c, i, arr) => (
                <View key={c.id}>
                  <View style={styles.contribRow}>
                    <Avatar initials={initialFor(c)} size={42} tone={toneFor(c.contributor_id ?? c.id)} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.contribName}>{displayName(c)}</Text>
                      <Text style={styles.contribAgo}>{formatRelativeDate(c.created_at)}</Text>
                    </View>
                    <Text style={styles.contribAmount}>{formatEur(c.amount_cents)}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={styles.sep} />}
                </View>
              ))}
              {contributions.length > 5 && (
                <TouchableOpacity style={{ paddingTop: 14, alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: T.brand, fontWeight: '600' }}>
                    Voir toutes les contributions →
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Actions — in-flow so the page scrolls naturally instead of having
            a heavy sticky footer. Contribuer dominates; Share collapses to a
            compact icon button on the right. */}
        <View style={styles.actionsRow}>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              onPress={() => {
                if (pot.status !== 'active') {
                  Alert.alert('Cagnotte fermée', "Cette cagnotte n'accepte plus de contributions.");
                  return;
                }
                navigation.navigate('Contribute', { potId: pot.id });
              }}
              style={pot.status !== 'active' ? { opacity: 0.4 } : undefined}
            >
              {pot.status === 'active' ? 'Contribuer' : 'Cagnotte fermée'}
            </PrimaryButton>
          </View>
          <TouchableOpacity
            style={styles.shareIconBtn}
            onPress={() => pot && navigation.navigate('Share', { potId: pot.id, potTitle: pot.title })}
            activeOpacity={0.85}
            accessibilityLabel="Partager"
          >
            <ShareIcon size={20} color={T.brand} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Action menu — popover anchored visually under the ⋯ button. The
          transparent Modal lets us dismiss on outside-tap while keeping the
          card pinned to the dots' position. */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)}>
          <Pressable
            style={[styles.menuCard, { top: insets.top + 56 }]}
            onPress={() => { /* swallow taps so they don't dismiss the modal */ }}
          >
            <MenuItem icon={<CopyIcon size={16} color={T.ink2} />} label="Copier le lien" onPress={handleCopyLink} />
            <MenuSep />
            <MenuItem icon={<ShareIcon size={16} color={T.ink2} />} label="Partager…" onPress={handleShare} />

            {user?.id === pot.owner_id && (
              <>
                <MenuSep />
                {pot.status === 'active' ? (
                  <MenuItem label="Fermer la cagnotte" onPress={handleClose} />
                ) : pot.status === 'closed' ? (
                  <MenuItem label="Rouvrir la cagnotte" onPress={handleReopen} />
                ) : null}
                <MenuSep />
                <MenuItem label="Archiver la cagnotte" destructive onPress={handleArchive} />
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const MenuItem = ({
  icon, label, destructive, onPress,
}: {
  icon?: React.ReactNode;
  label: string;
  destructive?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.menuItem}>
    {icon ? <View style={{ width: 22, alignItems: 'center' }}>{icon}</View> : <View style={{ width: 22 }} />}
    <Text style={[styles.menuLabel, destructive && { color: T.danger }]}>{label}</Text>
  </TouchableOpacity>
);

const MenuSep = () => <View style={styles.menuSep} />;

const styles = StyleSheet.create({
  headerGrad: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28, paddingBottom: 28, paddingHorizontal: 20 },
  navRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  navSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  ringAmount: { fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: -0.8 },
  ringSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  ringBadge: { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, marginTop: 8 },
  ringBadgeText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  statVal: { fontSize: 20, fontWeight: '700', color: '#fff' },
  statLbl: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  card: {
    margin: 20, backgroundColor: T.surface, borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: T.ink, letterSpacing: -0.3 },
  contribRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  contribName: { fontSize: 15, fontWeight: '600', color: T.ink },
  contribAgo: { fontSize: 12, color: T.ink3, marginTop: 1 },
  contribAmount: { fontSize: 16, fontWeight: '600', color: T.ink },
  sep: { height: 0.5, backgroundColor: T.sep, marginLeft: 54 },
  emptyInner: { alignItems: 'center', paddingVertical: 22, paddingHorizontal: 8 },
  emptyIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: T.ink, textAlign: 'center' },
  emptySub: { fontSize: 13, color: T.ink3, marginTop: 6, lineHeight: 18, textAlign: 'center' },
  actionsRow: {
    flexDirection: 'row', gap: 10, alignItems: 'stretch',
    marginHorizontal: 20, marginTop: 4,
  },
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)' },
  menuCard: {
    position: 'absolute',
    right: 16,
    minWidth: 240,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 13,
  },
  menuLabel: { fontSize: 15, fontWeight: '500', color: T.ink, flex: 1 },
  menuSep: { height: StyleSheet.hairlineWidth, backgroundColor: T.sep, marginLeft: 50 },
  shareIconBtn: {
    width: 56,
    borderRadius: 16,
    backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(30,157,90,0.18)',
  },
});
