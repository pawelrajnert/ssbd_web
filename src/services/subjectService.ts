import type { SubjectDTO, UpdateSubjectDTO } from '../types/SubjectDTO';
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

export const getAllSubjects = async (): Promise<SubjectDTO[]> => {
    const response = await axiosInstance.get<SubjectDTO[]>('/subjects');
    return response.data;
};

export const getSubjectDetails = async (id: string): Promise<SubjectDTO> => {
    const response = await axiosInstance.get<SubjectDTO>(`/subjects/${id}`);

    if (response.headers['etag']) {
        response.data.versionHash = response.headers['etag'].replace(/"/g, '');
    }

    return response.data;
};

export const updateSubject = async (id: string, data: UpdateSubjectDTO, versionHash: string): Promise<void> => {
    await axiosInstance.put(`/subjects/${id}`, data, {
        headers: {
            'If-Match': versionHash
        }
    });
};