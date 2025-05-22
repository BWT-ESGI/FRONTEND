import api from '../config/axios';

export const fetchRuleFileSuggestions = async () => {
    const { data } = await api.get('/rules/suggestions/files');
    return data;
};

export const fetchRuleArchitectureSuggestions = async () => {
    const { data } = await api.get('/rules/suggestions/architectures');
    return data;
};

export const fetchRulesByDeliverable = async (deliverableId: string) => {
    const { data } = await api.get(`/rules/deliverable/${deliverableId}`);
    return data;
};

export const createRule = async (payload: any) => {
    const { data } = await api.post('/rules', payload);
    return data;
};

export const updateRule = async (id: string, payload: any) => {
    const { data } = await api.put(`/rules/${id}`, payload);
    return data;
};

export const deleteRule = async (id: string) => {
    const { data } = await api.delete(`/rules/${id}`);
    return data;
};
