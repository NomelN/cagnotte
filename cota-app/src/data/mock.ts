// Mock data source for the app.
// Flip DEMO_EMPTY to true to preview the empty states on Home / Notifications.

export const DEMO_EMPTY = false;

export type ThumbType = 'beach' | 'gift' | 'house';
export type Tone = 'neutral' | 'blue' | 'pink' | 'amber' | 'green' | 'violet';

export interface Pot {
  title: string;
  raised: string;
  goal: string;
  pct: number;
  thumb: ThumbType;
}

export interface NotifItem {
  initials: string;
  tone: Tone;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export interface NotifGroup {
  section: string;
  items: NotifItem[];
}

const POTS: Pot[] = [
  { title: 'Vacances en famille', raised: '1 250 €', goal: '2 000 €',  pct: 62, thumb: 'beach' },
  { title: 'Anniversaire Léa',    raised: '320 €',   goal: '500 €',    pct: 64, thumb: 'gift'  },
  { title: 'Achat appartement',   raised: '9 450 €', goal: '20 000 €', pct: 47, thumb: 'house' },
];

const NOTIFICATIONS: NotifGroup[] = [
  {
    section: "Aujourd'hui",
    items: [
      {
        initials: 'T', tone: 'amber',
        title: 'Thomas a contribué 50 €',
        body: 'Anniversaire Léa · "Bon courage pour les préparatifs !"',
        time: '13:24', unread: true,
      },
      {
        initials: 'J', tone: 'green',
        title: 'Julie a contribué 30 €',
        body: 'Vacances en famille · Contribution anonyme',
        time: '09:11', unread: true,
      },
    ],
  },
  {
    section: 'Hier',
    items: [
      {
        initials: 'C', tone: 'violet',
        title: 'Cota',
        body: 'Votre cagnotte "Anniversaire Léa" atteint 64% de son objectif 🎉',
        time: '18:00', unread: false,
      },
      {
        initials: 'M', tone: 'blue',
        title: 'Marc a contribué 100 €',
        body: 'Anniversaire Léa',
        time: '10:40', unread: false,
      },
    ],
  },
  {
    section: '10 mai',
    items: [
      {
        initials: 'S', tone: 'pink',
        title: 'Sophie a contribué 20 €',
        body: 'Vacances en famille',
        time: '08:55', unread: false,
      },
      {
        initials: 'C', tone: 'violet',
        title: 'Cota',
        body: "Votre lien a été partagé 3 fois aujourd'hui pour \"Vacances en famille\"",
        time: '08:00', unread: false,
      },
    ],
  },
];

export const homePots: Pot[] = DEMO_EMPTY ? [] : POTS;
export const homeNotifications: NotifGroup[] = DEMO_EMPTY ? [] : NOTIFICATIONS;
