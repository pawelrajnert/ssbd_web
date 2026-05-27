import axiosInstance from '../api/auth/middleware';
import type {StudentRepositoryDTO} from '../types/studentScan.types';

export const repositoryService = {
    getMyRepositories: async (): Promise<StudentRepositoryDTO[]> => {
        const response = await axiosInstance.get<StudentRepositoryDTO[]>('/repositories/my-repositories');
        return response.data;
    }
};