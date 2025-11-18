
export type ActivityEvent = {
    type: 'stamp';
    date: string; // ISO 8601 format
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

// Function to add a new stamp activity to the log
export function logStampActivity(): void {
    if (typeof window === 'undefined') {
        return;
    }
    const log = getActivityLog();
    const newEvent: ActivityEvent = {
        type: 'stamp',
        date: new Date().toISOString(),
    };
    log.push(newEvent);
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
}
