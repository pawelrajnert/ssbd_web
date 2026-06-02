import axiosInstance from '../api/auth/middleware.ts';
import type {ScheduleDTO, ScheduleResponse} from "../types/schedule.types.ts";


export const scheduleService = {
    getSchedulesForSubject: async (subjectId: string): Promise<ScheduleResponse> => {
        const response = await axiosInstance.get<ScheduleDTO[]>(`/schedules/subject/${subjectId}`);
        const serverDateHeader = response.headers['date']; // Pobieramy czas z nagłówka by czas się nie rozjechał z backendem.
        const serverTimeMs = serverDateHeader ? new Date(serverDateHeader).getTime() : Date.now();

        return { schedules: response.data, serverTimeMs: serverTimeMs }
    },
    deleteSchedule: async (scheduleId: string, versionHash: string): Promise<void> => {
        await axiosInstance.delete(`/schedules/${scheduleId}`, {
            headers: {
                'If-Match': versionHash
            }
        });
    }
}