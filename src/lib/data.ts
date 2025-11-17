import type { Review, EngagementData } from './types';

export const stats = {
  totalClients: 1254,
  stampsValidated: 8321,
  rewardsClaimed: 742,
  activeReferrals: 156,
};

export const recentReviews: Review[] = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    rating: 5,
    comment: 'Absolutely love this place! The loyalty rewards are a great bonus.',
    date: '2024-07-20',
  },
  {
    id: '2',
    customerName: 'Bob Williams',
    rating: 4,
    comment: 'Great food and friendly staff. The app makes it easy to track points.',
    date: '2024-07-19',
  },
  {
    id: '3',
    customerName: 'Charlie Brown',
    rating: 2,
    comment: 'My order was cold and the service was slow. Not happy.',
    date: '2024-07-18',
  },
  {
    id: '4',
    customerName: 'Diana Prince',
    rating: 5,
    comment: 'Best coffee in town. I come here every day!',
    date: '2024-07-17',
  },
];

export const engagementData: EngagementData[] = [
  { month: 'Jan', stamps: 400, referrals: 24 },
  { month: 'Feb', stamps: 300, referrals: 13 },
  { month: 'Mar', stamps: 500, referrals: 98 },
  { month: 'Apr', stamps: 278, referrals: 39 },
  { month: 'May', stamps: 189, referrals: 48 },
  { month: 'Jun', stamps: 239, referrals: 38 },
  { month: 'Jul', stamps: 349, referrals: 43 },
];
