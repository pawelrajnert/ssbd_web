import type { SubjectDTO } from '../types/SubjectDTO';
import axiosInstance from '../api/auth/middleware';

export const subjectService = {
    createSubject: async (data: SubjectDTO): Promise<void> => {
        await axiosInstance.post('/subjects', data);
    },
    getSubjects: async (): Promise<SubjectDTO[]> => {
        const response = await axiosInstance.get('/subjects');
        return response.data;
    },
    getSubjectUsers: async (subjectId: string): Promise<any> => {
        const response = await axiosInstance.get(`/subjects/${subjectId}/users`);
        return response.data;
    }
};