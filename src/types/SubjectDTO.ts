export interface SubjectDTO {
    id?: string | null;
    versionHash?: string | null;
    name: string;
    organizationName: string;
    edition: string;
    subjectDescription?: string | null;
    giteaURL: string;
    archived?: boolean | null;
}