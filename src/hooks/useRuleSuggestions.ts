import { useEffect, useState } from 'react';
import { fetchRuleFileSuggestions, fetchRuleArchitectureSuggestions, createRule, updateRule } from '@/services/ruleService';

export function useRuleSuggestions() {
    const [fileSuggestions, setFileSuggestions] = useState<string[]>([]);
    const [archSuggestions, setArchSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchRuleFileSuggestions(),
            fetchRuleArchitectureSuggestions(),
        ]).then(([files, archs]) => {
            setFileSuggestions(Array.isArray(files) ? files : []);
            setArchSuggestions(Array.isArray(archs) ? archs : []);
            setLoading(false);
        });
    }, []);

    return { fileSuggestions, archSuggestions, loading };
}

export async function submitRule(data: any) {
    if (data.update && data.id) {
        const { update, id, ...rest } = data;
        return updateRule(id, rest);
    }
    return createRule(data);
}
