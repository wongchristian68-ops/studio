
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
        aiResponse: 'Thank you so much for your kind words, John! We are so happy to hear that you had a wonderful experience with us. We look forward to seeing you again soon!',
    },
    {
        id: '2',
        customerName: 'Maria Garcia',
        rating: 2,
        comment: 'El servicio fue muy lento y la comida estaba fría. Una decepción.',
        date: '3 jours',
        aiResponse: 'Hola Maria, lamentamos mucho que tu experiencia no haya sido la ideal. Nos gustaría saber más sobre lo que pasó. ¿Podrías contactarnos directamente? Gracias por tus comentarios.',
    },
    {
        id: '3',
        customerName: 'Hans Müller',
        rating: 4,
        comment: 'Sehr gutes Essen und freundliches Personal. Die Atmosphäre war auch sehr angenehm. Wir kommen gerne wieder.',
        date: '5 jours',
        aiResponse: 'Vielen Dank für Ihre positive Bewertung, Hans! Wir freuen uns, dass Ihnen das Essen und der Service gefallen haben und hoffen, Sie bald wieder bei uns begrüßen zu dürfen.',
    },
    {
        id: '4',
        customerName: 'Alice Dubois',
        rating: 5,
        comment: 'Un restaurant exceptionnel ! Le cadre est magnifique et les plats sont d\'une grande finesse. Bravo à toute l\'équipe !',
        date: '1 semaine',
        aiResponse: 'Merci beaucoup pour votre merveilleux commentaire, Alice ! Nous sommes ravis que vous ayez apprécié le cadre et notre cuisine. Au plaisir de vous accueillir à nouveau !',
    }
];

export const engagementData: EngagementData[] = [];

// This will now be read from localStorage, but we keep the type export
export const referralActivity: Referral[] = [];
