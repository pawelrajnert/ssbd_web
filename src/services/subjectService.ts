import axiosInstance from "../api/auth/middleware";
import type { SubjectStudentStatsDTO } from "../types/subject.types";

export const subjectService = {
    getSubjectUsers: async (subjectName: string) => {
        const encodedName = encodeURIComponent(subjectName);
        const response = await axiosInstance.get<SubjectStudentStatsDTO[]>(`/subject/${encodedName}/users`);
        return response.data;
    }
};