import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import type { ThumbType, Tone } from './types';

export interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export interface Pot {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover_url: string | null;
  goal_amount_cents: number;
  raised_amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface PotView {
  id: string;
  title: string;
  raised: string;
  goal: string;
  raisedCents: number;
  goalCents: number;
  pct: number;
  thumb: ThumbType;
  coverUrl: string | null;
}

export interface NotifItem {
  id: string;
  initials: string;
  tone: Tone;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  created_at: string;
}

export interface NotifGroup {
  section: string;
  items: NotifItem[];
}

// ─── helpers ──────────────────────────────────────────────────────────
const CATEGORY_THUMB: Record<string, ThumbType> = {
  travel: 'beach',
  birthday: 'gift',
  wedding: 'gift',
  baby: 'gift',
  solidarity: 'house',
  other: 'gift',
};

export const formatEur = (cents: number): string => {
  const value = cents / 100;
  const fraction = value % 1 === 0 ? 0 : 2;
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: fraction,
    maximumFractionDigits: 2,
  }) + ' €';
};

const toPotView = (p: Pot): PotView => {
  const pct = p.goal_amount_cents > 0
    ? Math.min(100, Math.round((p.raised_amount_cents / p.goal_amount_cents) * 100))
    : 0;
  return {
    id: p.id,
    title: p.title,
    raised: formatEur(p.raised_amount_cents),
    goal: formatEur(p.goal_amount_cents),
    raisedCents: p.raised_amount_cents,
    goalCents: p.goal_amount_cents,
    pct,
    thumb: CATEGORY_THUMB[p.category] ?? 'gift',
    coverUrl: p.cover_url,
  };
};

const SECTION_LABELS = {
  today: "Aujourd'hui",
  yesterday: 'Hier',
};

const sectionFor = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.floor((startOf(now) - startOf(date)) / 86_400_000);
  if (diffDays <= 0) return SECTION_LABELS.today;
  if (diffDays === 1) return SECTION_LABELS.yesterday;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const timeOf = (iso: string): string =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

// ─── hooks ────────────────────────────────────────────────────────────
export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        setProfile(data ?? null);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { profile, loading };
}

export function useOwnedPots() {
  const { user } = useAuth();
  const [pots, setPots] = useState<PotView[] | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setPots([]);
      return;
    }
    const { data } = await supabase
      .from('pots')
      .select('*')
      .eq('owner_id', user.id)
      .neq('status', 'archived')
      .order('created_at', { ascending: false });
    setPots((data as Pot[] | null)?.map(toPotView) ?? []);
  }, [user]);

  useEffect(() => {
    setPots(null);
    refresh();
  }, [refresh]);

  return { pots, loading: pots === null, refresh };
}

export function useContributedPots() {
  const { user } = useAuth();
  const [items, setItems] = useState<
    { pot: PotView; amount: string; date: string }[] | null
  >(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    const { data } = await supabase
      .from('contributions')
      .select('amount_cents, created_at, pots(*)')
      .eq('contributor_id', user.id)
      .eq('status', 'succeeded')
      .order('created_at', { ascending: false });
    const rows = (data ?? []).map((c: any) => ({
      pot: toPotView(c.pots as Pot),
      amount: formatEur(c.amount_cents),
      date: new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    }));
    setItems(rows);
  }, [user]);

  useEffect(() => {
    setItems(null);
    refresh();
  }, [refresh]);

  return { items, loading: items === null, refresh };
}

