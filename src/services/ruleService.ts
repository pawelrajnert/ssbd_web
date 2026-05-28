import axiosInstance from "../api/auth/middleware";
import type {CreateRulePresetDTO, RulePresetDTO, UpdateRulePresetDTO} from "../types/rule.types";

export const ruleService = {
    getRulePresetsTemplates: async (): Promise<RulePresetDTO[]> => {
        const response = await axiosInstance.get<RulePresetDTO[]>('/rules/templates');
        return response.data;
    },
    createRulePreset: async (data: CreateRulePresetDTO): Promise<void> => {
        await axiosInstance.post('/rules/templates', data);
    },
    updateRulePreset: async (id: string, data: UpdateRulePresetDTO): Promise<void> => {
        await axiosInstance.put(`/rules/${id}`, data);
    },
    deleteRulePreset: async (ruleId: string, versionHash: string): Promise<void> => {
        await axiosInstance.delete(`/rules/${ruleId}`, {
            headers: {
                'If-Match': versionHash
            }
        });
    }
};