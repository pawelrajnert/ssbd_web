import axiosInstance from "../api/auth/middleware";
import type {CreateRulePresetDTO, RulePresetDTO} from "../types/rule.types";

export const ruleService = {
    getRulePresetsTemplates: async (): Promise<RulePresetDTO[]> => {
        const response = await axiosInstance.get<RulePresetDTO[]>('/rules/templates');
        return response.data;
    },
    createRulePreset: async (data: CreateRulePresetDTO): Promise<void> => {
        await axiosInstance.post('/rules/templates', data);
    }
};