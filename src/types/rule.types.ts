export interface RulePresetDTO {
    id: string;
    raportLevelName: string;
    studentTicketCount: number;
    minimumTokensMatch: number;
    enableNormalization: boolean;
}

export interface CreateRulePresetDTO {
    raportLevelName: string;
    studentTicketCount: number;
    minimumTokensMatch: number;
    enableNormalization: boolean;
}