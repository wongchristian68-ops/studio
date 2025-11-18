
import type { Review, EngagementData, Referral } from './types';

export const stats = {
  totalClients: 0,
  stampsValidated: 0,
  rewardsClaimed: 0,
  activeReferrals: 0,
};

export const recentReviews: Review[] = [];

export const engagementData: EngagementData[] = [];

// This will now be read from localStorage, but we keep the type export
export const referralActivity: Referral[] = [];