export function useNotifications() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<NotifGroup[] | null>(null);

  useEffect(() => {
    if (!user) {
      setGroups([]);
      return;
    }
    let cancelled = false;
    setGroups(null);
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (cancelled) return;
        const rows = data ?? [];
        const grouped = new Map<string, NotifItem[]>();
        for (const n of rows) {
          const section = sectionFor(n.created_at);
          const list = grouped.get(section) ?? [];
          list.push({
            id: n.id,
            initials: 'C',
            tone: 'violet',
            title: n.title,
            body: n.body ?? '',
            time: timeOf(n.created_at),
            unread: !n.read_at,
            created_at: n.created_at,
          });
          grouped.set(section, list);
        }
        setGroups(Array.from(grouped.entries()).map(([section, items]) => ({ section, items })));
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { groups, loading: groups === null };
}

export interface PaymentMethod {
  id: string;
  stripe_payment_method_id: string;
  brand: string | null;
  last4: string | null;
  exp_month: number | null;
  exp_year: number | null;
  is_default: boolean;
}

export function usePaymentMethods() {
  const { user } = useAuth();
  const [cards, setCards] = useState<PaymentMethod[] | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setCards([]);
      return;
    }
    const { data } = await supabase
      .from('payment_methods')
      .select('id, stripe_payment_method_id, brand, last4, exp_month, exp_year, is_default')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    setCards((data as PaymentMethod[] | null) ?? []);
  }, [user]);

  useEffect(() => {
    setCards(null);
    refresh();
  }, [refresh]);

  return { cards, loading: cards === null, refresh };
}

// ─── Payments history ─────────────────────────────────────────────────
export interface PaymentEntry {
  id: string;
  direction: 'in' | 'out';
  amountCents: number;
  potId: string;
  potTitle: string;
  counterpartyLabel: string;
  created_at: string;
  time: string;
}

export interface PaymentSection {
  section: string;
  items: PaymentEntry[];
}

export interface PaymentSummary {
  receivedThisMonthCents: number;
  contributedThisMonthCents: number;
}

const formatPersonName = (
  first: string | null | undefined,
  last: string | null | undefined,
): string => {
  const f = first?.trim();
  const l = last?.trim();
  if (f && l) return `${f} ${l.charAt(0).toUpperCase()}.`;
  if (f) return f;
  if (l) return l;
  return '';
};

