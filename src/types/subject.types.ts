export interface SubjectStudentStatsDTO {
    studentId: string;
    name: string;
    surname: string;
    repositoryId: string;
    repositoryName: string;
    averagePlagiarismRatio: number | null; // TODO: na razie null bo nie mamy jeszcze MPP.23
}