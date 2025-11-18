
import type { Review, EngagementData, Referral } from './types';

export const stats = {
  totalClients: 0,
  stampsValidated: 0,
  rewardsClaimed: 0,
  activeReferrals: 0,
};

export const recentReviews: Review[] = [];

export const engagementData: EngagementData[] = [];

export const referralActivity: Referral[] = [];
