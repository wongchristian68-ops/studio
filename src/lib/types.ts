

export type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  aiResponse?: string;
};

export type EngagementData = {
  month: string;
  stamps: number;
  referrals: number;
};

export type Referral = {
  id: string;
  referrer: string;
  referred: string;
  date: string;
  status: 'Complété' | 'En attente' | 'Expiré';
};

export type ActivityEvent = {
    type: 'stamp' | 'reward' | 'referral_claim' | 'referral_bonus';
    date: string; // ISO 8601 format
    userPhone: string;
    description?: string;
};
