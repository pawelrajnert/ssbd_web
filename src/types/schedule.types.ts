export interface ScheduleDTO {
    id: string;
    scheduleDateTime: string;
    tag: string;
}

export interface ScheduleResponse {
    schedules: ScheduleDTO[];
    serverTimeMs: number;
}

export const ScheduleStatus = {
    EXECUTED: "schedule.status.executed",
    PLANNED: "schedule.status.planned",
} as const;

export type ScheduleStatus = typeof ScheduleStatus[keyof typeof ScheduleStatus];
export type FilterStatus = ScheduleStatus | 'ALL';