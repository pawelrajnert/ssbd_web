export interface SubjectStudentStatsDTO {
    studentId: string;
    name: string;
    surname: string;
    repositoryId: string;
    repositoryName: string;
    averagePlagiarismRatio: number | null; // TODO: na razie null bo nie mamy jeszcze MPP.23
}

export interface StudentSubjectDetailsDTO {
    subjectId: string;
    name: string;
    organizationName: string;
    edition: string;
    subjectDescription?: string | null;
    giteaURL: string;
    studentRepository?: {
        repositoryName: string;
        ticketCount: number;
        students?: any[];
    } | null;
    reportVisibilityLevel: string;
}