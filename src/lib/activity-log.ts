
export type ActivityEvent = {
    type: 'stamp' | 'reward' | 'referral_claim' | 'referral_bonus';
    date: string; // ISO 8601 format
    userPhone: string;
    description?: string;
};

const ACTIVITY_LOG_KEY = 'activityLog';

// Function to get the activity log from localStorage
export function getActivityLog(): ActivityEvent[] {
    if (typeof window === 'undefined') {
        return [];
    }
    const log = localStorage.getItem(ACTIVITY_LOG_KEY);
    return log ? JSON.parse(log) : [];
}

// Function to set the activity log in localStorage
export function setActivityLog(log: ActivityEvent[]): void {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
}


// Function to add a new activity event to the log
function logActivity(type: ActivityEvent['type'], userPhone: string, details: { description?: string } = {}): void {
    if (typeof window === 'undefined') {
        return;
    }
    const log = getActivityLog();
    const newEvent: ActivityEvent = {
        type: type,
        date: new Date().toISOString(),
        userPhone,
        ...details
    };
    log.push(newEvent);
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
}


// Function to add a new stamp activity to the log
export function logStampActivity(userPhone: string): void {
    logActivity('stamp', userPhone);
}

// Function to add a new reward claimed activity to the log
export function logRewardClaimActivity(userPhone: string): void {
    logActivity('reward', userPhone);
}

// Function to log when a referrer claims their referral reward
export function logReferralClaimActivity(userPhone: string, rewardDescription: string): void {
    logActivity('referral_claim', userPhone, { description: rewardDescription });
}

// Function to log when a referred user gets their initial bonus
export function logReferralBonusActivity(userPhone: string, rewardDescription: string): void {
    logActivity('referral_bonus', userPhone, { description: rewardDescription });
}
