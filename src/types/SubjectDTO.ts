export interface RulePresetDTO {
    id: string;
    raportLevelName: string;
    studentTicketCount: number;
    minimumTokensMatch: number;
    enableNormalization: boolean;
}

export interface SubjectDTO {
    id?: string | null;
    versionHash?: string | null;
    name: string;
    organizationName: string;
    edition: string;
    subjectDescription?: string | null;
    giteaURL: string;
    archived?: boolean | null;
    canEdit?: boolean | null;
    canManageTeachers?: boolean | null;
    canViewStats?: boolean | null;
    templateId?: string | null;
    manualRules?: RulePresetDTO | null;
}