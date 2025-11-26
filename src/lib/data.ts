

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
        customerName: 'John Smith',
        rating: 5,
        comment: 'Absolutely wonderful experience! The food was delicious and the service was impeccable. Will definitely be back!',
        date: '2 jours',
        aiResponse: '',
    },
    {
        id: '2',
        customerName: 'Maria Garcia',
        rating: 2,
        comment: 'El servicio fue muy lento y la comida estaba fría. Una decepción.',
        date: '3 jours',
        aiResponse: '',
    },
    {
        id: '3',
        customerName: 'Hans Müller',
        rating: 4,
        comment: 'Sehr gutes Essen und freundliches Personal. Die Atmosphäre war auch sehr angenehm. Wir kommen gerne wieder.',
        date: '5 jours',
        aiResponse: '',
    },
    {
        id: '4',
        customerName: 'Alice Dubois',
        rating: 5,
        comment: 'Un restaurant exceptionnel ! Le cadre est magnifique et les plats sont d\'une grande finesse. Bravo à toute l\'équipe !',
        date: '1 semaine',
        aiResponse: '',
    }
];

export const engagementData: EngagementData[] = [];

// This will now be read from localStorage, but we keep the type export
export const referralActivity: Referral[] = [];
