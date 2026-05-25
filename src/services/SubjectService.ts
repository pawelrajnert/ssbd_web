import type { SubjectDTO } from '../types/SubjectDTO';
import axiosInstance from '../api/auth/middleware';

export const subjectService = {
    createSubject: async (data: SubjectDTO): Promise<void> => {
        await axiosInstance.post('/api/subjects', data);
    },
    getSubjects: async (): Promise<SubjectDTO[]> => {
        const response = await axiosInstance.get('/api/subjects');
        return response.data;
    }
};