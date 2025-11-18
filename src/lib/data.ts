
import type { Review, EngagementData, Referral } from './types';

export const stats = {
  totalClients: 0,
  stampsValidated: 0,
  rewardsClaimed: 0,
  activeReferrals: 0,
};

export const recentReviews: Review[] = [];

export const engagementData: EngagementData[] = [
  { month: 'Jan', stamps: 0, referrals: 0 },
  { month: 'Fév', stamps: 0, referrals: 0 },
  { month: 'Mar', stamps: 0, referrals: 0 },
  { month: 'Avr', stamps: 0, referrals: 0 },
  { month: 'Mai', stamps: 0, referrals: 0 },
  { month: 'Juin', stamps: 0, referrals: 0 },
  { month: 'Juil', stamps: 0, referrals: 0 },
];

export const referralActivity: Referral[] = [];
