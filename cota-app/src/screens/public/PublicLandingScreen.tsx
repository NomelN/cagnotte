import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { T } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { PrimaryButton } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { StickyCTA } from '../../components/StickyCTA';
import { CalIcon, ShieldIcon, CheckIcon } from '../../icons/Icons';
import { GuestStackParamList } from '../../navigation';
import { PublicTopBar, AvatarStack } from './_shared';

type Nav = StackNavigationProp<GuestStackParamList, 'GuestLanding'>;

const CONTRIBUTORS = [
  { i: 'T', t: 'amber' as const, name: 'Thomas', amount: '50 €', ago: "Aujourd'hui", msg: 'Bon voyage les amis !' },
  { i: 'J', t: 'green' as const, name: 'Julie', amount: '30 €', ago: 'Hier', msg: 'Profitez bien ✈️' },
  { i: 'M', t: 'blue' as const, name: 'Marc', amount: '100 €', ago: '12 mai', msg: null },
  { i: 'S', t: 'pink' as const, name: 'Sophie', amount: '20 €', ago: '10 mai', msg: 'Trop hâte de voir les photos !' },
];

const TrustCard = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
  <View style={styles.trustCard}>
    {icon}
    <View>
      <Text style={styles.trustTitle}>{title}</Text>
      <Text style={styles.trustSub}>{sub}</Text>
    </View>
  </View>
);

export const PublicLandingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingTop: insets.top }}>
          <PublicTopBar />
        </View>

        {/* Hero cover */}
        <View style={styles.cover}>
          <LinearGradient
            colors={['#79C6E9', '#8FD7DC', '#F4D67E', '#E2B25A']}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']}
            start={{ x: 0.5, y: 0.3 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.coverContent}>
            <View style={styles.coverBadge}>
              <View style={styles.coverDot} />
              <Text style={styles.coverBadgeText}>Cagnotte en cours</Text>
            </View>
            <Text style={styles.coverTitle}>Vacances en famille — Bali 2026</Text>
            <Text style={styles.coverOrg}>
              Organisée par <Text style={{ fontWeight: '600' }}>Alexandre Martin</Text>
            </Text>
          </View>
        </View>

        {/* Progress card */}
        <View style={{ paddingHorizontal: 18, marginTop: -32 }}>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Text style={styles.amountBig}>1 250 €</Text>
                <Text style={styles.amountGoal}>/ 2 000 €</Text>
              </View>
              <Text style={styles.pctBadge}>62%</Text>
            </View>
            <ProgressBar value={62} height={7} />
            <View style={styles.contribStatRow}>
              <AvatarStack
                items={CONTRIBUTORS.slice(0, 3).map((c) => ({ i: c.i, t: c.t }))}
                extra={9}
                size={26}
              />
              <Text style={styles.contribStatText}>
                <Text style={{ color: T.ink, fontWeight: '700' }}>12 personnes</Text> ont déjà contribué
              </Text>
            </View>
            <View style={styles.dateRow}>
              <CalIcon size={13} color={T.ink3} />
              <Text style={styles.dateText}>
                Jusqu'au 15 juin 2026 · <Text style={{ color: T.ink2, fontWeight: '600' }}>25 jours</Text> restants
              </Text>
            </View>
          </View>
        </View>

        {/* Organizer message */}
        <View style={{ paddingHorizontal: 22, paddingTop: 22 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Avatar initials="AM" tone="green" size={36} />
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: T.ink }}>Alexandre Martin</Text>
              <Text style={{ fontSize: 11, color: T.ink3 }}>Organisateur · vous a invité·e</Text>
            </View>
          </View>
          <Text style={styles.orgMessage}>
            On part en famille à Bali cet été ! On veut louer une jolie villa avec vue sur la mer. Toute
            participation, petite ou grande, fera plaisir 🌴 Merci d'avance !
          </Text>
        </View>

        {/* Recent contributions */}
        <View style={{ paddingTop: 22 }}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Dernières contributions</Text>
            <Text style={{ fontSize: 12, color: T.ink3 }}>23 au total</Text>
          </View>
          <View style={{ paddingHorizontal: 22 }}>
            {CONTRIBUTORS.map((c, i) => (
              <View key={i}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12 }}>
                  <Avatar initials={c.i} tone={c.t} size={36} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: T.ink }}>{c.name}</Text>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: T.brandInk }}>{c.amount}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>{c.ago}</Text>
                    {c.msg && (
                      <View style={styles.msgBubble}>
                        <Text style={{ fontSize: 13, color: T.ink2, lineHeight: 18 }}>{c.msg}</Text>
                      </View>
                    )}
                  </View>
                </View>
                {i < CONTRIBUTORS.length - 1 && <View style={styles.sep} />}
              </View>
            ))}
          </View>
          <Text style={styles.seeAll}>Voir les 23 contributions →</Text>
        </View>

        {/* Trust footer */}
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 22, paddingTop: 18 }}>
          <TrustCard
            icon={<ShieldIcon size={18} color={T.brand} />}
            title="100% sécurisé"
            sub="Stripe · 3D Secure"
          />
          <TrustCard
            icon={<CheckIcon size={18} color={T.brand} />}
            title="Sans compte"
            sub="En moins d'1 min"
          />
        </View>
      </ScrollView>

      <StickyCTA hint="Pas besoin de créer un compte">
        <PrimaryButton onPress={() => navigation.navigate('GuestContribute')}>
          Contribuer à la cagnotte
        </PrimaryButton>
      </StickyCTA>
    </View>
  );
};

const styles = StyleSheet.create({
  cover: { height: 240, overflow: 'hidden' },
  coverContent: { position: 'absolute', left: 18, right: 18, bottom: 18 },
  coverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.22)',
    marginBottom: 8,
  },
  coverDot: { width: 5, height: 5, borderRadius: 99, backgroundColor: '#fff' },
  coverBadgeText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  coverTitle: { fontSize: 24, fontWeight: '700', color: '#fff', letterSpacing: -0.3, lineHeight: 28 },
  coverOrg: { fontSize: 13, color: 'rgba(255,255,255,0.92)', marginTop: 6 },
  progressCard: {
    backgroundColor: T.surface,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#142820',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 6,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  amountBig: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5, color: T.brandInk },
  amountGoal: { fontSize: 13, color: T.ink3, fontWeight: '500' },
  pctBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: T.brand,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 99,
    backgroundColor: T.brandSoft,
    overflow: 'hidden',
  },
  contribStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: T.sep,
  },
  contribStatText: { fontSize: 13, color: T.ink2, fontWeight: '500', flex: 1 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  dateText: { fontSize: 12, color: T.ink3 },
  orgMessage: { fontSize: 15, color: T.ink, lineHeight: 22 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 22,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: T.ink },
  msgBubble: {
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: T.field,
    borderRadius: 12,
    borderTopLeftRadius: 4,
  },
  sep: { height: 0.5, backgroundColor: T.sep, marginLeft: 48 },
  seeAll: { textAlign: 'center', paddingTop: 10, color: T.brand, fontWeight: '600', fontSize: 13 },
  trustCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: T.field,
    borderRadius: 14,
  },
  trustTitle: { fontSize: 12, fontWeight: '600', color: T.ink },
  trustSub: { fontSize: 10, color: T.ink3, marginTop: 1 },
});
