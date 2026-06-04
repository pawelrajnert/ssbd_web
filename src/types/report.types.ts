export interface ReportDTO {
    id: string;
    tag: string;
    average_similarity: number;
    created_at: string;
    created_by: string;
    subject_name: string;
}

export interface FilteredComparisonDTO {
    matchedWith: string;
    maxSimilarity?: number;
    averageSimilarity?: number;
    longestMatch?: number;
    studentFile?: string;
    studentCode?: string;
    matchedLines?: number[];
}

export interface StudentOwnReportDetailsDTO {
    reportId: string;
    tag: string;
    subjectName: string;
    createdAt: string;
    matches: FilteredComparisonDTO[];
}

export interface TeacherMatchedFile {
    fileA: string;
    fileB: string;
    codeA: string;
    codeB: string;
    matchedLinesA: number[];
    matchedLinesB: number[];
    tokens?: number;
}

export interface TeacherComparison {
    firstSubmission: string;
    secondSubmission: string;
    maxSimilarity: number;
    averageSimilarity: number;
    longestMatch: number;
    similarityA?: number;
    similarityB?: number;
    fileA?: string;
    fileB?: string;
    codeA?: string;
    codeB?: string;
    matchedLinesA?: number[];
    matchedLinesB?: number[];
    matchedFiles?: TeacherMatchedFile[];
}

export interface TeacherReportDetails {
    id: string;
    tag: string;
    subjectName: string;
    createdAt: string;
    averageSimilarity: number;
    comparisons: TeacherComparison[];
}