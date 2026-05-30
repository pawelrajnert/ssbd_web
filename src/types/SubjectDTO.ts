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

export type TeacherSubjectRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface TeacherAssignmentDTO {
    login: string;
    role: TeacherSubjectRole;
}

export interface UpdateRulePresetDTO {
    raportLevelName: string;
    studentTicketCount: number;
    minimumTokensMatch: number;
    enableNormalization: boolean;
}

export interface UpdateSubjectDTO {
    name: string;
    subjectDescription: string;
    giteaURL: string;
    teachers: TeacherAssignmentDTO[];
    rules: UpdateRulePresetDTO | null;
}

export interface TeacherSearchDTO {
    login: string;
    firstName: string;
    lastName: string;
    email: string;
}