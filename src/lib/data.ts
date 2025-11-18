
import type { Review, EngagementData, Referral } from './types';

export const stats = {
  totalClients: 89,
  stampsValidated: 278,
  rewardsClaimed: 21,
  activeReferrals: 12,
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

export const engagementData: EngagementData[] = [
  { month: 'Jan', stamps: 18, referrals: 2 },
  { month: 'Fév', stamps: 32, referrals: 1 },
  { month: 'Mar', stamps: 45, referrals: 4 },
  { month: 'Avr', stamps: 51, referrals: 3 },
  { month: 'Mai', stamps: 62, referrals: 5 },
  { month: 'Juin', stamps: 70, referrals: 2 },
  { month: 'Juil', stamps: 65, referrals: 3 },
];

export const referralActivity: Referral[] = [
  { id: '1', referrer: 'Julien Moreau', referred: 'Claire Bernard', date: '20/06/2024', status: 'Complété' },
  { id: '2', referrer: 'Sophie Lambert', referred: 'Marc Rousseau', date: '15/06/2024', status: 'Complété' },
  { id: '3', referrer: 'Antoine Lefebvre', referred: 'Marie Girard', date: '12/07/2024', status: 'En attente' },
  { id: '4', referrer: 'Chloé Fournier', referred: 'Luc David', date: '01/05/2024', status: 'Expiré' },
  { id: '5', referrer: 'Pauline André', referred: 'Hugo Simon', date: '08/07/2024', status: 'En attente' },
];