export function usePaymentHistory() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<PaymentSection[] | null>(null);
  const [summary, setSummary] = useState<PaymentSummary>({
    receivedThisMonthCents: 0,
    contributedThisMonthCents: 0,
  });

  const refresh = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setSummary({ receivedThisMonthCents: 0, contributedThisMonthCents: 0 });
      return;
    }

    // Pots the user owns — needed to scope incoming contributions.
    const { data: owned } = await supabase
      .from('pots')
      .select('id, title, owner_id')
      .eq('owner_id', user.id);
    const ownedIds = (owned ?? []).map(p => p.id);
    const ownedById = Object.fromEntries(
      (owned ?? []).map(p => [p.id, { title: p.title }]),
    );

    // Outgoing: contributions I made. Pull pot.title and pot.owner_id so we
    // can label the counterparty ("vers <owner first name>").
    const outgoingPromise = supabase
      .from('contributions')
      .select('id, amount_cents, created_at, succeeded_at, pot:pots(id, title, owner_id)')
      .eq('contributor_id', user.id)
      .eq('status', 'succeeded')
      .order('created_at', { ascending: false });

    // Incoming: contributions to pots I own. Exclude self-contributions
    // (where I'm both contributor and pot owner) since those already appear in
    // the outgoing list — listing them twice produced duplicate React keys.
    const incomingPromise = ownedIds.length === 0
      ? Promise.resolve({ data: [] as any[] })
      : supabase
          .from('contributions')
          .select('id, amount_cents, created_at, succeeded_at, contributor_id, is_anonymous, pot_id')
          .in('pot_id', ownedIds)
          .eq('status', 'succeeded')
          .neq('contributor_id', user.id)
          .order('created_at', { ascending: false });

    const [outRes, inRes] = await Promise.all([outgoingPromise, incomingPromise]);
    // PostgREST's embedded resource typing comes back as an array even for
    // single-FK relations, so we cast through unknown and normalise below.
    const outRowsRaw = (outRes.data ?? []) as unknown as Array<{
      id: string;
      amount_cents: number;
      created_at: string;
      pot: { id: string; title: string; owner_id: string } |
           { id: string; title: string; owner_id: string }[] | null;
    }>;
    const outRows = outRowsRaw.map(r => ({
      ...r,
      pot: Array.isArray(r.pot) ? (r.pot[0] ?? null) : r.pot,
    }));
    const inRows = (inRes.data ?? []) as Array<{
      id: string;
      amount_cents: number;
      created_at: string;
      contributor_id: string | null;
      is_anonymous: boolean;
      pot_id: string;
    }>;

    // Resolve profile names for every distinct counterparty in a single
    // batched query (one for pot owners, one for contributors).
    const ownerIds = Array.from(new Set(outRows.map(r => r.pot?.owner_id).filter(Boolean) as string[]));
    const contribIds = Array.from(new Set(
      inRows.filter(r => !r.is_anonymous && r.contributor_id).map(r => r.contributor_id!) as string[],
    ));
    const allProfileIds = Array.from(new Set([...ownerIds, ...contribIds]));

    let profilesById: Record<string, { first_name: string | null; last_name: string | null }> = {};
    if (allProfileIds.length) {
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', allProfileIds);
      profilesById = Object.fromEntries(
        (profs ?? []).map(p => [p.id, { first_name: p.first_name, last_name: p.last_name }]),
      );
    }

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthStartMs = monthStart.getTime();

    let received = 0;
    let contributed = 0;

    const outEntries: PaymentEntry[] = outRows.map(r => {
      const owner = r.pot?.owner_id ? profilesById[r.pot.owner_id] : null;
      const ownerName = formatPersonName(owner?.first_name, owner?.last_name);
      if (new Date(r.created_at).getTime() >= monthStartMs) contributed += r.amount_cents;
      return {
        id: r.id,
        direction: 'out',
        amountCents: r.amount_cents,
        potId: r.pot?.id ?? '',
        potTitle: r.pot?.title ?? 'Cagnotte',
        counterpartyLabel: ownerName ? `vers ${ownerName}` : '',
        created_at: r.created_at,
        time: timeOf(r.created_at),
      };
    });

    const inEntries: PaymentEntry[] = inRows.map(r => {
      const isAnon = r.is_anonymous || !r.contributor_id;
      const prof = isAnon ? null : profilesById[r.contributor_id!];
      const contribName = isAnon ? 'Anonyme' : formatPersonName(prof?.first_name, prof?.last_name) || 'Contributeur';
      const potTitle = ownedById[r.pot_id]?.title ?? 'Cagnotte';
      if (new Date(r.created_at).getTime() >= monthStartMs) received += r.amount_cents;
      return {
        id: r.id,
        direction: 'in',
        amountCents: r.amount_cents,
        potId: r.pot_id,
        potTitle,
        counterpartyLabel: contribName,
        created_at: r.created_at,
        time: timeOf(r.created_at),
      };
    });

    // Merge + dedupe by id (defensive — the .neq filter on incoming already
    // prevents the most common case, but if anything else ever re-emits the
    // same row we don't want duplicate React keys downstream).
    const seen = new Set<string>();
    const merged: PaymentEntry[] = [];
    for (const e of [...outEntries, ...inEntries]) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      merged.push(e);
    }
    const all = merged.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    const grouped = new Map<string, PaymentEntry[]>();
    for (const e of all) {
      const s = sectionFor(e.created_at);
      const list = grouped.get(s) ?? [];
      list.push(e);
      grouped.set(s, list);
    }
    setGroups(Array.from(grouped.entries()).map(([section, items]) => ({ section, items })));
    setSummary({ receivedThisMonthCents: received, contributedThisMonthCents: contributed });
  }, [user]);

  useEffect(() => {
    setGroups(null);
    refresh();
  }, [refresh]);

  return { groups, summary, loading: groups === null, refresh };
}

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ pots: number; contributions: number; raisedCents: number } | null>(null);

  useEffect(() => {
    if (!user) {
      setStats({ pots: 0, contributions: 0, raisedCents: 0 });
      return;
    }
    let cancelled = false;
    setStats(null);
    Promise.all([
      supabase.from('pots').select('raised_amount_cents', { count: 'exact' }).eq('owner_id', user.id),
      supabase
        .from('contributions')
        .select('id', { count: 'exact', head: true })
        .eq('contributor_id', user.id)
        .eq('status', 'succeeded'),
    ]).then(([potsRes, contribRes]) => {
      if (cancelled) return;
      const raised = (potsRes.data ?? []).reduce(
        (sum, p: any) => sum + (p.raised_amount_cents ?? 0),
        0,
      );
      setStats({
        pots: potsRes.count ?? 0,
        contributions: contribRes.count ?? 0,
        raisedCents: raised,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { stats, loading: stats === null };
}
