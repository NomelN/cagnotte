import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!user) {
      setPots([]);
      return;
    }
    let cancelled = false;
    setPots(null);
    supabase
      .from('pots')
      .select('*')
      .eq('owner_id', user.id)
      .neq('status', 'archived')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setPots((data as Pot[] | null)?.map(toPotView) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { pots, loading: pots === null };
}

export function useContributedPots() {
  const { user } = useAuth();
  const [items, setItems] = useState<
    { pot: PotView; amount: string; date: string }[] | null
  >(null);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    let cancelled = false;
    setItems(null);
    supabase
      .from('contributions')
      .select('amount_cents, created_at, pots(*)')
      .eq('contributor_id', user.id)
      .eq('status', 'succeeded')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        const rows = (data ?? []).map((c: any) => ({
          pot: toPotView(c.pots as Pot),
          amount: formatEur(c.amount_cents),
          date: new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        }));
        setItems(rows);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { items, loading: items === null };
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
