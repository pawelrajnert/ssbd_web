import axiosInstance from "../api/auth/middleware";
import type {Page} from "../types/user.types";
import type {ReportDTO, StudentOwnReportDetailsDTO} from "../types/report.types";
import type {StudentReportDetailsDTO} from "../types/studentScan.types.ts";

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
        deleteReport: async (id: string) => {
            const response = await axiosInstance.delete<Page<ReportDTO>>(
                `/reports/${id}`
            );
            return response.data;
        },

        getMyReports: async (): Promise<ReportDTO[]> => {
            // TODO: do odkomentowania pozniej
            // const response = await axiosInstance.get<ReportDTO[]>('/reports/my-reports');
            // return response.data;

            // poki co mock
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        {
                            id: "mock-report-1234-5678",
                            tag: "v1.0-final",
                            average_similarity: 0.85,
                            created_at: new Date().toISOString(),
                            created_by: "admin",
                            subject_name: "Programowanie Aplikacji Sieciowych"
                        },
                        {
                            id: "mock-report-abcd-efgh",
                            tag: "v2.0-poprawka",
                            average_similarity: 0.12,
                            created_at: new Date(Date.now() - 86400000).toISOString(),
                            created_by: "admin",
                            subject_name: "Metodyki Programowania"
                        }
                    ]);
                }, 800);
            });
        },

        getMyReportDetails: async (reportId: string): Promise<StudentOwnReportDetailsDTO> => {
            // TODO: do odkomentowania pozniej
            // const response = await axiosInstance.get<StudentOwnReportDetailsDTO>(`/reports/my-reports/${reportId}`);
            // return response.data;

            // poki co mock
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        reportId: reportId,
                        tag: "v1.0-final",
                        subjectName: "Programowanie Aplikacji Sieciowych",
                        createdAt: new Date().toISOString(),
                        matches: [
                            {
                                matchedWith: "Repozytorium Innego Studenta",
                                maxSimilarity: 0.85,
                                averageSimilarity: 0.45,
                                longestMatch: 250,
                                studentFile: "RoomController.java",
                                studentCode: `package com.example.controller;\n\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\n@RequestMapping("/api/rooms")\npublic class RoomController {\n\n    @GetMapping\n    public List<Room> getAllRooms() {\n        return roomService.findAll();\n    }\n\n    @PostMapping\n    public void addRoom(@RequestBody Room room) {\n        roomService.save(room);\n    }\n}`,
                                matchedLines: [13, 14, 15, 16]
                            },
                            {
                                matchedWith: "Repozytorium Innego Studenta",
                                maxSimilarity: 0.32,
                                longestMatch: 45
                            }
                        ]
                    });
                }, 800);
            });
        },

        generateStudentScan: async (
            repositoryId: string,
            studentTag: string,
            taskTag: string
        ): Promise<StudentReportDetailsDTO> => {
            const response = await axiosInstance.post<StudentReportDetailsDTO>(
                `/reports/student-scan/${repositoryId}`,
                null,
                {params: {studentTag, taskTag}}
            );
            return response.data;
        },

        postStartSubjectAnalysis: async (
            subjectId: string | undefined,
            tag: string
        ): Promise<ReportDTO> => {
            const response = await axiosInstance.post<ReportDTO>(
                `reports/demand/${subjectId}`,
                null,
                {params: {tag}}
            )
            return response.data;
        }


    };

export const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const optionsDate: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric', year: 'numeric'};
    const optionsTime: Intl.DateTimeFormatOptions = {hour: '2-digit', minute: '2-digit', hour12: false};

    return `${date.toLocaleDateString('en-US', optionsDate)} • ${date.toLocaleTimeString('en-US', optionsTime)}`;
};