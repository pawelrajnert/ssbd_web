import axiosInstance from '../api/auth/middleware.ts';
import type {ScheduleDTO, ScheduleResponse} from "../types/schedule.types.ts";


export const scheduleService = {
    getSchedulesForSubject: async (subjectId: string): Promise<ScheduleResponse> => {
        const response = await axiosInstance.get<ScheduleDTO[]>(`/schedules/subject/${subjectId}`);
        const serverDateHeader = response.headers['date']; // Pobieramy czas z nagłówka by czas się nie rozjechał z backendem.
        const serverTimeMs = serverDateHeader ? new Date(serverDateHeader).getTime() : Date.now();

        return { schedules: response.data, serverTimeMs: serverTimeMs }
    },
    createSchedule: async (subjectId: string, payload: {scheduleDateTime: string, tag: string}): Promise<{scheduleDateTime: string, tag: string}> => {
        const response = await axiosInstance
            .post<ScheduleDTO>(`/schedules/subject/${subjectId}`, {scheduleDateTime: payload.scheduleDateTime, tag: payload.tag});
        return response.data
    },
    deleteSchedule: async (scheduleId: string, versionHash: string): Promise<void> => {
        await axiosInstance.delete(`/schedules/${scheduleId}`, {
            headers: {
                'If-Match': versionHash
            }
        });
    },

    updateSchedule: async (scheduleId: string, data: { scheduleDateTime: string, tag: string }): Promise<void> => {
        await axiosInstance.put(`/schedules/${scheduleId}`, data);
    }
}