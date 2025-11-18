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
    comment: 'J\'adore cet endroit ! Les récompenses de fidélité sont un super bonus.',
    date: '2024-07-20',
  },
  {
    id: '2',
    customerName: 'Bob Williams',
    rating: 4,
    comment: 'Excellente nourriture et personnel sympathique. L\'application facilite le suivi des points.',
    date: '2024-07-19',
  },
  {
    id: '3',
    customerName: 'Charlie Brown',
    rating: 2,
    comment: 'Ma commande était froide et le service était lent. Pas content.',
    date: '2024-07-18',
  },
  {
    id: '4',
    customerName: 'Diana Prince',
    rating: 5,
    comment: 'Le meilleur café de la ville. Je viens ici tous les jours !',
    date: '2024-07-17',
  },
];

export const engagementData: EngagementData[] = [
  { month: 'Jan', stamps: 400, referrals: 24 },
  { month: 'Fév', stamps: 300, referrals: 13 },
  { month: 'Mar', stamps: 500, referrals: 98 },
  { month: 'Avr', stamps: 278, referrals: 39 },
  { month: 'Mai', stamps: 189, referrals: 48 },
  { month: 'Juin', stamps: 239, referrals: 38 },
  { month: 'Juil', stamps: 349, referrals: 43 },
];
