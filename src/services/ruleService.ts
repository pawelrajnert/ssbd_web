import axiosInstance from "../api/auth/middleware";
import type { RulePresetDTO } from "../types/rule.types";

export const ruleService = {
    getRulePresetsTemplates: async (): Promise<RulePresetDTO[]> => {
        const response = await axiosInstance.get<RulePresetDTO[]>('/rules/templates');
        return response.data;
    }
};