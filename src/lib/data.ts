
import type { Review, EngagementData, Referral } from './types';

export const stats = {
  totalClients: 0,
  stampsValidated: 0,
  rewardsClaimed: 0,
  activeReferrals: 0,
};

export const recentReviews: Review[] = [
    {
        id: '1',
        customerName: 'Alice Martin',
        rating: 5,
        comment: 'Super expérience, le cadre est génial et les plats délicieux ! Je recommande vivement.',
        date: 'il y a 2 jours',
    },
    {
        id: '2',
        customerName: 'Thomas Dubois',
        rating: 4,
        comment: "Très bon restaurant, service un peu lent mais la qualité des plats rattrape tout. Le programme de fidélité est un plus !",
        date: 'il y a 1 semaine',
    },
    {
        id: '3',
        customerName: 'Léa Petit',
        rating: 2,
        comment: "Déçue par mon dernier passage. Le plat principal était froid et le service pas très accueillant. Dommage.",
        date: 'il y a 2 semaines',
    },
    {
        id: '4',
        customerName: 'Julien Moreau',
        rating: 5,
        comment: 'Parfait ! Rien à redire. Le système de parrainage est top, j\'ai déjà converti un ami !',
        date: 'il y a 3 semaines',
    }
];

export const engagementData: EngagementData[] = [];

export const referralActivity: Referral[] = [];
