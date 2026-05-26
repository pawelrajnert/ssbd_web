import axiosInstance from "../api/auth/middleware";
import type { Page } from "../types/user.types";
import type { ReportDTO } from "../types/report.types";

export const reportService = {
    getAllReportsForSubject: async (
        subjectId: string,
        page?: number,
        size?: number,
        sortBy?: string,
        sortDesc?: boolean
    ) => {
        const params = new URLSearchParams();
        if (page !== undefined) params.append('page', page.toString());
        if (size !== undefined) params.append('size', size.toString());

        if (sortBy !== undefined) params.append('sortBy', sortBy);
        if (sortDesc !== undefined) params.append('sortDesc', sortDesc.toString());

        const response = await axiosInstance.get<Page<ReportDTO>>(
            `/reports/subject/${subjectId}?${params.toString()}`
        );

        return response.data;
    },

    getAllReportsForTeacher: async (
        page?: number,
        size?: number,
        sortBy?: string,
        sortDesc?: boolean
    ) => {
        const params = new URLSearchParams();
        if (page !== undefined) params.append('page', page.toString());
        if (size !== undefined) params.append('size', size.toString());

        if (sortBy !== undefined) params.append('sortBy', sortBy);
        if (sortDesc !== undefined) params.append('sortDesc', sortDesc.toString());

        const response = await axiosInstance.get<Page<ReportDTO>>(
            `/reports/teacher?${params.toString()}`
        );

        return response.data;
    },
    deleteReport: async(id: string) => {
        const response = await axiosInstance.delete<Page<ReportDTO>>(
            `/reports/${id}`
        );
        return response.data;
    }
};