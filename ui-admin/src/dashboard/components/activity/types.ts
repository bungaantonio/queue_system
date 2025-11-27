// types.ts
export type ActivityStatus = 'success' | 'error' | 'info' | 'warning';
export type ActivityAction = 'Completed' | 'Cancelled' | 'Called' | 'Skipped';

export interface Activity {
    id: number;
    user: string;
    action: ActivityAction;
    details: string;
    time: string;
    status: ActivityStatus;
    avatar: string;
}
