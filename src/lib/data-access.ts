
import type { User, Restaurant } from "./types";
import { recentReviews as defaultRecentReviews } from './data';

// --- User Management ---

export function getLoggedInUser(): User[] | null {
    if (typeof window === 'undefined') return null;
    const userStr = sessionStorage.getItem('loggedInUser');
    if (!userStr) return null;
    try {
        const data = JSON.parse(userStr);
        return Array.isArray(data) ? data : [data];
    } catch (e) {
        console.error("Failed to parse loggedInUser from sessionStorage", e);
        return null;
    }
}

export function getAllUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
}

export function saveAllUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('users', JSON.stringify(users));
}

// --- Restaurant Management ---

export function getRestaurantById(id: string): Restaurant | null {
     if (typeof window === 'undefined') return null;
     const allUsers = getAllUsers();
     const restaurateur = allUsers.find(u => u.id === id && u.role === 'restaurateur');
     if (!restaurateur) return null;

     const profileStr = localStorage.getItem(`restaurantProfile_${id}`);
     const loyaltySettingsStr = localStorage.getItem(`loyaltySettings_${id}`);
     const referralSettingsStr = localStorage.getItem(`referralSettings_${id}`);
     const logo = localStorage.getItem(`loyaltyCardLogo_${id}`);

     return {
        id: restaurateur.id,
        name: profileStr ? JSON.parse(profileStr).name : restaurateur.name,
        address: profileStr ? JSON.parse(profileStr).address : '',
        loyaltySettings: loyaltySettingsStr ? JSON.parse(loyaltySettingsStr) : { stampCount: 10, rewardDescription: 'Une boisson chaude offerte' },
        referralSettings: referralSettingsStr ? JSON.parse(referralSettingsStr) : { referrerReward: '2 tampons bonus', referredReward: '2 tampons bonus', isEnabled: true },
        logoUrl: logo,
     };
}

export function getRestaurantsForCustomer(customerPhone: string): Restaurant[] {
    const allUsers = getAllUsers();
    const customerAccounts = allUsers.filter(u => u.phone === customerPhone && u.role === 'customer' && u.restaurateurId);
    const restaurantIds = [...new Set(customerAccounts.map(u => u.restaurateurId))];
    
    const restaurants = restaurantIds.map(id => getRestaurantById(id!)).filter(Boolean) as Restaurant[];
    return restaurants;
}


// --- Customer Data ---
export function getCustomerData(customerId: string, restaurateurId: string) {
    if (typeof window === 'undefined') return null;
    
    const stampCount = localStorage.getItem(`stamps_${restaurateurId}_${customerId}`) || '0';
    const pendingRewards = localStorage.getItem(`pending_referral_rewards_${restaurateurId}_${customerId}`) || '[]';
    const claimedRewards = localStorage.getItem(`referral_rewards_${restaurateurId}_${customerId}`) || '[]';

    return {
        stampCount: parseInt(stampCount, 10),
        pendingReferralRewards: JSON.parse(pendingRewards),
        claimedReferralRewards: JSON.parse(claimedRewards),
    }
}

// --- Reviews ---
export function getReviewsForRestaurant(restaurateurId: string) {
    if (typeof window === 'undefined') return defaultRecentReviews;
    const storedReviews = localStorage.getItem(`reviews_${restaurateurId}`);
    if (storedReviews) {
        return JSON.parse(storedReviews);
    }
    // If no specific reviews, return default but associate them with the restaurateur for demo purposes
    localStorage.setItem(`reviews_${restaurateurId}`, JSON.stringify(defaultRecentReviews));
    return defaultRecentReviews;
}
