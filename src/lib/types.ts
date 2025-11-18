
export type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
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
