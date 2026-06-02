import type { SubjectDTO, UpdateSubjectDTO } from '../types/SubjectDTO';
import axiosInstance from '../api/auth/middleware';
import type { StudentSubjectDetailsDTO } from '../types/subject.types';

export const subjectService = {
    createSubject: async (subject: SubjectDTO): Promise<void> => {
        if (subject.templateId) {
            const templateDto = {
                name: subject.name,
                organizationName: subject.organizationName,
                edition: subject.edition,
                subjectDescription: subject.subjectDescription,
                giteaURL: subject.giteaURL,
                templateId: subject.templateId,
                raportLevelName: subject.manualRules?.raportLevelName || 'FULL',
                teachers: subject.teachers
            };
            await axiosInstance.post('/subjects/template', templateDto);
        } else {
            const manualDto = {
                name: subject.name,
                organizationName: subject.organizationName,
                edition: subject.edition,
                subjectDescription: subject.subjectDescription,
                giteaURL: subject.giteaURL,
                manualRules: subject.manualRules,
                teachers: subject.teachers
            };
            await axiosInstance.post('/subjects/manual', manualDto);
        }
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

export const deleteSubject = async (subjectId: string, versionHash: string, deleteGiteaOrg: boolean = false): Promise<void> => {
    await axiosInstance.delete(`/subjects/${subjectId}`, {
        headers: {
            'If-Match': versionHash,
        },
        params: {
            deleteGiteaOrg: deleteGiteaOrg,
        },
    });
};

export const syncSubjectWithGitea = async (subjectId: string): Promise<void> => {
    await axiosInstance.post(`/subjects/${subjectId}/sync`);
};

export const getStudentSubjectDetails = async (subjectId: string): Promise<StudentSubjectDetailsDTO> => {
    const response = await axiosInstance.get(`/subjects/${subjectId}/student`);
    return response.data;
};
